// https://derickbailey.com/2016/03/09/creating-a-true-singleton-in-node-js-with-es6-symbols/
// create a unique, global symbol name
// -----------------------------------

const MODULE_KEY = Symbol.for('App.Ampath.etl');

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

var globalSymbols = Object.getOwnPropertySymbols(global);
var hasFoo = globalSymbols.indexOf(MODULE_KEY) > -1;

if (!hasFoo) {
  global[MODULE_KEY] = {};
}

// define the singleton API
// ------------------------
var cachedAgents = {};
var singleton = {
  saveAgent: function (key, agent) {
    cachedAgents[key] = agent;
  },
  getAgent: function (key) {
    return cachedAgents[key];
  }
};

Object.defineProperty(singleton, 'instance', {
  get: function () {
    return global[MODULE_KEY];
  }
});

// ensure the API is never changed
// -------------------------------

Object.freeze(singleton);

// export the singleton API only
// -----------------------------

module.exports = singleton;
