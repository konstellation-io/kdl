import {
  AddApiToken,
  AddApiTokenVariables,
  AddApiToken_addApiToken,
} from 'Graphql/mutations/types/AddApiToken';
import { Button, TextInput } from 'kwc';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ROUTE, { RouteServerParams, buildRoute } from 'Constants/routes';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { ActionButton } from 'Hooks/useStepper/useStepper';
import CodeIcon from '@material-ui/icons/Code';
import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import { GetMe } from 'Graphql/queries/types/GetMe';
import { copyToClipboard } from 'Utils/clipboard';
import cx from 'classnames';
import { loader } from 'graphql.macro';
import { mutationPayloadHelper } from 'Utils/formUtils';
import styles from './GenerateApiToken.module.scss';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const GetMeQuery = loader('Graphql/queries/getMe.graphql');
const AddApiTokenMutation = loader('Graphql/mutations/addApiToken.graphql');

type FormData = {
  tokenName: string;
};

function GenerateApiToken() {
  const history = useHistory();
  const { serverId } = useParams<RouteServerParams>();
  const [apiTokenCreated, setApiTokenCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [token, setToken] = useState('');

  const { data: dataMe } = useQuery<GetMe>(GetMeQuery);
  const [addApiToken, { loading }] = useMutation<
    AddApiToken,
    AddApiTokenVariables
  >(AddApiTokenMutation, {
    onCompleted: () => setApiTokenCreated(true),
    onError: (e) => console.error(`addMembers: ${e}`),
    update: (cache, { data }) => {
      const newApiToken = data?.addApiToken as AddApiToken_addApiToken;
      setToken(newApiToken.token);

      if (dataMe) {
        cache.writeQuery({
          query: GetMeQuery,
          data: {
            me: {
              ...dataMe.me,
              apiTokens: [...dataMe.me.apiTokens, newApiToken],
            },
          },
        });
      }
    },
  });

  const {
    handleSubmit,
    setValue,
    register,
    unregister,
    errors,
    watch,
    getValues,
    clearErrors,
  } = useForm<FormData>();

  useEffect(() => {
    register('tokenName', { required: 'Please pick a token name' });
    return () => {
      unregister('tokenName');
    };
  }, [register, unregister, setValue]);

  function submitNewToken() {
    if (dataMe && !apiTokenCreated) {
      addApiToken(
        mutationPayloadHelper({
          userId: dataMe.me.id,
          name: getValues('tokenName'),
        })
      );
    }
  }

  function handleCopyButtonClick() {
    copyToClipboard(token);
    setShowCopyAlert(false);
    setCopied(true);
    toast.info('Copied to clipboard');
    toast.clearWaitingQueue();
  }

  function handleAcceptClick() {
    if (copied)
      history.push(buildRoute.server(ROUTE.USER_API_TOKENS, serverId));
    else setShowCopyAlert(true);
  }

  function renderCopyMessage() {
    if (copied)
      return 'Nice, your token is now in your clipboard, remember to store it.';
    if (showCopyAlert && !copied)
      return 'This token will be not accessible again, please copy and save it.';
    return '';
  }

  return (
    <DefaultPage
      title="Please, write a name to generate your API token"
      subtitle="A new API token will be generated labeled with this name. You cannot set a custom token."
      actions={[
        <ActionButton
          key="cancel"
          label="CANCEL"
          to={buildRoute.server(ROUTE.USER_API_TOKENS, serverId)}
        />,
        <ActionButton
          key="accept"
          label="ACCEPT"
          onClick={handleAcceptClick}
          disabled={!apiTokenCreated}
          primary
        />,
      ]}
    >
      <div className={styles.container}>
        <div className={styles.tokenGenerationContainer}>
          <TextInput
            label="token name"
            placeholder="API token name"
            onChange={(v: string) => {
              setValue('tokenName', v);
              clearErrors('tokenName');
            }}
            error={errors.tokenName?.message || ''}
            onEnterKeyPress={handleSubmit(submitNewToken)}
            autoFocus
            showClearButton
          />
          <Button
            label="GENERATE"
            Icon={CodeIcon}
            className={styles.generateButton}
            onClick={handleSubmit(submitNewToken)}
            disabled={!watch('tokenName') || apiTokenCreated}
            loading={loading}
            primary
          />
        </div>
        <div className={styles.resultContainer}>
          <TransitionGroup>
            <CSSTransition
              timeout={500}
              key={`${apiTokenCreated}`}
              classNames={{
                enter: styles.enter,
              }}
            >
              <>
                {apiTokenCreated && (
                  <div className={styles.resultWrapper}>
                    <p className={styles.infoMessage}>
                      API Token cannot be accessed after it has been generated,
                      remember to copy and store the token as soon as it is
                      generated.
                    </p>
                    <div className={styles.token}>
                      <p
                        className={cx(styles.tokenCopied, {
                          [styles.copied]: copied,
                          [styles.notCopied]: showCopyAlert && !copied,
                        })}
                      >
                        {renderCopyMessage()}
                      </p>
                      <span className={styles.label}>YOUR NEW TOKEN</span>
                      <div className={styles.tokenValue}>{token}</div>
                      <Button
                        label="COPY YOUR TOKEN TO YOUR CLIPBOARD"
                        className={styles.copyButton}
                        onClick={handleCopyButtonClick}
                      />
                    </div>
                  </div>
                )}
              </>
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    </DefaultPage>
  );
}

export default GenerateApiToken;
