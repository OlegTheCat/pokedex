var PokemonsPane = React.createClass({
  render: function() {
    return (
      <div>
        <ul>
          {this.props.pokemonsData.map(function(pokemon) {
             return (<li key={pokemon.national_id}>{pokemon.name}</li>);
           })}
        </ul>
        <p onClick={this.props.handleLoad(null)}>
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

  getInitialState: function() {
    console.log("executing getInitialState");
    return {
      initialLoad: false,
      url: "http://pokeapi.co/api/v1/pokemon/?limit=12",
      pokemonsData: []
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
                            handleLoad={this.fetchPokemons}/>);
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
