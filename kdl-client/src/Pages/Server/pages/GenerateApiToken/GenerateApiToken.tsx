import React, { useEffect, useState } from 'react';
import { ActionButton } from 'Hooks/useStepper/useStepper';
import { useHistory, useParams } from 'react-router-dom';
import { Button, TextInput } from 'kwc';
import { useForm } from 'react-hook-form';
import { copyToClipboard } from 'Utils/clipboard';
import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import {
  AddApiToken,
  AddApiToken_addApiToken,
  AddApiTokenVariables,
} from 'Graphql/mutations/types/AddApiToken';
import { GetMe } from 'Graphql/queries/types/GetMe';
import { mutationPayloadHelper } from 'Utils/formUtils';
import { toast } from 'react-toastify';
import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import ROUTE, { buildRoute, RouteServerParams } from 'Constants/routes';
import CodeIcon from '@material-ui/icons/Code';
import styles from './GenerateApiToken.module.scss';
import cx from 'classnames';

const GetMeQuery = loader('Graphql/queries/getMe.graphql');
const AddApiTokenMutation = loader('Graphql/mutations/addApiToken.graphql');

type FormData = {
  tokenName: string;
};

enum CopiedState {
  DEFAULT = '',
  COPIED = 'copied',
  NOT_COPIED = 'notCopied',
}

function GenerateApiToken() {
  const history = useHistory();
  const { serverId } = useParams<RouteServerParams>();
  const [apiTokenCreated, setApiTokenCreated] = useState(false);
  const [copiedState, setCopiedState] = useState(CopiedState.DEFAULT);
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
    setCopiedState(CopiedState.COPIED);
    toast.info('Copied to clipboard');
    toast.clearWaitingQueue();
  }

  function handleAcceptClick() {
    if (copiedState === CopiedState.COPIED)
      history.push(buildRoute.server(ROUTE.USER_API_TOKENS, serverId));
    else setCopiedState(CopiedState.NOT_COPIED);
  }

  return (
    <DefaultPage
      title="Please, write a name to generate your API token"
      subtitle="In order to lorem ipsum description."
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
            placeholder="My fancy token name"
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
          {apiTokenCreated && (
            <div className={styles.resultWrapper}>
              <p className={styles.infoMessage}>
                API Token cannot be accessed after it has been generated,
                remember to copy and store the token as soon as it is generated.
              </p>
              <p
                className={cx(styles.tokenCopied, styles[copiedState])}
                style={{
                  visibility:
                    copiedState !== CopiedState.DEFAULT ? 'visible' : 'hidden',
                }}
              >
                {copiedState === CopiedState.COPIED
                  ? 'Nice, your token is now in your clipboard, remember to store it.'
                  : 'This token will be not accessible again, please copy and save it.'}
              </p>
              <span className={styles.labelTokenContainer}>YOUR NEW TOKEN</span>
              <div className={styles.tokenContainer}>{token}</div>
              <Button
                label="COPY YOUR TOKEN TO YOUR CLIPBOARD"
                className={styles.copyButton}
                onClick={handleCopyButtonClick}
              />
            </div>
          )}
        </div>
      </div>
    </DefaultPage>
  );
}

export default GenerateApiToken;
