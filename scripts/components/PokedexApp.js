var React = require('react');
var Store = require('../Store');


var PokedexApp = React.createClass({
  getInitialState: function() {
    return Store.getState();
  },

  _onChange: function() {
    this.setState(Store.getState());
  },

  componentDidMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div>
        <h1 className="header">Pokedex</h1>
      </div>
    );
  }
});

module.exports = PokedexApp;
