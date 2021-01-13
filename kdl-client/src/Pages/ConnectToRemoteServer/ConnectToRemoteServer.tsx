import { Button, CHECK, TextInput } from 'kwc';
import ROUTE, { buildRoute } from 'Constants/routes';
import React, { useCallback, useEffect, useState } from 'react';
import StatusCircle, {
  States,
} from 'Components/LottieShapes/StatusCircle/StatusCircle';

import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import IconLink from '@material-ui/icons/Link';
import SidebarBottom from 'Components/Layout/Page/DefaultPage/SidebarBottom';
import { ipcRenderer } from 'electron';
import styles from './ConnectToRemoteServer.module.scss';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import useServers from 'Hooks/useServers';

type ConnectToRemoteServerResponse = {
  serverId?: string;
  success: boolean;
  error?: string;
};

enum ConnectionState {
  CONNECTING = 'CONNECTING',
  OK = 'OK',
  ERROR = 'ERROR',
}

function getStateCircle(state: ConnectionState) {
  switch (state) {
    case ConnectionState.OK:
      return <StatusCircle animation={States.SUCCESS} label="CONNECTED" />;
    case ConnectionState.ERROR:
      return <StatusCircle animation={States.ERROR} label="ERROR" />;
    default:
      return <StatusCircle label="CONNECTING" />;
  }
}

type FormData = {
  serverUrl: string;
};

function ConnectToRemoteServer() {
  const [connectionState, setConnectionState] = useState<ConnectionState>();
  const { servers } = useServers();
  const history = useHistory();

  const {
    handleSubmit,
    setValue,
    unregister,
    register,
    errors,
    setError,
    clearErrors,
  } = useForm<FormData>({ defaultValues: { serverUrl: '' } });

  const validateUrl = useCallback(
    (value: string) => {
      const serverUrls = servers.map((server) => server.url || '');

      return CHECK.getValidationError([
        CHECK.isFieldNotEmpty(value),
        CHECK.isDomainValid(value),
        CHECK.isItemDuplicated(value, serverUrls, 'server URL'),
      ]);
    },
    [servers]
  );

  useEffect(() => {
    register('serverUrl', { validate: validateUrl });
    return () => unregister('serverUrl');
  }, [register, unregister, setValue, validateUrl]);

  useEffect(() => {
    const onConnectToRemoteServerReply = (
      _: unknown,
      { error, success, serverId }: ConnectToRemoteServerResponse
    ) => {
      if (success && !error) {
        setConnectionState(ConnectionState.OK);

        setTimeout(() => {
          history.push(buildRoute.server(ROUTE.SERVER_LOGIN, serverId || ''));
        }, 2000);
      } else {
        setConnectionState(ConnectionState.ERROR);
        setError('serverUrl', { message: error });
      }
    };

    ipcRenderer.on('connectToRemoteServerReply', onConnectToRemoteServerReply);

    return () => {
      ipcRenderer.removeListener(
        'connectToRemoteServerReply',
        onConnectToRemoteServerReply
      );
    };
    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit({ serverUrl }: FormData) {
    ipcRenderer.send('connectToRemoteServer', {
      url: serverUrl,
    });
    setConnectionState(ConnectionState.CONNECTING);
  }

  // Show actions only not connecting or there was a connection error
  let actions = undefined;
  if (
    connectionState === undefined ||
    connectionState === ConnectionState.ERROR
  ) {
    actions = [
      <Button
        label="CANCEL"
        className={styles.cancelButton}
        key="button-2"
        onClick={() => history.goBack()}
      />,
      <Button
        label="CONNECT"
        className={styles.connectButton}
        onClick={handleSubmit(onSubmit)}
        key="button-1"
        primary
      />,
    ];
  }

  return (
    <DefaultPage
      title="Connect to a Remote Server"
      subtitle="Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum."
      actions={actions}
    >
      <div className={styles.container}>
        <p className={styles.title}>How to connect to a Server</p>
        <p className={styles.subtitle}>
          In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam
          volutpat aliquam. Integer et elit eget elit facilisis tristique. Nam
          vel iaculis mauris. Sed ullamcorper tellus erat, non ultrices sem
          tincidunt euismod. Fusce rhoncus porttitor velit, eu bibendum nibh
          aliquet vel. Fusce lorem leo, vehicula at nibh quis, facilisis
          accumsan turpis.
        </p>
        <div className={styles.formServerUrl}>
          <TextInput
            label="server url"
            onChange={(value: string) => {
              errors.serverUrl && clearErrors('serverUrl');
              setValue('serverUrl', value);
            }}
            onEnterKeyPress={handleSubmit(onSubmit)}
            Icon={IconLink}
            error={errors.serverUrl?.message}
            disabled={
              connectionState &&
              [ConnectionState.CONNECTING, ConnectionState.OK].includes(
                connectionState
              )
            }
            showClearButton
          />
        </div>
        {connectionState && (
          <SidebarBottom>
            <div className={styles.loader}>
              {getStateCircle(connectionState)}
            </div>
          </SidebarBottom>
        )}
      </div>
    </DefaultPage>
  );
}

export default ConnectToRemoteServer;
