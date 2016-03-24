var React = require('react');

var Actions = require('../Actions');
var Pokemon = require('./Pokemon');
var PokemonInfo = require('./PokemonInfo');

var PokemonsPane = React.createClass({

  propTypes: {
    pokemonsData: React.PropTypes.array.isRequired,
    selectedPokemon: React.PropTypes.object,
    pokemonsLoading: React.PropTypes.bool.isRequired,
  },

  renderPokemon: function(pokemon) {
    return (<Pokemon key={pokemon.national_id}
                     pokemonData={pokemon} />);
  },

  renderSelectedPokemon: function() {
    if (this.props.selectedPokemon) {
      return (<PokemonInfo pokemonData={this.props.selectedPokemon}/>);
    } else {
      return null;
    }
  },

  renderLoadMoreButton: function() {
    if (this.props.pokemonsLoading) {
      return (
        <p>
          Loading ...
        </p>
      );
    } else {
      return (
        <p onClick={Actions.load}>
          Load more
        </p>);
    }
  },

  render: function() {
    return (
      <div>

        {this.props.pokemonsData.map(this.renderPokemon)}
        {this.renderLoadMoreButton()}
      </div>
    );
  }
});


module.exports = PokemonsPane;
