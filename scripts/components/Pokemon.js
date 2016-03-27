var React = require('react');

var Actions = require('../Actions');
var Utils = require('../Utils');

var Pokemon = React.createClass({

  propTypes: {
    pokemonData: React.PropTypes.object,
  },

  handleClick: function() {
    Actions.select(this.props.pokemonData);
  },

  render: function() {
    return (
      <div>
        <img src={Utils.buildImgUrl(this.props.pokemonData.national_id)}
             onClick={this.handleClick}/>
        <br/>
        <h3>{this.props.pokemonData.name}</h3>
        <br/>
        {this.props.pokemonData.types.map(function(type) {
           return (
             <span key={type.name}
                   className={"pokemonType " + "pokemonType-" + type.name}>
               {type.name}
             </span>
           );
         })}
      </div>
    );
  }
});


module.exports = Pokemon;
