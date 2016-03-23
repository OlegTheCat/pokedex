var AppDispatcher = require('./AppDispatcher');
var Constants = require('./Constants');

var Actions = {
    initialLoad: function() {
        AppDispatcher.dispatch({
            actionType: Constants.INITIAL_LOAD
        });
    },

    load: function() {
        AppDispatcher.dispatch({
            actionType: Constants.LOAD
        });
    },

    select: function(pokemon) {
        AppDispatcher.dispatch({
            actionType: Constants.SELECT,
            pokemon: pokemon
        });
    }

};

module.exports = Actions;
