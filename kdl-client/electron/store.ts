import { ipcMain } from 'electron';
import store from '../store/store';

interface StoreValue {
  key: string,
  value: string,
}

ipcMain.handle('getStoreValue', (_: unknown, key: string) => {
	return store.get(key);
});

ipcMain.on('setStoreValue', (_: unknown, { key, value }: StoreValue) => {
	store.set(key, value);
});

const subcribedKeys: string[] = [];
ipcMain.on('subscribeToValue', (event: any, key: "servers" | "workspace") => {
  if (!subcribedKeys.includes(key)) {
    store.onDidChange(key, (newValue: unknown, _: unknown) => {
      event.sender.send('subscribeToValueReply', {
        key,
        value: newValue
      });
    });

    subcribedKeys.push(key);
  }
});
