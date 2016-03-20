var PokemonsPane = React.createClass({
  render: function() {
    return (
      <ul>
        {this.props.pokemonsData.map(function(pokemon) {
           return (<li key={pokemon.national_id}>{pokemon.name}</li>);
         })}
      </ul>
    );
  }
});

var Pokedex = React.createClass({

  getInitialState: function() {
    console.log("executing getInitialState");
    return {
      isLoading: false,
      url: "http://pokeapi.co/api/v1/pokemon/?limit=12",
      pokemonsData: []
    };
  },

  componentWillMount: function() {
    console.log("executing componentWillMount");
    this.setState({isLoading: true});


    console.log("abount to query " + this.state.url);
    $.ajax({
      url: this.state.url,
      datatype: 'json',

      success: function(resp) {
        console.log("successfully fetched from " + this.state.url);
        this.setState({
          pokemonsData: this.state.pokemonsData.concat(resp.objects),
          isLoading: false,
          url: resp.meta.next
        });
      }.bind(this),

      error: function(xhr, status, err) {
        console.log("error fetching from" + this.state.url);
        console.error(this.state.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    if (this.state.isLoading) {
      return (<div> Loading data </div>);
    } else {
      return (<PokemonsPane pokemonsData={this.state.pokemonsData}/>);
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
