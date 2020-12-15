import React, { useState } from 'react';
import {
  UpdateProject,
  UpdateProjectVariables,
} from 'Graphql/mutations/types/UpdateProject';

import { GetProjects_projects } from 'Graphql/queries/types/GetProjects';
import { TextInput } from 'kwc';
import { loader } from 'graphql.macro';
import { mutationPayloadHelper } from 'Utils/formUtils';
import styles from './TabInfo.module.scss';
import { useMutation } from '@apollo/client';

const UpdateProjectMutation = loader('Graphql/mutations/updateProject.graphql');

type Props = {
  project: GetProjects_projects;
};
function TabInfo({ project }: Props) {
  const [newName, setNewName] = useState(project.name);
  const [updateProject] = useMutation<UpdateProject, UpdateProjectVariables>(
    UpdateProjectMutation,
    {
      onError: (e) => console.error(`updateProject: ${e}`),
    }
  );

  function updateProjectName() {
    updateProject(
      mutationPayloadHelper({
        id: project.id,
        name: newName,
      })
    );
  }

  return (
    <div className={styles.container}>
      <TextInput
        label="project name"
        formValue={newName}
        onChange={(value: string) => setNewName(value)}
        onBlur={updateProjectName}
        showClearButton
      />
      <div className={styles.description}>
        <p className={styles.title}>ABSTRACT</p>
        <div className={styles.content}>{project.description}</div>
      </div>
    </div>
  );
}

export default TabInfo;
