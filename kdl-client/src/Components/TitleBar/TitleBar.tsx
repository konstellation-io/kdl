import './TitleBar.scss';

import { Color, Titlebar } from 'custom-electron-titlebar';
import { Menu, ipcRenderer } from 'electron';
import menu, { updateMenu } from './menu';

import { Cluster } from 'Hooks/useClusters';
import logo from './logo.svg';

export const titlebar = new Titlebar({
  backgroundColor: Color.fromHex('#000'),
  icon: logo,
});

titlebar.updateTitle('Konstellation');
titlebar.updateMenu(menu);

async function fetchData() {
  const clusters: Cluster[] = await ipcRenderer.invoke(
    'getStoreValue',
    'clusters'
  );

  const newMenu: Menu = updateMenu.cluster(clusters);
  titlebar.updateMenu(newMenu);
}

fetchData();

function onStoreUpdate(_: unknown, newClusters: Cluster[]) {
  const newMenu: Menu = updateMenu.cluster(newClusters);
  titlebar.updateMenu(newMenu);
}

ipcRenderer.send('subscribeToValue', 'clusters');
ipcRenderer.on('subscribeToValueReply', onStoreUpdate);
