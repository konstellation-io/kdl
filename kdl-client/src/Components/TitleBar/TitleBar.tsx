import './TitleBar.scss';

import { Color, Titlebar } from 'custom-electron-titlebar';
import { Menu, ipcRenderer } from 'electron';
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
    'servers'
  );

  const newMenu: Menu = updateMenu.server(servers);
  titlebar.updateMenu(newMenu);
}

fetchData();

function onStoreUpdate(_: unknown, newServers: Server[]) {
  const newMenu: Menu = updateMenu.server(newServers);
  titlebar.updateMenu(newMenu);
}

ipcRenderer.send('subscribeToValue', 'servers');
ipcRenderer.on('subscribeToValueReply', onStoreUpdate);
