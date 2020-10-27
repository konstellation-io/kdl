const store = require('../store/store');
const { ipcMain } = require('electron');

ipcMain.handle('getStoreValue', (_, key) => {
	return store.get(key);
});

ipcMain.handle('setStoreValue', (_, { key, value }) => {
	return store.set(key, value);
});

ipcMain.on('subscribeToValue', (event, key) => {
  store.onDidChange(key, (newValue, _) => {
    event.sender.send('subscribeToValueReply', newValue);
  });
});
