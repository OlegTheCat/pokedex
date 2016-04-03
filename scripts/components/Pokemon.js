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
      <div className="pokemonContainerOuter col-xs-12 col-sm-6 col-md-4">
        <div className="pokemonContainerInner">
          <img className="pokemonImage"
               src={Utils.buildImgUrl(this.props.pokemonData.national_id)}
               onClick={this.handleClick}/>
          <h4>{this.props.pokemonData.name}</h4>
          <div>
            {this.props.pokemonData.types.map(function(type) {
               return (
                 <span key={type.name}
                       className={"pokemonType " + "pokemonType-" + type.name}>
                   {type.name}
                 </span>
               );
             })}
          </div>
        </div>
      </div>
    );
  }
});


module.exports = Pokemon;
