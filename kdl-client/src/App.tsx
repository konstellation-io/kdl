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

  ipcRenderer.on('updateReady', (event, text) => {
    setUpdateReady(true);
  });

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
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
