import React, { MouseEvent, useState } from 'react';

import { Button } from 'kwc';
import { cloneDeep } from 'lodash';
import styles from './useStepper.module.scss';
import useNavigation from 'Hooks/useNavigation';

export enum ActionButtonTypes {
  Back = 'Back',
  Next = 'Next',
  Complete = 'Complete',
  Cancel = 'Cancel',
}

export type ActionButtonProps = {
  label: string;
  onClick?: (e?: MouseEvent<HTMLDivElement> | undefined) => void;
  to?: string;
  primary?: boolean;
  disabled?: boolean;
};

export const ActionButton = (props: ActionButtonProps) => (
  <div className={styles.actionButton}>
    <Button {...props} />
  </div>
);

type Step = {
  id: string;
  completed: boolean;
  error: boolean;
};

type Data = {
  id: string;
  Component: any;
};

const buildSteps = (data: Data[]): Step[] =>
  data.map((d) => ({
    id: d.id,
    completed: false,
    error: false,
  }));

type Params = {
  data: Data[];
  initialStep?: number;
  beforeGoToStep?: () => void;
  cancelRoute?: string;
  onSubmit?: Function;
  actions: any;
};
export default function useStepper({
  data,
  beforeGoToStep,
  initialStep = 0,
  actions,
}: Params) {
  const [steps, setSteps] = useState(buildSteps(data));
  const { actStep, goToStep, nextStep, prevStep, direction } = useNavigation({
    initialStep,
    beforeGoToStep,
    maxSteps: steps.length,
  });

  const _actions = createActions(actions, prevStep, nextStep, steps);

  function getActStepComponent() {
    const Component = data[actStep].Component;
    return <Component />;
  }

  function updateState(completed: boolean, error: boolean) {
    const newSteps = cloneDeep(steps);
    newSteps[actStep] = {
      ...newSteps[actStep],
      completed,
      error,
    };

    setSteps(newSteps);
  }

  function getActions() {
    switch (actStep) {
      case 0:
        return [
          _actions.get(ActionButtonTypes.Cancel),
          _actions.get(ActionButtonTypes.Next),
        ];
      case data.length - 1:
        return [
          _actions.get(ActionButtonTypes.Back),
          _actions.get(ActionButtonTypes.Complete),
        ];
      default:
        return [
          _actions.get(ActionButtonTypes.Back),
          _actions.get(ActionButtonTypes.Next),
        ];
    }
  }

  return {
    actStep,
    goToStep,
    direction,
    getActions,
    updateState,
    getActStepComponent,
    steps,
  };
}

const createActions = (
  actions: any,
  onBackClick: any,
  onNextClick: any,
  steps: any
) => {
  const hasError = steps.some((step: any) => !!step.error);
  console.log('ciao', hasError);
  const _actions = new Map();
  const backButton = actions.find(
    ({ key }: any) => key === ActionButtonTypes.Back
  );
  const nextButton = actions.find(
    ({ key }: any) => key === ActionButtonTypes.Next
  );
  const completeButton = actions.find(
    ({ key }: any) => key === ActionButtonTypes.Complete
  );
  _actions.set(
    ActionButtonTypes.Back,
    React.cloneElement(backButton, {
      ...backButton.props,
      onClick: onBackClick,
    })
  );
  _actions.set(
    ActionButtonTypes.Next,
    React.cloneElement(nextButton, {
      ...nextButton.props,
      onClick: onNextClick,
    })
  );
  _actions.set(
    ActionButtonTypes.Complete,
    React.cloneElement(completeButton, {
      ...completeButton.props,
      disabled: hasError,
    })
  );
  _actions.set(
    ActionButtonTypes.Cancel,
    actions.find(({ key }: any) => key === ActionButtonTypes.Cancel)
  );
  return _actions;
};
