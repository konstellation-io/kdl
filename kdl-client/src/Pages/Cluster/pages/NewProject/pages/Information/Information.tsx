import {
  GET_NEW_PROJECT,
  GetNewProject,
} from 'Graphql/client/queries/getNewProject.graphql';
import { SpinnerCircular, TextInput } from 'kwc';

import React from 'react';
import { generateSlug } from 'Utils/string';
import styles from './Information.module.scss';
import useNewProject from 'Pages/Cluster/apollo/hooks/useNewProject';
import { useQuery } from '@apollo/client';

function Information() {
  const { updateValue } = useNewProject('information');
  const { updateValue: updateRepositoryValue } = useNewProject('repository');
  const { data } = useQuery<GetNewProject>(GET_NEW_PROJECT);

  if (!data) return <SpinnerCircular />;

  const {
    values: { name, description },
  } = data.newProject.information;

  return (
    <div className={styles.container}>
      <TextInput
        label="project name"
        onChange={(v: string) => {
          updateValue('name', v);
          updateRepositoryValue('slug', generateSlug(v));
        }}
        formValue={name}
        autoFocus
        showClearButton
      />
      <TextInput
        label="project description"
        formValue={description || ''}
        onChange={(v: string) => updateValue('description', v)}
        limits={{
          maxHeight: 500,
          minHeight: 150,
        }}
        showClearButton
        textArea
        lockHorizontalGrowth
      />
    </div>
  );
}

export default Information;
