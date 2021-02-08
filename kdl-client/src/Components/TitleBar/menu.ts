import * as LINK from 'Constants/konstellationLinks';

import {
  ipcRenderer,
  MenuItemConstructorOptions,
  remote,
  shell,
} from 'electron';
import ROUTE from 'Constants/routes';
import { Server, ServerType } from 'Hooks/useServers';

import history from 'browserHistory';

const MAIL_SUBJECT = 'Contact';

const { Menu } = remote;

// FIXME: use Server page and useEffect to handle this logic.
function handleOptionClick(route: ROUTE) {
  ipcRenderer.send('closeServer');
  history.push(route);
}

// TODO: fix typings

export const updateMenu = {
  server: (servers: Server[]) => {
    const localServer = servers.find((c) => c.type === ServerType.LOCAL);
    const remoteServers = servers.filter((c) => c.type === ServerType.REMOTE);

    // @ts-ignore
    const serversMenu: MenuItemConstructorOptions = template[0].submenu[2];

    if (servers.length !== 0) {
      serversMenu.enabled = true;
      // @ts-ignore
      template[0].submenu[1].enabled = true;
    }

    // @ts-ignore
    const serversSubMenu: MenuItemConstructorOptions[] = serversMenu.submenu;
    serversSubMenu.length = 0;

    if (localServer) {
      // @ts-ignore
      const addServerMenu: MenuItemConstructorOptions = template[0].submenu[0];
      addServerMenu.click = () =>
        handleOptionClick(ROUTE.CONNECT_TO_REMOTE_SERVER);

      serversSubMenu.push(
        {
          label: localServer.name,
          click: () => {
            // FIXME: Change for the right url, probably the url of the local server.
            // history.push(buildRoute.server(ROUTE.SERVER, localServer.id)),
          },
        },
        {
          type: 'separator',
        }
      );
    }

    remoteServers.forEach((server) => {
      serversSubMenu.push({
        label: server.name,
        click: () => {
          // FIXME: Change for the right url, probably the url of the remote server.
          // history.push(buildRoute.server(ROUTE.SERVER, server.id));
        },
      });
    });

    return Menu.buildFromTemplate(template);
  },
};

const template: MenuItemConstructorOptions[] = [
  {
    label: 'Server',
    submenu: [
      {
        label: 'Add Server',
        click: () => handleOptionClick(ROUTE.CONNECT_TO_REMOTE_SERVER),
      },
      {
        label: 'View all Servers',
        enabled: false,
        click: () => handleOptionClick(ROUTE.HOME),
      },
      {
        label: 'Go to Server...',
        enabled: false,
        submenu: [],
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      {
        label: 'Copy',
        accelerator: 'Ctrl+C',
        click: () => alert('Copy'),
      },
      {
        label: 'Paste',
        accelerator: 'Ctrl+V',
        click: () => alert('Paste'),
      },
      {
        label: 'Cut',
        accelerator: 'Ctrl+X',
        click: () => alert('Cut'),
      },
      {
        type: 'separator',
      },
      {
        label: 'Select All',
        accelerator: 'Ctrl+A',
        click: () => alert('Select All'),
      },
    ],
  },
  {
    label: 'About',
    submenu: [
      {
        label: 'Repository',
        click: () => shell.openExternal(LINK.REPOSITORY_URL),
      },
      {
        label: 'Documentation',
        click: () => shell.openExternal(LINK.DOCUMENTATION_URL),
      },
      {
        label: 'Contact',
        click: () =>
          `mailto:${LINK.MAIL_SUPPORT}?subject=${MAIL_SUBJECT}&body=`,
      },
    ],
  },
  {
    label: 'Help',
  },
];

const menu = Menu.buildFromTemplate(template);

export default menu;
