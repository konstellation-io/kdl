import React, { useState } from 'react';

import { Button } from 'kwc';
import ColumnPage from 'Components/Layout/Page/ColumnPage/ColumnPage';
import { ipcRenderer } from 'electron';
import logo from './logo.svg';
import packageJson from '../../../package.json';
import styles from './Home.module.scss';

function Home() {
  const [updateReady, setUpdateReady] = useState(false);

  ipcRenderer.on('updateReady', () => {
    setUpdateReady(true);
  });

  return (
    <ColumnPage
      title="Some title"
      subtitle="Some subtitle"
      onBgClick={() => alert('a')}
    >
      <div className={styles.app}>
        <header className={styles.header}>
          <img src={logo} className={styles.logo} alt="logo" />
          <p>Autoreload is enabled</p>
          {updateReady ? (
            <>
              <h5>UPDATE READY!</h5>
              <Button
                label="UPDATE!"
                primary
                onClick={() => ipcRenderer.send('quitAndInstall')}
              />
            </>
          ) : (
            `v${packageJson.version}`
          )}
        </header>
      </div>
    </ColumnPage>
  );
}

export default Home;
