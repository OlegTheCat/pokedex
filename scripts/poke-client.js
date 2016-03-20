var PokemonInfo = React.createClass({

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

  render: function() {
    return (
      <div>
        {this.renderSelectedPokemon()}
        {this.props.pokemonsData.map(this.renderPokemon)}

        <p onClick={this.props.handleLoad}>
          Load more
        </p>
      </div>
    );
  }
});

var Pokedex = React.createClass({

  fetchPokemons: function(complete) {
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

      complete: complete
    });
  },

  selectPokemon: function(pokemon) {
    this.setState({selectedPokemon: pokemon});
  },

  getInitialState: function() {
    console.log("executing getInitialState");
    return {
      initialLoad: false,
      url: "http://pokeapi.co/api/v1/pokemon/?limit=12",
      pokemonsData: [],
      selectedPokemon: null
    };
  },

  componentWillMount: function() {
    console.log("executing componentWillMount");
    this.setState({initialLoad: true});

    this.fetchPokemons(function() {
      this.setState({initialLoad: false});
    }.bind(this));
  },

  render: function() {
    if (this.state.initialLoad) {
      return (<div> Loading data </div>);
    } else {
      return (<PokemonsPane pokemonsData={this.state.pokemonsData}
                            selectedPokemon={this.state.selectedPokemon}
                            handleLoad={this.fetchPokemons}
                            handlePokemonSelect={this.selectPokemon}/>);
    }
  }
});


var PokedexRoot = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Pokedex</h2>
        <Pokedex/>
      </div>
    );
  }
});

ReactDOM.render(
  <PokedexRoot/>,
  document.getElementById("container")
);
