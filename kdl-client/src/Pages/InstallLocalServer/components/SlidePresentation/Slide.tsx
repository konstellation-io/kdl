import React, { useEffect } from 'react';

import styles from './SlidePresentation.module.scss';

const NEXT_SLIDE_TIMEOUT = 8000;

export type SlideInfo = {
  img: string;
  title: string;
  description: string;
};

interface Props extends SlideInfo {
  nextStep: () => void;
}
function Slide({ img, title, description, nextStep }: Props) {
  // Move to the next slide after X seconds
  useEffect(() => {
    const nextSlideInterval = setInterval(() => {
      nextStep();
    }, NEXT_SLIDE_TIMEOUT);
    return () => {
      clearInterval(nextSlideInterval);
    };
    // We want to execute this on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.slide}>
      <img className={styles.image} src={img} alt="Slide img" />
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description} title={description}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default Slide;
