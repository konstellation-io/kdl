import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Slide, { SlideInfo } from './Slide';

import Navigation from './Navigation';
import React from 'react';
import cx from 'classnames';
import styles from './SlidePresentation.module.scss';
import useNavigation from 'Hooks/useNavigation';

type Props = {
  slides: SlideInfo[];
};
function SlidePresentation({ slides }: Props) {
  const nSlides = slides.length;

  const { actStep, goToStep, nextStep, prevStep, direction } = useNavigation({
    maxSteps: nSlides,
  });

  const slide = slides[actStep];

  return (
    <div className={styles.container}>
      <TransitionGroup className={cx(styles.pages, styles[direction])}>
        <CSSTransition
          key={actStep}
          timeout={1000}
          classNames={{
            enter: styles.enter,
            exit: styles.exit,
          }}
        >
          <Slide {...slide} nextStep={nextStep} />
        </CSSTransition>
      </TransitionGroup>
      <Navigation
        actStep={actStep}
        totalSteps={nSlides}
        goToStep={goToStep}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    </div>
  );
}

export default SlidePresentation;
