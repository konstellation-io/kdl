import { Button } from 'kwc';
import IconBack from '@material-ui/icons/ChevronLeft';
import IconNext from '@material-ui/icons/ChevronRight';
import React from 'react';
import cx from 'classnames';
import { range } from 'lodash';
import styles from './SlidePresentation.module.scss';

type Props = {
  actStep: number;
  totalSteps: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
};
function Navigation({
  actStep,
  totalSteps,
  goToStep,
  nextStep,
  prevStep,
}: Props) {
  return (
    <div className={styles.navigation}>
      <div className={styles.buttons}>
        <Button
          label=""
          Icon={IconBack}
          className={styles.button}
          onClick={prevStep}
          border
        />
        <Button
          label=""
          Icon={IconNext}
          className={styles.button}
          onClick={nextStep}
          border
        />
      </div>
      <div className={styles.dots}>
        {range(totalSteps).map((stepN) => (
          <div
            className={cx(styles.navDotContainer, {
              [styles.actual]: actStep === stepN,
            })}
            onClick={() => goToStep(stepN)}
            key={stepN}
          >
            <div className={styles.navDot} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Navigation;
