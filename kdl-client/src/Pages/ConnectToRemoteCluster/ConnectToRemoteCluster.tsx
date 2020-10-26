import { Button, CHECK, TextInput } from 'kwc';
import ROUTE, { buildRoute } from 'Constants/routes';
import React, { useCallback, useEffect, useState } from 'react';
import StatusCircle, {
  States,
} from 'Components/LottieShapes/StatusCircle/StatusCircle';

import ColumnPage from 'Components/Layout/Page/ColumnPage/ColumnPage';
import { ipcRenderer } from 'electron';
import styles from './ConnectToRemoteCluster.module.scss';
import useClusters from 'Hooks/useClusters';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

type ConnectToRemoteClusterResponse = {
  clusterId?: string;
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
  clusterName: string;
  clusterUrl: string;
};

function ConnectToRemoteCluster() {
  const [connectionState, setConnectionState] = useState<ConnectionState>();
  const { clusters } = useClusters();
  const history = useHistory();

  const {
    handleSubmit,
    setValue,
    unregister,
    register,
    errors,
    setError,
  } = useForm<FormData>({ defaultValues: { clusterUrl: '', clusterName: '' } });

  const validateUrl = useCallback(
    (value: string) => {
      const clusterUrls = clusters.map((cluster) => cluster.url || '');

      return CHECK.getValidationError([
        CHECK.isFieldNotEmpty(value),
        CHECK.isDomainValid(value),
        CHECK.isItemDuplicated(value, clusterUrls, 'cluster URL'),
      ]);
    },
    [clusters]
  );

  const validateName = useCallback(
    (value: string) => {
      const clusterNames = clusters.map((cluster) => cluster.name);

      return CHECK.getValidationError([
        CHECK.isFieldNotEmpty(value),
        CHECK.isItemDuplicated(value, clusterNames, 'cluster name'),
      ]);
    },
    [clusters]
  );

  useEffect(() => {
    register('clusterUrl', { validate: validateUrl });
    register('clusterName', { validate: validateName });
    return () => {
      unregister('clusterUrl');
      unregister('clusterName');
    };
  }, [register, unregister, setValue, validateUrl, validateName]);

  useEffect(() => {
    const onConnectToRemoteClusterReply = (
      _: unknown,
      { error, success, clusterId }: ConnectToRemoteClusterResponse
    ) => {
      if (success && !error) {
        setConnectionState(ConnectionState.OK);

        setTimeout(() => {
          history.push(
            buildRoute.cluster(ROUTE.CLUSTER_LOGIN, clusterId || '')
          );
        }, 2000);
      } else {
        setConnectionState(ConnectionState.ERROR);
        setError('clusterUrl', { message: error });
      }
    };

    ipcRenderer.on(
      'connectToRemoteClusterReply',
      onConnectToRemoteClusterReply
    );

    return () => {
      ipcRenderer.removeListener(
        'connectToRemoteClusterReply',
        onConnectToRemoteClusterReply
      );
    };
    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit({ clusterName, clusterUrl }: FormData) {
    ipcRenderer.send('connectToRemoteCluster', {
      name: clusterName,
      url: clusterUrl,
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
        label="CONNECT"
        onClick={handleSubmit(onSubmit)}
        key="button-1"
        primary
      />,
      <Button label="CANCEL" key="button-2" onClick={() => history.goBack()} />,
    ];
  }

  return (
    <ColumnPage
      title="Connect to a Remote Cluster"
      subtitle="Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum."
      actions={actions}
    >
      <div className={styles.container}>
        <div className={styles.formClusterName}>
          <TextInput
            label="cluster name"
            onChange={(value: string) => {
              setError('clusterName', {});
              setValue('clusterName', value);
            }}
            onEnterKeyPress={handleSubmit(onSubmit)}
            error={errors.clusterName?.message}
            disabled={
              connectionState &&
              [ConnectionState.CONNECTING, ConnectionState.OK].includes(
                connectionState
              )
            }
            autoFocus
            showClearButton
          />
        </div>
        <div className={styles.formClusterUrl}>
          <TextInput
            label="cluster url"
            onChange={(value: string) => {
              setError('clusterUrl', {});
              setValue('clusterUrl', value);
            }}
            onEnterKeyPress={handleSubmit(onSubmit)}
            error={errors.clusterUrl?.message}
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
          <div className={styles.loader}>{getStateCircle(connectionState)}</div>
        )}
      </div>
    </ColumnPage>
  );
}

export default ConnectToRemoteCluster;
