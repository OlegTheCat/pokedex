var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Immutable = require('immutable');
var AppDispatcher = require('./AppDispatcher');
var Constants = require('./Constants');

var CHANGE_EVENT = 'change';

var StateClass = Immutable.Record({
  initialPokemonsLoading: false,
  pokemonsLoading: false,
  url: "http://pokeapi.co/api/v1/pokemon/?limit=12",
  pokemonsData: [],
  selectedPokemon: null
});


var Store = assign({}, EventEmitter.prototype, {
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

  get: function(k) {
    return this.state.get(k);
  },

  getState: function() {
    return this.state.toJSON();
  }

});

function loadPokemons(before, complete) {
  console.log("abount to query " + this.state.url);

  $.ajax({
    url: Store.get('url'),
    datatype: 'json',

    success: function(resp) {
      console.log("successfully fetched from " + this.state.url);

      Store.set('pokemonsData', resp.objects);
      Store.set('url', "http://pokeapi.co" + resp.meta.next);
    },

    error: function(xhr, status, err) {
      console.log("error fetching from" + this.state.url);
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
    Store.set('pokemonsLoading', true);
  };

  var complete = function() {
    Store.set('pokemonsLoading', false);
  };

  loadPokemons(before, complete);
}

function selectPokemon(pokemon) {
  Store.set('selectedPokemon', pokemon);
}


AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case Constants.INTIAL_LOAD:
      initialPokemonsFetch();
      break;

    case Constants.LOAD:
      pokemonsFetch();
      break;

    case Constants.SELECT:
      selectPokemon(action.pokemon);
      break;


    default:
      // no op
  }
});

module.exports = Store;
