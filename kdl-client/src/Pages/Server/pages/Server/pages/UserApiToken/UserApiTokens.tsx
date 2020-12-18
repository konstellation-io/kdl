import { Button, ErrorMessage, SpinnerCircular } from 'kwc';
import { useQuery } from '@apollo/client';
import React from 'react';
import { loader } from 'graphql.macro';
import styles from './UserApiTokens.module.scss';
import Token from './components/token/Token';
import { GetMe } from 'Graphql/queries/types/GetMe';
import Message from 'Components/Message/Message';

const GetMeQuery = loader('Graphql/queries/getMe.graphql');

function UserApiTokens() {
  const { data, loading, error } = useQuery<GetMe>(GetMeQuery);

  function handleGenerateClick() {
    console.log('generate');
  }
  function handleDeleteClick(tokenId: string) {
    console.log('delete', tokenId);
  }

  function renderMainContent() {
    if (loading) return <SpinnerCircular />;
    if (error || !data) return <ErrorMessage />;

    if (!data.me.apiTokens) return <Message text="There are not tokens yet" />;

    return data.me.apiTokens.map(
      ({ label, lastUsedDate, creationDate, id }) => (
        <Token
          key={id}
          id={id}
          label={label}
          creationDate={creationDate}
          lastUsedDate={lastUsedDate}
          onDeleteClick={handleDeleteClick}
        />
      )
    );
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
          onClick={handleGenerateClick}
          border
        />
      </div>
      <div className={styles.tokensContainer}>{renderMainContent()}</div>
    </div>
  );
}

export default UserApiTokens;
