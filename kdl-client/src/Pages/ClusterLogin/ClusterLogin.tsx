import { Button, CHECK, TextInput } from 'kwc';
import React, { useEffect, useState } from 'react';

import ColumnPage from 'Components/Layout/Page/ColumnPage/ColumnPage';
import ROUTE from 'Constants/routes';
import cx from 'classnames';
import { ipcRenderer } from 'electron';
import styles from './ClusterLogin.module.scss';
import { useForm } from 'react-hook-form';

const CLUSTER_URL = 'https://www.konstellation.io/clusters/sample_cluster_1';

type ClusterLoginResponse = {
  success: boolean;
  error?: string;
};

function validateEmail(value: string) {
  return CHECK.getValidationError([
    CHECK.isFieldNotEmpty(value),
    CHECK.isEmailValid(value),
  ]);
}

type FormData = {
  email: string;
};

function ClusterLogin() {
  const [linkSent, setLinkSent] = useState(false);

  const {
    handleSubmit,
    setValue,
    unregister,
    register,
    errors,
    setError,
  } = useForm<FormData>({ defaultValues: { email: '' } });

  useEffect(() => {
    register('email', { validate: validateEmail });
    return () => unregister('email');
  }, [register, unregister, setValue]);

  useEffect(() => {
    const onClusterLoginReply = (
      _: unknown,
      { error, success }: ClusterLoginResponse
    ) => {
      if (success && !error) {
        setLinkSent(true);
      } else {
        setError('email', { message: error });
      }
    };

    ipcRenderer.on('clusterLoginReply', onClusterLoginReply);

    return () => {
      ipcRenderer.removeListener('clusterLoginReply', onClusterLoginReply);
    };
    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(data: FormData) {
    ipcRenderer.send('clusterLogin', data.email);
  }

  return (
    <ColumnPage
      title="Login to Remote Cluster"
      subtitle="Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum. "
    >
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.title}>CLUSTER IS AVAILABLE</p>
          <div className={styles.content}>
            <div className={styles.circle} />
            <p title={CLUSTER_URL}>{CLUSTER_URL}</p>
          </div>
        </div>
        <div className={styles.formEmail}>
          <TextInput
            label="email"
            onChange={(value: string) => {
              setError('email', {});
              setValue('email', value);
            }}
            onEnterKeyPress={handleSubmit(onSubmit)}
            error={errors.email?.message}
            showClearButton
          />
        </div>
        <div className={styles.buttons}>
          <Button
            label="SEND ME A LOGIN LINK"
            onClick={handleSubmit(onSubmit)}
            primary
          />
          <p className={cx(styles.confirmation, { [styles.show]: linkSent })}>
            LINK SENT. CHECK YOUR INBOX.
          </p>
          <Button label="CANCEL" to={ROUTE.NEW_CLUSTER} />
        </div>
      </div>
    </ColumnPage>
  );
}

export default ClusterLogin;
