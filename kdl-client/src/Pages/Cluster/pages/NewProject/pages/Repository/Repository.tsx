import { Button, SpinnerCircular } from 'kwc';
import {
  GET_NEW_PROJECT,
  GetNewProject,
} from 'Graphql/client/queries/getNewProject.graphql';

import React from 'react';
import RepositoryExternal from './RepositoryExternal';
import RepositoryInternal from './RepositoryInternal';
import RepositorySelector from './components/RepositorySelector/RepositorySelector';
import { RepositoryType } from 'Graphql/types/globalTypes';
import styles from './Repository.module.scss';
import useNewProject from 'Pages/Cluster/apollo/hooks/useNewProject';
import { useQuery } from '@apollo/client';

function Repository() {
  const { updateValue, updateError, clearError } = useNewProject('repository');
  const { data } = useQuery<GetNewProject>(GET_NEW_PROJECT);

  if (!data) return <SpinnerCircular />;
  const {
    values: { type },
  } = data.newProject.repository;

  if (!type)
    return (
      <RepositorySelector
        setRepositoryType={(value: RepositoryType) =>
          updateValue('type', value)
        }
      />
    );

  const repositoryType = type;
  const title =
    repositoryType === RepositoryType.INTERNAL
      ? 'INTERNAL REPOSITORY'
      : 'EXTERNAL REPOSITORY';

  const Form =
    repositoryType === RepositoryType.INTERNAL
      ? RepositoryInternal
      : RepositoryExternal;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <p className={styles.title}>{title}</p>
        <Button
          label="CHANGE"
          onClick={() => {
            updateValue('type', null);
            updateValue('url', '');
          }}
        />
      </div>
      <Form
        updateValue={updateValue}
        updateError={updateError}
        clearError={clearError}
        data={data.newProject}
      />
    </div>
  );
}

export default Repository;
