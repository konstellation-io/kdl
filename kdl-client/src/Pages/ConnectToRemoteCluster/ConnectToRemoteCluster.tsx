import { Button, CHECK, TextInput } from 'kwc';
import React, { useCallback, useEffect, useState } from 'react';
import useClusters, { ClusterType } from 'Hooks/useClusters';

import ColumnPage from 'Components/Layout/Page/ColumnPage/ColumnPage';
import ROUTE from 'Constants/routes';
import { ipcRenderer } from 'electron';
import styles from './ConnectToRemoteCluster.module.scss';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

type ConnectToRemoteClusterResponse = {
  success: boolean;
  error?: string;
};

enum ConnectionState {
  CONNECTING = 'CONNECTING',
  OK = 'OK',
  ERROR = 'ERROR',
}

type FormData = {
  clusterUrl: string;
};

function ConnectToRemoteCluster() {
  const [connectionState, setConnectionState] = useState<ConnectionState>();
  const { clusters, saveCluster } = useClusters();
  const history = useHistory();

  const {
    handleSubmit,
    setValue,
    unregister,
    register,
    errors,
    setError,
    getValues,
  } = useForm<FormData>({ defaultValues: { clusterUrl: '' } });

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

  useEffect(() => {
    register('clusterUrl', { validate: validateUrl });
    return () => unregister('clusterUrl');
  }, [register, unregister, setValue, validateUrl]);

  useEffect(() => {
    const onConnectToRemoteClusterReply = (
      _: unknown,
      { error, success }: ConnectToRemoteClusterResponse
    ) => {
      if (success && !error) {
        setConnectionState(ConnectionState.OK);
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

  useEffect(() => {
    if (connectionState === ConnectionState.OK) {
      saveCluster({ type: ClusterType.REMOTE, url: getValues().clusterUrl });
      history.push(ROUTE.CLUSTER_LOGIN);
    }
  }, [connectionState, getValues, history, saveCluster]);

  function onSubmit(data: FormData) {
    ipcRenderer.send('connectToRemoteCluster', data.clusterUrl);
    setConnectionState(ConnectionState.CONNECTING);
  }

  return (
    <ColumnPage
      title="Connect to a Remote Cluster"
      subtitle="Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum."
    >
      <div className={styles.container}>
        <div className={styles.formClusterUrl}>
          <TextInput
            label="cluster url"
            onChange={(value: string) => {
              setError('clusterUrl', {});
              setValue('clusterUrl', value);
            }}
            onEnterKeyPress={handleSubmit(onSubmit)}
            error={errors.clusterUrl?.message}
            showClearButton
          />
        </div>
        <div className={styles.buttons}>
          <Button
            label="CONNECT"
            onClick={handleSubmit(onSubmit)}
            loading={connectionState === ConnectionState.CONNECTING}
            primary
          />
          <Button label="CANCEL" to={ROUTE.NEW_CLUSTER} />
        </div>
      </div>
    </ColumnPage>
  );
}

export default ConnectToRemoteCluster;
