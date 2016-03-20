var PokemonInfo = React.createClass({
  render: function() {
    return (
      <div>
        Selected pokemon
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
