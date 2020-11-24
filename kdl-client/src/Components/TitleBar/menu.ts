import * as LINK from 'Constants/konstellationLinks';

import { Cluster, ClusterType } from 'Hooks/useClusters';
import { MenuItemConstructorOptions, remote, shell } from 'electron';
import ROUTE, { buildRoute } from 'Constants/routes';

import history from 'browserHistory';

const MAIL_SUBJECT = 'Contact';

const { Menu } = remote;

// TODO: fix typings

export const updateMenu = {
  cluster: (clusters: Cluster[]) => {
    const localCluster = clusters.find((c) => c.type === ClusterType.LOCAL);
    const remoteClusters = clusters.filter(
      (c) => c.type === ClusterType.REMOTE
    );

    // @ts-ignore
    const clustersMenu: MenuItemConstructorOptions = template[0].submenu[2];

    if (clusters.length !== 0) {
      clustersMenu.enabled = true;
      // @ts-ignore
      template[0].submenu[1].enabled = true;
    }

    // @ts-ignore
    const clustersSubMenu: MenuItemConstructorOptions[] = clustersMenu.submenu;
    clustersSubMenu.length = 0;

    if (localCluster) {
      // @ts-ignore
      const addClusterMenu: MenuItemConstructorOptions = template[0].submenu[0];
      addClusterMenu.click = () =>
        history.push(ROUTE.CONNECT_TO_REMOTE_CLUSTER);

      clustersSubMenu.push(
        {
          label: localCluster.name,
          click: () =>
            history.push(buildRoute.cluster(ROUTE.CLUSTER, localCluster.id)),
        },
        {
          type: 'separator',
        }
      );
    }

    remoteClusters.forEach((cluster) => {
      clustersSubMenu.push({
        label: cluster.name,
        click: () =>
          history.push(buildRoute.cluster(ROUTE.CLUSTER, cluster.id)),
      });
    });

    return Menu.buildFromTemplate(template);
  },
};

const template: MenuItemConstructorOptions[] = [
  {
    label: 'Cluster',
    submenu: [
      {
        label: 'Add Cluster',
        click: () => history.push(ROUTE.NEW_CLUSTER),
      },
      {
        label: 'View all Clusters',
        enabled: false,
        click: () => history.push(ROUTE.HOME),
      },
      {
        label: 'Go to Cluster...',
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
