import React, { MouseEvent, useRef, useState } from 'react';

import { Button } from 'kwc';
import { cloneDeep } from 'lodash';
import styles from './useStepper.module.scss';

type ActionButtonProps = {
  label: string;
  onClick?: (e?: MouseEvent<HTMLDivElement> | undefined) => void;
  to?: string;
  primary?: boolean;
  disabled?: boolean;
};

const ActionButton = (props: ActionButtonProps) => (
  <div className={styles.actionButton}>
    <Button {...props} />
  </div>
);

type Step = {
  id: string;
  completed: boolean;
  error: boolean;
};

enum Direction {
  NEXT = 'next',
  PREV = 'prev',
}

type Data = {
  id: string;
  Component: any;
};

function buildSteps(data: Data[]): Step[] {
  return data.map((d) => ({
    id: d.id,
    completed: false,
    error: false,
  }));
}

type Params = {
  data: Data[];
  initialStep?: number;
  beforeGoToStep: () => void;
  cancelRoute: string;
  onSubmit: Function;
};
export default function useStepper({
  data,
  beforeGoToStep,
  cancelRoute,
  onSubmit,
  initialStep = 0,
}: Params) {
  const [steps, setSteps] = useState(buildSteps(data));
  const [actStep, setActStep] = useState(initialStep);
  const direction = useRef(Direction.NEXT);

  function nextStep() {
    goToStep(actStep + 1);
  }

  function prevStep() {
    goToStep(actStep - 1);
  }

  function goToStep(newStep: number) {
    beforeGoToStep();

    direction.current = newStep > actStep ? Direction.NEXT : Direction.PREV;
    setActStep(newStep);
  }

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
    let actions = [];

    const hasError = steps.map((s) => s.error).some((e) => !!e);

    const buttonCancel = (
      <ActionButton key="cancel" label="CANCEL" to={cancelRoute} />
    );
    const buttonNext = (
      <ActionButton key="next" label="NEXT" onClick={nextStep} primary />
    );
    const buttonPrev = (
      <ActionButton key="prev" label="BACK" onClick={prevStep} />
    );
    const buttonComplete = (
      <ActionButton
        key="complete"
        label="CREATE"
        onClick={() => onSubmit()}
        disabled={hasError}
        primary
      />
    );

    switch (actStep) {
      case 0:
        actions = [buttonCancel, buttonNext];
        break;
      case data.length - 1:
        actions = [buttonPrev, buttonComplete];
        break;
      default:
        actions = [buttonPrev, buttonNext];
        break;
    }

    return actions;
  }

  return {
    actStep,
    goToStep,
    direction: direction.current,
    getActions,
    updateState,
    getActStepComponent,
    steps,
  };
}
