var React = require('react');
var _ = require('underscore');

var Actions = require('../Actions');

var Filter = React.createClass({
  propTypes: {
    pokemonsData: React.PropTypes.array.isRequired,
    pokemonTypes: React.PropTypes.array.isRequired,
    currentFilters: React.PropTypes.object.isRequired
  },

  countTypes: function() {
    return _.chain(this.props.pokemonsData)
            .pluck('types')
            .flatten()
            .pluck('name')
            .countBy(_.identity)
            .value();
  },

  onCheckboxChange: function(typeName, e) {
    Actions.filter(typeName, e.target.checked);
  },

  renderFilterCheckbox: function(typesCount, type) {
    var count = typesCount[type.name];

    return (
      <label className="col-xs-4 col-sm-3 col-md-12"
             key={type.name}>
        <input type="checkbox"
               disabled={!count}
               checked={this.props.currentFilters[type.name]}
               onChange={_.partial(this.onCheckboxChange, type.name)} />
        {type.name} ({count || 0})
    </label>);
  },

  render: function() {
    var typesCount = this.countTypes();

    return (
      <div className="container col-xs-11 col-md-12"
           style={{float: "left"}}>
        {_.map(this.props.pokemonTypes, _.partial(this.renderFilterCheckbox, typesCount))}
      </div>
    );
  }
});

module.exports = Filter;
