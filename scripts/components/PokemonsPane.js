var React = require('react');

var Actions = require('../Actions');
var Pokemon = require('./Pokemon');
var PokemonInfo = require('./PokemonInfo');
var Filter = require('./Filter');

var PokemonsPane = React.createClass({

  propTypes: {
    pokemonsData: React.PropTypes.array.isRequired,
    pokemonTypes: React.PropTypes.array.isRequired,
    selectedPokemon: React.PropTypes.object,
    pokemonsLoading: React.PropTypes.bool.isRequired,
    currentFilters: React.PropTypes.object.isRequired
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

  renderFilter: function() {
    return (<Filter pokemonsData={this.props.pokemonsData}
                    pokemonTypes={this.props.pokemonTypes}
                    currentFilters={this.props.currentFilters} />);
  },

  render: function() {
    return (
      <div className="container">
        <div className="col-xs-12">
          {this.renderFilter()}
        </div>
        <div className="container col-xs-12">
          <div className="container col-xs-6 col-sm-8 col-md-9">
            {this.props.pokemonsData.map(this.renderPokemon)}
          </div>
          <div className="col-xs-6 col-sm-4 col-md-3">
            {this.renderSelectedPokemon()}
          </div>
        </div>
        <div className="col-xs-12">
          {this.renderLoadMoreButton()}
        </div>
      </div>
    );
  }
});


module.exports = PokemonsPane;
