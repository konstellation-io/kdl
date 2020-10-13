import './App.scss';

import React, { useState } from 'react';

import { Button } from 'kwc';
import { ipcRenderer } from 'electron';
import logo from './logo.svg';
import packageJson from '../package.json';

type Sample = {
  work: string;
  number?: number;
};

function App() {
  const [updateReady, setUpdateReady] = useState(false);

  ipcRenderer.on('updateReady', () => {
    setUpdateReady(true);
  });

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>Autoreload is enabled</p>
        {updateReady ? (
          <>
            <h5>UPDATE READY!</h5>
            <Button
              label='UPDATE!'
              primary
              onClick={() => ipcRenderer.send('quitAndInstall')}
            />
          </>
        ) : (
          `v${packageJson.version}`
        )}
      </header>
    </div>
  );
}

export default App;
