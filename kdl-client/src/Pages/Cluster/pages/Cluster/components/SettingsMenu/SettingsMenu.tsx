import {
  BUTTON_ALIGN,
  Button,
  ModalContainer,
  ModalLayoutInfo,
  useClickOutside,
} from 'kwc';
import ROUTE, { RouteClusterParams } from 'Constants/routes';
import React, { memo, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';
import { GetMe } from 'Graphql/queries/types/GetMe';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import cx from 'classnames';
import { ipcRenderer } from 'electron';
import { loader } from 'graphql.macro';
import styles from './SettingsMenu.module.scss';
import { useQuery } from '@apollo/client';

const GetMeQuery = loader('Graphql/queries/getMe.graphql');

const BUTTON_HEIGHT = 40;
const buttonStyle = {
  paddingLeft: '20%',
};

function SettingsMenu() {
  const history = useHistory();
  const { data } = useQuery<GetMe>(GetMeQuery);
  const clusterId = useParams<RouteClusterParams>();
  const [opened, setOpened] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const settingsRef = useRef(null);
  const { addClickOutsideEvents, removeClickOutsideEvents } = useClickOutside({
    componentRef: settingsRef,
    action: close,
  });

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  function doLogout() {
    // TODO: impletent this will main process
    ipcRenderer.send('clusterLogout', clusterId);
    history.push(ROUTE.HOME);
  }

  function close() {
    setOpened(false);
    removeClickOutsideEvents();
  }

  function open() {
    if (!opened) {
      setOpened(true);
      addClickOutsideEvents();
    }
  }

  function getBaseProps(label: string) {
    return {
      label: label.toUpperCase(),
      key: `button${label}`,
      align: BUTTON_ALIGN.LEFT,
      style: buttonStyle,
    };
  }

  const logoutButton = (
    <Button {...getBaseProps('Logout')} onClick={openModal} Icon={LogoutIcon} />
  );
  const exitButton = (
    <Button {...getBaseProps('Exit')} to={ROUTE.HOME} Icon={CloseIcon} />
  );

  const buttons: JSX.Element[] = [exitButton, logoutButton];

  const nButtons = buttons.length;
  const optionsHeight = nButtons * BUTTON_HEIGHT;

  return (
    <div
      className={cx(styles.container, { [styles['is-open']]: opened })}
      onClick={open}
      data-testid="settingsContainer"
    >
      <div className={styles.label} data-testid="settings-label">
        {data?.me?.email}
      </div>
      <div
        ref={settingsRef}
        className={styles.options}
        style={{ maxHeight: opened ? optionsHeight : 0 }}
        data-testid="settingsContent"
      >
        {buttons}
      </div>
      {showModal && (
        <ModalContainer
          title="YOU ARE ABOUT TO SIGN OUT THIS CLUSTER"
          actionButtonLabel="SIGN OUT"
          onAccept={doLogout}
          onCancel={closeModal}
          blocking
        >
          <ModalLayoutInfo>
            <p className={styles.logoutMessage}>
              You will be redirected to Cluster list. To access this cluster
              again, you will have to sign in again.
            </p>
          </ModalLayoutInfo>
        </ModalContainer>
      )}
    </div>
  );
}

export default memo(SettingsMenu);
