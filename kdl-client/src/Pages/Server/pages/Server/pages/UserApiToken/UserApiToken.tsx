import { Button, SpinnerCircular } from 'kwc';
import { useQuery } from '@apollo/client';

import React from 'react';
import { loader } from 'graphql.macro';
import styles from './UserApiToken.module.scss';
import Token from './components/token/Token';
import { GetApiTokens } from 'Graphql/queries/types/GetApiTokens';
import Message from 'Components/Message/Message';

const GetApiTokensQuery = loader('Graphql/queries/getApiTokens.graphql');

function UserApiToken() {
  const { data, loading } = useQuery<GetApiTokens>(GetApiTokensQuery);
  const apiTokens = data?.apiTokens || [];
  const isEmptyList = apiTokens.length === 0;

  function renderContent() {
    if (loading) return <SpinnerCircular />;
    else if (!loading && isEmptyList)
      return <Message text="There are not tokens yet" />;
    else
      return apiTokens.map(({ label, lastUsedDate, creationDate }) => (
        <Token
          label={label}
          creationDate={creationDate}
          lastUsedDate={lastUsedDate}
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
          border
          className={styles.generateButton}
          height={30}
        />
      </div>
      <div className={styles.tokensContainer}>{renderContent()}</div>
    </div>
  );
}

export default UserApiToken;
