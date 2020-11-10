import React from 'react';
import Step from './Step';
import styles from './Stepper.module.scss';

export type Step = {
  completed: boolean;
  error: boolean;
  label: string;
  id: number;
};

type Props = {
  steps: Step[];
  activeStep: number;
  goToStep: Function;
};
function Stepper({ steps, activeStep, goToStep }: Props) {
  return (
    <div className={styles.container}>
      {steps.map((step, idx) => (
        <Step
          {...step}
          key={idx}
          active={activeStep === idx}
          visited={activeStep >= idx}
          onClick={() => goToStep(step.id)}
        />
      ))}
    </div>
  );
}

export default Stepper;
