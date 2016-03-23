var _ = require('underscore');
var $ = require('jquery');
var React = require('react');

var Actions = require('./Actions');
var Store = require('./Store');

var PokemonInfo = React.createClass({

  propTypes: {
    pokemonData: React.PropTypes.object,
  },


  buildImgUrl: function(id) {
    return "http://pokeapi.co/media/img/" + id + ".png"
  },


  pokemonInfoTableData: [
    {
      key: "Type",
      attr: "types",
      format: function(types) {
        return (
          <div>{types.map(function(type) {
              return <div>{type.name}</div>;
            })}
          </div>);
      }
    },
    {
      key: "Attack",
      attr: "attack"
    },
    {
      key: "Defense",
      attr: "defense"
    },
    {
      key: "HP",
      attr: "hp"
    },
    {
      key: "SP Attack",
      attr: "sp_atk"
    },
    {
      key: "SP Defense",
      attr: "sp_def"
    },
    {
      key: "Speed",
      attr: "speed"
    },
    {
      key: "Weight",
      attr: "weight"
    },
    {
      key: "Total moves",
      attr: "moves",
      format: function(moves) {
        return (
          <div>
            {moves.length}
          </div>
        );
      }
    }

  ],

  renderTr: function(key, value) {
    return (
      <tr>
        <td>{key}</td>
        <td>{value}</td>
      </tr>
    );
  },

  renderPokemonAttr: function(keyName, attrName, formatAttr) {
    var formattedAttr = this.props.pokemonData[attrName]
    if (formatAttr) {
      formattedAttr = formatAttr(formattedAttr);
    }
    return this.renderTr(keyName, formattedAttr);
  },

  renderPokemonTableDataItem: function(dataItem) {
    return this.renderPokemonAttr(dataItem.key, dataItem.attr, dataItem.format);
  },

  render: function() {
    return (
      <div>
        <img src={this.buildImgUrl(this.props.pokemonData.national_id)}
             onClick={this.handleClick}/>
        <table>
          <caption>{this.props.pokemonData.name} #{this.props.pokemonData.national_id}</caption>
          <tbody>
            {this.pokemonInfoTableData.map(this.renderPokemonTableDataItem)}
          </tbody>
        </table>
      </div>
    );
  }
});

var Pokemon = React.createClass({

  propTypes: {
    pokemonData: React.PropTypes.object,
    handlePokemonSelect: React.PropTypes.func.isRequired
  },

  buildImgUrl: function(id) {
    return "http://pokeapi.co/media/img/" + id + ".png"
  },

  handleClick: function() {
    this.props.handlePokemonSelect(this.props.pokemonData);
  },

  render: function() {
    return (
      <div>
        <img src={this.buildImgUrl(this.props.pokemonData.national_id)}
             onClick={this.handleClick}/>
        <br/>
        <h3>{this.props.pokemonData.name}</h3>
        <br/>
        {this.props.pokemonData.types.map(function(type) {
           return (
             <div key={type.name}>
               {type.name}
             </div>
           );
         })}
      </div>
    );
  }
});

var PokemonsPane = React.createClass({

  propTypes: {
    pokemonsData: React.PropTypes.array.isRequired,
    selectedPokemon: React.PropTypes.object,
    pokemonsLoading: React.PropTypes.bool.isRequired,
    handleLoad: React.PropTypes.func.isRequired,
    handlePokemonSelect: React.PropTypes.func.isRequired
  },

  renderPokemon: function(pokemon) {
    return (<Pokemon key={pokemon.national_id}
                     pokemonData={pokemon}
                     handlePokemonSelect={this.props.handlePokemonSelect}/>);
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
        <p onClick={this.props.handleLoad}>
          Load more
        </p>);
    }
  },

  render: function() {
    return (
      <div>
        {this.renderSelectedPokemon()}
        {this.props.pokemonsData.map(this.renderPokemon)}
        {this.renderLoadMoreButton()}
      </div>
    );
  }
});

var Pokedex = React.createClass({

  loadPokemons: function(before, complete) {
    console.log("abount to query " + this.state.url);

    $.ajax({
      url: this.state.url,
      datatype: 'json',

      success: function(resp) {
        console.log("successfully fetched from " + this.state.url);

        this.setState({
          pokemonsData: this.state.pokemonsData.concat(resp.objects),
          url: ("http://pokeapi.co" + resp.meta.next)
        });
      }.bind(this),

      error: function(xhr, status, err) {
        console.log("error fetching from" + this.state.url);

        console.error(this.state.url, status, err.toString());
      }.bind(this),

      beforeSend: function() {
        if (before) { before(); }
        return true;
      },
      complete: complete
    });
  },

  initialPokemonsFetch: function() {
    var before = function() {
      this.setState({initialPokemonsLoading: true});
    }.bind(this);

    var complete = function() {
      this.setState({initialPokemonsLoading: false});
    }.bind(this);

    this.loadPokemons(before, complete);
  },

  pokemonsFetch: function() {
    var before = function() {
      this.setState({pokemonsLoading: true});
    }.bind(this);

    var complete = function() {
      this.setState({pokemonsLoading: false});
    }.bind(this);

    this.loadPokemons(before, complete);
  },

  selectPokemon: function(pokemon) {
    this.setState({selectedPokemon: pokemon});
  },

  getInitialState: function() {
    return {
      initialPokemonsLoading: false,
      pokemonsLoading: false,
      url: "http://pokeapi.co/api/v1/pokemon/?limit=12",
      pokemonsData: [],
      selectedPokemon: null
    };
  },

  componentWillMount: function() {
    this.initialPokemonsFetch();
  },

  render: function() {
    if (this.state.initialPokemonsLoading) {
      return (<div> Loading data </div>);
    } else {
      return (<PokemonsPane pokemonsData={this.state.pokemonsData}
                            selectedPokemon={this.state.selectedPokemon}
                            pokemonsLoading={this.state.pokemonsLoading}
                            handleLoad={this.pokemonsFetch}
                            handlePokemonSelect={this.selectPokemon}/>);
    }
  }
});


var PokedexRoot = React.createClass({
  render: function() {
    return (
      <div>
        <h1 className="header">Pokedex</h1>
        <Pokedex/>
      </div>
    );
  }
});

module.exports = PokedexRoot;
