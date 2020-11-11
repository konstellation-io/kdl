import { ipcMain } from 'electron';
import store from '../store/store';

interface StoreValue {
  key: string,
  value: string,
}

ipcMain.handle('getStoreValue', (_: unknown, key: string) => {
	return store.get(key);
});

ipcMain.handle('setStoreValue', (_: unknown, { key, value }: StoreValue) => {
	return store.set(key, value);
});

ipcMain.on('subscribeToValue', (event: any, key: "clusters") => {
  store.onDidChange(key, (newValue: unknown, _: unknown) => {
    event.sender.send('subscribeToValueReply', newValue);
  });
});
