var React = require('react');

var Actions = require('../Actions');
var PokemonsPane = require('./PokemonsPane');

var Pokedex = React.createClass({

  componentWillMount: function() {
    console.log('executing componentWillMount');
    Actions.initialLoad();
  },

  render: function() {
    if (this.props.world.initialPokemonsLoading) {
      return (<div> Loading data </div>);
    } else {
      return (<PokemonsPane pokemonsData={this.props.world.pokemonsData}
                            selectedPokemon={this.props.world.selectedPokemon}
                            pokemonsLoading={this.props.world.pokemonsLoading} />);
    }
  }
});

module.exports = Pokedex;
