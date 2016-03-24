var React = require('react');

var Actions = require('../Actions');

var Pokemon = React.createClass({

  propTypes: {
    pokemonData: React.PropTypes.object,
  },

  buildImgUrl: function(id) {
    return "http://pokeapi.co/media/img/" + id + ".png"
  },

  handleClick: function() {
    Actions.select(this.props.pokemonData);
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


module.exports = Pokemon;
