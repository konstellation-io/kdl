import { Button, CHECK, TextInput } from 'kwc';
import ROUTE, { RouteServerParams } from 'Constants/routes';
import React, { useEffect, useRef, useState } from 'react';

import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import EmailIcon from '@material-ui/icons/Mail';
import cx from 'classnames';
import { ipcRenderer } from 'electron';
import styles from './ServerLogin.module.scss';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import useServers from 'Hooks/useServers';

type ServerLoginResponse = {
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

function ServerLogin() {
  const [linkSent, setLinkSent] = useState(false);
  const { serverId } = useParams<RouteServerParams>();
  const { getServer } = useServers();
  const emailReceiver = useRef('');
  const server = getServer(serverId);

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
    const onServerLoginReply = (
      _: unknown,
      { success }: ServerLoginResponse
    ) => {
      if (success) {
        setLinkSent(true);
      } else {
        setError('email', { message: 'Cannot not login to server' });
      }
    };

    ipcRenderer.on('serverLoginReply', onServerLoginReply);

    return () => {
      ipcRenderer.removeListener('serverLoginReply', onServerLoginReply);
    };
    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit({ email }: FormData) {
    if (server) {
      ipcRenderer.send('serverLogin', { serverId: server.id, email });
      emailReceiver.current = email;
    } else {
      console.error(`Cannot get server`);
    }
  }

  const actions = [
    <Button
      key="cancel"
      label="CANCEL"
      className={styles.cancelButton}
      to={ROUTE.HOME}
    />,
    <Button
      key="login"
      label="SEND ME A LOGIN LINK"
      className={styles.loginButton}
      onClick={handleSubmit(onSubmit)}
      primary
    />,
  ];

  return (
    <DefaultPage
      title="Login to Remote Server"
      subtitle="Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum. "
      actions={actions}
    >
      <div className={styles.container}>
        <div className={styles.information}>
          <div className={styles.url}>
            <p className={styles.title}>SERVER URL</p>
            <p className={styles.value} title={server?.url}>
              {server?.url}
            </p>
          </div>
          <div className={styles.name}>
            <p className={styles.title}>SERVER NAME</p>
            <div className={styles.content}>
              <div className={styles.circle} />
              <p className={styles.value}>{server?.name}</p>
            </div>
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.formEmail}>
            <TextInput
              label="email"
              onChange={(value: string) => {
                setError('email', {});
                setValue('email', value);
              }}
              Icon={EmailIcon}
              onEnterKeyPress={handleSubmit(onSubmit)}
              error={errors.email?.message}
              showClearButton
              autoFocus
            />
          </div>
          <div className={cx(styles.confirmation, { [styles.show]: linkSent })}>
            <div className={styles.icon}>
              <EmailIcon className="icon-regular" />
            </div>
            <p>{`link sent to "${emailReceiver.current}". Check your inbox.`}</p>
          </div>
        </div>
      </div>
    </DefaultPage>
  );
}

export default ServerLogin;
