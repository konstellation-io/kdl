import { remote } from 'electron';

const { Menu, MenuItem } = remote;
const menu = new Menu();

menu.append(
  new MenuItem({
    label: 'File',
    submenu: [
      {
        label: 'Info',
        click: () => alert('Info'),
      },
      {
        label: 'Exit',
        accelerator: 'Ctrl+Q',
        enabled: false,
        click: () => alert('Exit'),
      },
    ],
  })
);

menu.append(
  new MenuItem({
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
  })
);

menu.append(
  new MenuItem({
    label: 'Help',
    submenu: [
      {
        label: 'Repository',
        click: () => alert('Repository'),
      },
      {
        label: 'Contact',
        click: () => alert('Contact'),
      },
    ],
  })
);

export default menu;
