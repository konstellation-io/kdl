import { Button, SpinnerCircular } from 'kwc';
import {
  CreateProject,
  CreateProjectVariables,
  CreateProject_createProject,
} from 'Graphql/mutations/types/CreateProject';
import {
  GET_NEW_PROJECT,
  GetNewProject,
} from 'Graphql/client/queries/getNewProject.graphql';
import ROUTE, {
  RouteServerParams,
  buildRoute,
} from '../../../../Constants/routes';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { GetProjects } from 'Graphql/queries/types/GetProjects';
import { RepositoryType } from 'Graphql/types/globalTypes';
import StatusCircle from 'Components/LottieShapes/StatusCircle/StatusCircle';
import { loader } from 'graphql.macro';
import { mutationPayloadHelper } from 'Utils/formUtils';
import { repoTypeToStepName } from '../NewProject/NewProject';
import styles from './ProjectCreation.module.scss';
import { useParams } from 'react-router-dom';

const GetProjectsQuery = loader('Graphql/queries/getProjects.graphql');
const CreateProjectMutation = loader('Graphql/mutations/createProject.graphql');

function ProjectCreation() {
  const [projectId, setProjectId] = useState('');

  const { serverId } = useParams<RouteServerParams>();
  const { data } = useQuery<GetNewProject>(GET_NEW_PROJECT);

  const [createProject] = useMutation<CreateProject, CreateProjectVariables>(
    CreateProjectMutation,
    {
      onCompleted: ({ createProject: { id } }) => setProjectId(id),
      onError: (e) => console.error(`createProject: ${e}`),
      update: (cache, { data: newProjectData }) => {
        const newProject = newProjectData?.createProject as CreateProject_createProject;
        const cacheResult = cache.readQuery<GetProjects>({
          query: GetProjectsQuery,
        });

        if (cacheResult !== null) {
          const { projects } = cacheResult;
          cache.writeQuery({
            query: GetProjectsQuery,
            data: { projects: [...projects, newProject] },
          });
        }
      },
    }
  );

  useEffect(() => {
    if (data) {
      const { repository, information } = data.newProject;
      const type = repository.values.type || RepositoryType.EXTERNAL;
      const repoTypeDetails = data.newProject[repoTypeToStepName[type]];

      const inputs = {
        ...information.values,
        repository: {
          type,
          url: repoTypeDetails.values.url,
        },
      };

      createProject(mutationPayloadHelper(inputs));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!data) return <SpinnerCircular />;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1>Your project is creating now</h1>
        <span className={styles.subtitle}>
          In order to receive a login link to access
        </span>
        <div className={styles.animation}>
          <StatusCircle label="CREATING..." key="ok" size={280} />
        </div>
        <p className={styles.infoMessage}>
          If you don't want to wait, you may go to the project detail, but not
          still created, or to the dashboard with all the projects.
        </p>
        <div className={styles.buttonsContainer}>
          <Button
            label="GO TO SERVER"
            className={styles.button}
            to={buildRoute.server(ROUTE.SERVER, serverId)}
          />
          <Button
            label="GO TO PROJECT"
            to={buildRoute.project(ROUTE.PROJECT, serverId, projectId)}
            disabled={!projectId}
            className={styles.button}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectCreation;
