import {
  GET_NEW_PROJECT,
  GetNewProject,
} from 'Graphql/client/queries/getNewProject.graphql';

import { LOCATION } from './components/RepositoryTypeComponent/RepositoryTypeComponent';
import React from 'react';
import RepositoryOption from './components/RepositoryOption/RepositoryOption';
import { RepositoryType } from 'Graphql/types/globalTypes';
import RepositoryTypeComponent from './components/RepositoryTypeComponent/RepositoryTypeComponent';
import { SpinnerCircular } from 'kwc';
import styles from './Repository.module.scss';
import useNewProject from 'Pages/Server/apollo/hooks/useNewProject';
import { useQuery } from '@apollo/client';

function Repository(params: any) {
  const { showErrors } = params;
  const { updateValue, clearError } = useNewProject('repository');
  const { data } = useQuery<GetNewProject>(GET_NEW_PROJECT);

  if (!data) return <SpinnerCircular />;
  const {
    values: { type },
    errors,
  } = data.newProject.repository;

  return (
    <div className={styles.container}>
      <div className={styles.repositories}>
        <RepositoryOption
          title="External Repository"
          subtitle="Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate. Etiam elit elit, elementum sed varius at, adipiscing vitae est. Sed nec felis."
          actionLabel="USE EXTERNAL"
          isSelected={type === RepositoryType.EXTERNAL}
          onSelect={() => {
            clearError('type');
            updateValue('type', RepositoryType.EXTERNAL);
          }}
          Repository={<RepositoryTypeComponent squareLocation={LOCATION.OUT} />}
        />
        <RepositoryOption
          title="Internal Repository"
          subtitle="Fusce vehicula dolor arcu, sit amet blandit dolor mollis nec. Donec viverra eleifend lacus, vitae ullamcorper metus. Sed sollicitudin ipsum quis nunc sollicitudin ultrices."
          actionLabel="USE INTERNAL"
          isSelected={type === RepositoryType.INTERNAL}
          onSelect={() => {
            clearError('type');
            updateValue('type', RepositoryType.INTERNAL);
          }}
          Repository={<RepositoryTypeComponent squareLocation={LOCATION.IN} />}
        />
      </div>
      {showErrors && <div className={styles.errorMessage}>{errors.type}</div>}
    </div>
  );
}

export default Repository;
