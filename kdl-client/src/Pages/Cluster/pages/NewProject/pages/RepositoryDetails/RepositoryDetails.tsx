import { SpinnerCircular } from 'kwc';
import {
  GET_NEW_PROJECT,
  GetNewProject,
} from 'Graphql/client/queries/getNewProject.graphql';

import React from 'react';
import { RepositoryType } from 'Graphql/types/globalTypes';
import { useQuery } from '@apollo/client';
import ExternalRepository from './components/ExternalRepository/ExternalRepository';
import InternalRepository from './components/InternalRepository/InternalRepository';

function RepositoryDetails(params: any) {
  const { showErrors } = params;
  const { data } = useQuery<GetNewProject>(GET_NEW_PROJECT);

  if (!data) return <SpinnerCircular />;

  const {
    values: { type },
  } = data.newProject.repository;

  const isExternal = type === RepositoryType.EXTERNAL;

  return (
    <div>
      {isExternal ? (
        <ExternalRepository showErrors={showErrors} />
      ) : (
        <InternalRepository showErrors={showErrors} />
      )}
    </div>
  );

  // const repositoryType = type;
  // const title =
  //   repositoryType === RepositoryType.INTERNAL
  //     ? 'INTERNAL REPOSITORY'
  //     : 'EXTERNAL REPOSITORY';
  //
  // const Form =
  //   repositoryType === RepositoryType.INTERNAL
  //     ? RepositoryInternal
  //     : RepositoryExternal;
  //
  // return (
  //   <div className={styles.container}>
  //     <div className={styles.titleContainer}>
  //       <p className={styles.title}>{title}</p>
  //       <Button
  //         label="CHANGE"
  //         onClick={() => {
  //           updateValue('type', null);
  //           updateValue('url', '');
  //         }}
  //       />
  //     </div>
  //     <Form
  //       updateValue={updateValue}
  //       updateError={updateError}
  //       clearError={clearError}
  //       data={data.newProject}
  //     />
  //   </div>
  // );
}

export default RepositoryDetails;
