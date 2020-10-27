const schema = require('./schema.js');
const Store = require('electron-store');

const store = new Store({ schema });
store.clear();

module.exports = store;
