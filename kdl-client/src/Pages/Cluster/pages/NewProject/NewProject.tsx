import { CSSTransition, TransitionGroup } from 'react-transition-group';
import {
  GET_NEW_PROJECT,
  GetNewProject,
} from 'Graphql/client/queries/getNewProject.graphql';
import ROUTE, { RouteClusterParams, buildRoute } from 'Constants/routes';
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
import useNewProject from 'Pages/Cluster/apollo/hooks/useNewProject';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import useStepper, { ActionButton } from 'Hooks/useStepper/useStepper';
import RepositoryDetails from './pages/RepositoryDetails/RepositoryDetails';
import { RepositoryType } from '../../../../Graphql/types/globalTypes';

enum Steps {
  INFORMATION,
  REPOSITORY,
  REPOSITORY_DETAILS,
  SUMMARY,
}

enum StepNames {
  INFORMATION = 'information',
  REPOSITORY = 'repository',
  DETAILS = 'repository details',
  EXTERNAL = 'externalRepository',
  INTERNAL = 'internalRepository',
  SUMMARY = 'summary',
}

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
    id: StepNames.DETAILS,
    Component: RepositoryDetails,
  },
  {
    id: StepNames.SUMMARY,
    Component: Summary,
  },
];
function NewProject() {
  const { data } = useQuery<GetNewProject>(GET_NEW_PROJECT);
  const { clusterId } = useParams<RouteClusterParams>();
  const { clearAll } = useNewProject('information');
  const cancelRoute = buildRoute.cluster(ROUTE.CLUSTER, clusterId);
  const type = data?.newProject.repository.values.type || null;

  const stepsWithData: [
    StepNames.INFORMATION,
    StepNames.REPOSITORY,
    RepositoryType | null
  ] = [StepNames.INFORMATION, StepNames.REPOSITORY, type];

  // We want to execute this on on component unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => clearAll(), []);

  const {
    direction,
    goToStep,
    actStep,
    getActStepComponent,
    updateState,
    nextStep,
    prevStep,
    steps,
  } = useStepper({
    data: stepperSteps,
  });

  useEffect(() => {
    updateState(false, true, Steps.REPOSITORY_DETAILS);
  }, [type]);

  function getActions() {
    const onNextClick = () => {
      if (validateStep()) nextStep();
    };
    switch (actStep) {
      case 0:
        return [
          <ActionButton label="CANCEL" to={cancelRoute} />,
          <ActionButton label="NEXT" primary onClick={onNextClick} />,
        ];
      case stepperSteps.length - 1:
        return [
          <ActionButton label="BACK" onClick={prevStep} />,
          <ActionButton label="CREATE" onClick={onSubmit} primary />,
        ];
      default:
        return [
          <ActionButton label="BACK" onClick={prevStep} />,
          <ActionButton
            label="NEXT"
            primary
            disabled={isNextDisabled()}
            onClick={onNextClick}
          />,
        ];
    }
  }

  function isNextDisabled() {
    if (
      data &&
      data.newProject.externalRepository &&
      actStep === Steps.REPOSITORY_DETAILS &&
      type === RepositoryType.EXTERNAL
    ) {
      const {
        values: { isConnectionTested },
        errors: { warning },
      } = data.newProject.externalRepository;
      console.log(
        !isConnectionTested || warning !== '',
        isConnectionTested,
        warning
      );
      return warning !== '';
    }
    return false;
  }

  function onSubmit() {
    console.log('CREATE PROJECT');
  }

  if (!data) return <SpinnerCircular />;

  // Updates completed and error step states
  function validateStep() {
    const stepData = stepsWithData[actStep];
    if (data && stepData !== null && actStep !== Steps.SUMMARY) {
      const actStepData = data.newProject[stepData];

      const error =
        actStepData.errors && Object.values(actStepData.errors).some((e) => e);

      const values = Object.values(actStepData.values).filter(
        (v) => typeof v !== 'boolean'
      );
      const completed = values && values.every((v) => !!v) && !error;

      updateState(completed, error);
      return !error;
    }
    return true;
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
                active: actStep === idx,
                visited: actStep >= idx,
                disabled: idx > actStep + 1,
              }))}
              activeStep={actStep}
              onStepClick={(stepId: any) => {
                if (validateStep()) goToStep(stepId);
              }}
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
