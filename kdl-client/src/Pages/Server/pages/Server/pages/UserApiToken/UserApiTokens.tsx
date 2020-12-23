import { Button, ErrorMessage, SpinnerCircular } from 'kwc';
import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { GetMe } from 'Graphql/queries/types/GetMe';
import { useParams } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import { mutationPayloadHelper } from 'Utils/formUtils';
import { RemoveApiTokenInput } from 'Graphql/types/globalTypes';
import styles from './UserApiTokens.module.scss';
import Token from './components/token/Token';
import DeleteTokenModal from './components/DeleteTokenModal/DeleteTokenModal';
import Message from 'Components/Message/Message';
import ROUTE, { buildRoute, RouteServerParams } from 'Constants/routes';
import {
  RemoveApiToken,
  RemoveApiToken_removeApiToken,
  RemoveApiTokenVariables,
} from 'Graphql/mutations/types/RemoveApiToken';

const GetMeQuery = loader('Graphql/queries/getMe.graphql');
const RemoveApiTokenMutation = loader(
  'Graphql/mutations/removeApiToken.graphql'
);

function UserApiTokens() {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const selectedTokenId = useRef<string>('');
  const { serverId } = useParams<RouteServerParams>();
  const { data, loading, error } = useQuery<GetMe>(GetMeQuery);
  const [removeApiToken] = useMutation<RemoveApiToken, RemoveApiTokenVariables>(
    RemoveApiTokenMutation,
    {
      onCompleted: () => setShowDeleteModal(false),
      onError: (e) => console.error(`removeApiToken: ${e}`),
      update: (cache, result) => {
        if (result.data) {
          const { id: removedTokenId } = result.data
            .removeApiToken as RemoveApiToken_removeApiToken;

          if (data?.me.apiTokens.length) {
            const apiTokens = data.me.apiTokens.filter(
              ({ id }) => id !== removedTokenId
            );
            cache.writeQuery({
              query: GetMeQuery,
              data: {
                me: {
                  ...data.me,
                  apiTokens,
                },
              },
            });
          }
        }
      },
    }
  );

  function handleDeleteClick(tokenId: string) {
    selectedTokenId.current = tokenId;
    setShowDeleteModal(true);
  }

  function handleDeleteSubmit() {
    removeApiToken(
      mutationPayloadHelper<RemoveApiTokenInput>({
        apiTokenId: selectedTokenId.current,
      })
    );
  }

  function renderMainContent() {
    if (loading) return <SpinnerCircular />;
    if (error || !data) return <ErrorMessage />;

    if (!data.me.apiTokens) return <Message text="There are not tokens yet" />;

    return data.me.apiTokens.map(({ name, lastUsedDate, creationDate, id }) => (
      <Token
        key={id}
        id={id}
        name={name}
        creationDate={creationDate}
        lastUsedDate={lastUsedDate}
        onDeleteClick={() => handleDeleteClick(id)}
      />
    ));
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>API Tokens</h1>
      <div className={styles.infoContainer}>
        <p className={styles.infoMessage}>
          This is your private SSH key, works lorem ipsum and for dolor amet. If
          you want more information please lorem.
        </p>
        <Button
          label="GENERATE"
          className={styles.generateButton}
          height={30}
          to={buildRoute.server(ROUTE.GENERATE_USER_API_TOKEN, serverId)}
          border
        />
      </div>
      <div className={styles.tokensContainer}>{renderMainContent()}</div>
      {showDeleteModal && (
        <DeleteTokenModal
          onCancel={() => setShowDeleteModal(false)}
          onSubmit={handleDeleteSubmit}
        />
      )}
    </div>
  );
}

export default UserApiTokens;
