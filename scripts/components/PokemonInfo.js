var React = require('react');

var Utils = require('../Utils');

var PokemonInfo = React.createClass({

  propTypes: {
    pokemonData: React.PropTypes.object,
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
      <tr className="pokemonTableElement">
        <td className="pokemonTableElement">{key}</td>
        <td className="pokemonTableElement">{value}</td>
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
      <div className="affix" style={{alignItems: "center"}}>
        <img src={Utils.buildImgUrl(this.props.pokemonData.national_id)} />
        <table className="pokemonInfoTable">
          <caption style={{textAlign: "center"}}>
            {this.props.pokemonData.name}&nbsp;#{this.props.pokemonData.national_id}
          </caption>
          <tbody>
            {this.pokemonInfoTableData.map(this.renderPokemonTableDataItem)}
          </tbody>
        </table>
      </div>
    );
  }
});


module.exports = PokemonInfo;
