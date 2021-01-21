import React, { useEffect, useMemo, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import TopBar from './components/TopBar/TopBar';
import { ToolTypes } from './Tools';

const { BrowserWindow } = require('electron').remote;
export const channelName = 'send-message';

function useBrowserWindows() {
  const [windows, setWindows] = useState(new Map<ToolTypes, number>());

  const removeAllListeners = () => {
    BrowserWindow.getAllWindows().forEach((bw: any) =>
      bw.removeAllListeners('closed')
    );
  };

  const getWindowsByType = (type: ToolTypes) => {
    const windowId = windows.get(type);
    if (windowId) return BrowserWindow.fromId(windowId);
  };

  const openWindow = (url: string, type: ToolTypes, icon: string) => {
    if (windows.has(type)) {
      getWindowsByType(type).focus();
      return;
    }

    const win = new BrowserWindow({
      icon,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    win.webContents.on('did-finish-load', () => {
      const componentAsString = ReactDOMServer.renderToString(<TopBar />);
      const code = buildCodeToExecute(componentAsString, channelName);
      win.webContents.executeJavaScript(code);
    });
    win.on('closed', () => removeWindow(type));
    win.loadURL(url);
    setWindows(
      new Map<ToolTypes, number>([...windows, [type, win.id]])
    );
  };

  const removeWindow = (type: ToolTypes) => {
    const newWindows = new Map<ToolTypes, number>(windows);
    newWindows.delete(type);
    setWindows(newWindows);
  };

  const buildCodeToExecute = (
    componentAsString: string,
    channelName: string
  ) => `
        document.body.innerHTML = '${componentAsString}' + document.body.innerHTML;
        const onButtonClick = (button) => {
          const { ipcRenderer } = require('electron')
          ipcRenderer.send('${channelName}', 'Hi from ' + button + ' button!')
        }
        document.getElementById('sendFirstMessage').addEventListener('click', () => onButtonClick('first'))
        document.getElementById('sendSecondMessage').addEventListener('click', () => onButtonClick('second'))
      `;

  return {
    openWindow,
    removeAllListeners,
  };
}

export default useBrowserWindows;
