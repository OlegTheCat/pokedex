var React = require('react');
var _ = require('underscore');

var Actions = require('../Actions');
var PokemonsPane = require('./PokemonsPane');

var Pokedex = React.createClass({

  componentWillMount: function() {
    Actions.initialLoad();
  },

  satisfiesFilters: function(pokemon) {
    return _.chain(this.props.world.currentFilters)
            .keys()
            .difference(_.pluck(pokemon.types, 'name'))
            .isEmpty()
            .value();
  },

  filterPokemonsData: function() {
    if (_.isEmpty(this.props.world.currentFilters)) {
      return this.props.world.pokemonsData;
    } else {
      return _.filter(this.props.world.pokemonsData, this.satisfiesFilters);
    }
  },


  render: function() {
    if (this.props.world.initialPokemonsLoading || this.props.world.typesLoading) {
      return (<div> Loading data </div>);
    } else {
      var propsToPass = _.pick(this.props.world, ['pokemonTypes',
                                                  'selectedPokemon',
                                                  'pokemonsLoading',
                                                  'currentFilters']);

      return (<PokemonsPane pokemonsData={this.filterPokemonsData()}
                            {...propsToPass} />);
    }
  }
});

module.exports = Pokedex;
