import { Button, CHECK, TextInput } from 'kwc';
import ROUTE, { RouteClusterParams } from 'Constants/routes';
import React, { useEffect, useState } from 'react';

import ColumnPage from 'Components/Layout/Page/ColumnPage/ColumnPage';
import EmailIcon from '@material-ui/icons/Mail';
import cx from 'classnames';
import { ipcRenderer } from 'electron';
import styles from './ClusterLogin.module.scss';
import useClusters from 'Hooks/useClusters';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

type ClusterLoginResponse = {
  success: boolean;
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
  const { clusterId } = useParams<RouteClusterParams>();
  const { getCluster } = useClusters();
  const cluster = getCluster(clusterId);

  const {
    handleSubmit,
    setValue,
    getValues,
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
      { success }: ClusterLoginResponse
    ) => {
      if (success) {
        setLinkSent(true);
      } else {
        setError('email', { message: 'Cannot not login to cluster' });
      }
    };

    ipcRenderer.on('clusterLoginReply', onClusterLoginReply);

    return () => {
      ipcRenderer.removeListener('clusterLoginReply', onClusterLoginReply);
    };
    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit({ email }: FormData) {
    if (cluster) {
      ipcRenderer.send('clusterLogin', { clusterId: cluster.id, email });
    } else {
      console.error(`Cannot get cluster`);
    }
  }

  const actions = <Button label="CANCEL" to={ROUTE.HOME} />;

  return (
    <ColumnPage
      title="Login to Remote Cluster"
      subtitle="Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum. "
      actions={actions}
    >
      <div className={styles.container}>
        <div className={styles.name}>
          <p className={styles.title}>CLUSTER NAME</p>
          <div className={styles.content}>
            <div className={styles.circle} />
            <p className={styles.value}>{cluster?.name}</p>
          </div>
        </div>
        <div className={styles.url}>
          <p className={styles.title}>CLUSTER URL</p>
          <p className={styles.value} title={cluster?.url}>
            {cluster?.url}
          </p>
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
            autoFocus
          />
        </div>
        <div className={styles.buttons}>
          <Button
            label="SEND ME A LOGIN LINK"
            onClick={handleSubmit(onSubmit)}
            primary
          />
          <div className={cx(styles.confirmation, { [styles.show]: linkSent })}>
            <div className={styles.icon}>
              <EmailIcon className="icon-regular" />
            </div>
            <p>{`link sent to "${getValues().email}". Check your inbox.`}</p>
          </div>
        </div>
      </div>
    </ColumnPage>
  );
}

export default ClusterLogin;
