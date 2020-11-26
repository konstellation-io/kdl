import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  GET_NEW_PROJECT,
  GetNewProject,
} from 'Graphql/client/queries/getNewProject.graphql';
import ROUTE, { RouteServerParams, buildRoute } from 'Constants/routes';
import React, { useEffect } from 'react';

import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import Information from './pages/Information/Information';
import Repository from './pages/Repository/Repository';
import { SpinnerCircular } from 'kwc';
import Stepper from 'Components/Stepper/Stepper';
import Summary from './pages/Summary/Summary';
import { capitalize } from 'lodash';
import cx from 'classnames';
import styles from './NewProject.module.scss';
import useNewProject from 'Pages/Server/apollo/hooks/useNewProject';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import useStepper from 'Hooks/useStepper/useStepper';

enum Steps {
  INFORMATION,
  REPOSITORY,
  SUMMARY,
}

enum StepNames {
  INFORMATION = 'information',
  REPOSITORY = 'repository',
  SUMMARY = 'summary',
}

const stepsWithData: [StepNames.INFORMATION, StepNames.REPOSITORY] = [
  StepNames.INFORMATION,
  StepNames.REPOSITORY,
];

const stepperSteps = [
  {
    id: StepNames.INFORMATION,
    Component: Information,
  },
  {
    id: StepNames.REPOSITORY,
    Component: Repository,
  },
  {
    id: StepNames.SUMMARY,
    Component: Summary,
  },
];

function NewProject() {
  const { data } = useQuery<GetNewProject>(GET_NEW_PROJECT);
  const { serverId } = useParams<RouteServerParams>();
  const { clearAll } = useNewProject('information');
  const cancelRoute = buildRoute.server(ROUTE.SERVER, serverId);

  // We want to execute this on on component unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => clearAll(), []);

  const {
    direction,
    goToStep,
    getActStepComponent,
    getActions,
    actStep,
    updateState,
    steps,
  } = useStepper({
    data: stepperSteps,
    beforeGoToStep,
    cancelRoute,
    onSubmit,
  });

  function onSubmit() {
    console.log('CREATE PROJECT');
  }

  if (!data) return <SpinnerCircular />;

  // Updates completed and error step states
  function beforeGoToStep() {
    if (data && actStep !== Steps.SUMMARY) {
      const actStepData = data.newProject[stepsWithData[actStep]];

      const error =
        actStepData.errors && Object.values(actStepData.errors).some((e) => e);

      const values = Object.values(actStepData.values).filter(
        (v) => typeof v !== 'boolean'
      );
      const completed = values && values.every((v) => !!v);

      updateState(completed, error);
    }
  }

  return (
    <DefaultPage
      title="Add a Project"
      subtitle="Cras quis nulla commodo, aliquam lectus sed, blandit augue. Cras ullamcorper bibendum bibendum. "
      actions={getActions()}
    >
      <div className={styles.container}>
        <div className={styles.steps}>
          <div className={styles.stepper}>
            <Stepper
              steps={steps.map((s, idx) => ({
                id: idx,
                label: capitalize(s.id),
                completed: s.completed,
                error: s.error,
              }))}
              activeStep={actStep}
              goToStep={goToStep}
            />
          </div>
        </div>
        <div className={styles.sections}>
          <TransitionGroup className={cx(styles.pages, styles[direction])}>
            <CSSTransition
              key={actStep}
              timeout={500}
              classNames={{
                enter: styles.enter,
                exit: styles.exit,
              }}
            >
              {getActStepComponent()}
            </CSSTransition>
          </TransitionGroup>
        </div>
      </div>
    </DefaultPage>
  );
}

export default NewProject;
