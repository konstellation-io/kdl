import './TitleBar.scss';

import { Color, Titlebar } from 'custom-electron-titlebar';
import { Menu, ipcRenderer } from 'electron';
import { StoreKey, StoreUpdate } from 'types/store';
import menu, { updateMenu } from './menu';

import { Server } from 'Hooks/useServers';
import logo from './logo.svg';

export const titlebar = new Titlebar({
  backgroundColor: Color.fromHex('#000'),
  icon: logo,
});

titlebar.updateTitle('Konstellation');
titlebar.updateMenu(menu);

async function fetchData() {
  const servers: Server[] = await ipcRenderer.invoke(
    'getStoreValue',
    StoreKey.SERVERS
  );

  const newMenu: Menu = updateMenu.server(servers);
  titlebar.updateMenu(newMenu);
}

fetchData();

function onStoreUpdate(_: unknown, { key, value }: StoreUpdate) {
  if (key === StoreKey.SERVERS) {
    const newMenu: Menu = updateMenu.server(value);
    titlebar.updateMenu(newMenu);
  }
}

ipcRenderer.send('subscribeToValue', StoreKey.SERVERS);
ipcRenderer.on('subscribeToValueReply', onStoreUpdate);
