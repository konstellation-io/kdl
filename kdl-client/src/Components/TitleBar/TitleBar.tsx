import './TitleBar.scss';

import { Color, Titlebar } from 'custom-electron-titlebar';

import logo from './logo.svg';
import menu from './menu';
import packageJson from '../../../package.json';

const titlebar = new Titlebar({
  backgroundColor: Color.fromHex('#000'),
  icon: logo,
});

titlebar.updateTitle(`Konstellation - v${packageJson.version}`);
titlebar.updateMenu(menu);
