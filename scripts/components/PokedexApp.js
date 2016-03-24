var React = require('react');
var Store = require('../Store');
var Pokedex = require('./Pokedex');

var PokedexApp = React.createClass({
  getInitialState: function() {
    return Store.getState();
  },

  _onChange: function() {
    this.setState(Store.getState());
  },

  componentWillMount: function() {
    Store.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    Store.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <div>
        <h1 className="header">Pokedex</h1>
        <Pokedex world={this.state}/>
      </div>
    );
  }
});

module.exports = PokedexApp;
