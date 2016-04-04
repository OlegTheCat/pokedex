var EventEmitter = require('events').EventEmitter;
var Immutable = require('immutable');
var $ = require('jquery');
var _ = require('underscore');

var AppDispatcher = require('./AppDispatcher');
var Constants = require('./Constants');
var Utils = require('./Utils');
var Config = require('./Config');

var CHANGE_EVENT = 'change';

var StateClass = Immutable.Record({
  initialPokemonsLoading: false,
  pokemonsLoading: false,
  typesLoading: false,
  url: Utils.buildPokemonUrl({limit: Config.POKEMON_LIMIT}),
  pokemonsData: [],
  pokemonTypes: [],
  currentFilters: {},
  selectedPokemon: null
});


var Store = _.create(EventEmitter.prototype, {
  state: StateClass(),

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  set: function(k, v) {
    this.state = this.state.set(k, v);
    this.emitChange();
  },

  assign: function(o) {
    this.state = _.reduce(o,
                          function(acc, v, k) {
                            return acc.set(k, v);
                          },
                          this.state);
    this.emitChange();
  },

  get: function(k) {
    return this.state.get(k);
  },

  getState: function() {
    return this.state.toJSON();
  }

});

// TODO: abort queries if the root component is unmounted

function loadPokemons(before, complete) {
  console.log("abount to query " + Store.get('url'));

  $.ajax({
    url: Store.get('url'),
    datatype: 'json',

    success: function(resp) {
      console.log("successfully fetched from " + Store.get('url'));

      Store.assign({
        pokemonsData: Store.get('pokemonsData').concat(resp.objects),
        url: Config.DOMAIN + resp.meta.next
      });
    },

    error: function(xhr, status, err) {
      console.log("error fetching from" + Store.get('url'));
      console.error(Store.get('url'), status, err.toString());
    },

    beforeSend: function() {
      if (before) { before(); }
      return true;
    },
    complete: complete
  });
}

function initialPokemonsFetch() {
  var before = function() {
    Store.set('initialPokemonsLoading', true);
  };

  var complete = function() {
    Store.set('initialPokemonsLoading', false);
  };

  loadPokemons(before, complete);
}

function pokemonsFetch() {
  var before = function() {
    Store.assign({
      pokemonsLoading: true,
      currentFilters: {}
    });
  };

  var complete = function() {
    Store.set('pokemonsLoading', false);
  };

  loadPokemons(before, complete);
}

function typesFetch() {

  var url = Utils.buildTypeUrl({limit: 0});

  $.ajax({
    url: url,
    datatype: 'json',

    success: function(resp) {
      console.log("successfully fetched from " + url);
      Store.set('pokemonTypes',
                // WAT?
                // fetched type has capitalized name,
                // but type name in pokemon structure is downcased
                _.map(resp.objects,
                      function(type) {
                        return _.extend(type, {name: type.name.toLowerCase()});
                      }));
    },

    error: function(xhr, status, err) {
      console.log("error fetching from" + url);
      console.error(url, status, err.toString());
    },

    beforeSend: function() {
      Store.set('typesLoading', true);
      return true;
    },
    complete: function() {
      Store.set('typesLoading', false);
    }
  });

}

function selectPokemon(pokemon) {
  Store.set('selectedPokemon', pokemon);
}

function addFilter(typeName) {
  var newFilter = {};
  newFilter[typeName] = true;

  Store.set('currentFilters', _.extend(Store.get('currentFilters'), newFilter));
}

function removeFilter(typeName) {
  Store.set('currentFilters', _.omit(Store.get('currentFilters'), typeName));
}


AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.INITIAL_LOAD:
      initialPokemonsFetch();
      typesFetch();
      break;

    case Constants.LOAD:
      pokemonsFetch();
      break;

    case Constants.SELECT:
      selectPokemon(action.pokemon);
      break;

    case Constants.FILTER:
      if (action.doAdd) {
        addFilter(action.typeName);
      } else {
        removeFilter(action.typeName);
      }
      break;

    default:
      // no op
  }
});

module.exports = Store;
