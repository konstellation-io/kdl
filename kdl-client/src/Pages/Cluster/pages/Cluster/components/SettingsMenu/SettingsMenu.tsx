import {
  BUTTON_ALIGN,
  Button,
  CustomOptionProps,
  ModalContainer,
  ModalLayoutInfo,
  Select,
  SelectTheme,
} from 'kwc';
import ROUTE, { RouteClusterParams } from 'Constants/routes';
import React, { FunctionComponent, memo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import CloseIcon from '@material-ui/icons/Close';
import { GetMe } from 'Graphql/queries/types/GetMe';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import { ipcRenderer } from 'electron';
import { loader } from 'graphql.macro';
import styles from './SettingsMenu.module.scss';
import { useQuery } from '@apollo/client';

const GetMeQuery = loader('Graphql/queries/getMe.graphql');

interface SettingsButtonProps extends CustomOptionProps {
  onClick: () => void;
  Icon: FunctionComponent;
}
function SettingsButton({ label, onClick, Icon }: SettingsButtonProps) {
  return (
    <Button
      label={label.toUpperCase()}
      onClick={onClick}
      Icon={Icon}
      key={`button${label}`}
      className={styles.settingButton}
      align={BUTTON_ALIGN.LEFT}
    />
  );
}

function SettingsMenu() {
  const history = useHistory();
  const { data } = useQuery<GetMe>(GetMeQuery);
  const clusterId = useParams<RouteClusterParams>();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  function doLogout() {
    // TODO: impletent this will main process
    ipcRenderer.send('clusterLogout', clusterId);
    history.push(ROUTE.HOME);
  }

  function doDisconnect() {
    history.push(ROUTE.HOME);
  }

  function LogoutButton({ label }: CustomOptionProps) {
    return (
      <SettingsButton Icon={LogoutIcon} onClick={openModal} label={label} />
    );
  }

  function DisconnectButton({ label }: CustomOptionProps) {
    return (
      <SettingsButton Icon={CloseIcon} onClick={doDisconnect} label={label} />
    );
  }

  const optionToButton = {
    disconnect: DisconnectButton,
    signOut: LogoutButton,
  };

  return (
    <div>
      <Select
        label=""
        placeholder={data?.me?.email}
        options={Object.keys(optionToButton)}
        theme={SelectTheme.DARK}
        CustomOptions={optionToButton}
        className={styles.settings}
        showSelectAllOption={false}
      />
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
