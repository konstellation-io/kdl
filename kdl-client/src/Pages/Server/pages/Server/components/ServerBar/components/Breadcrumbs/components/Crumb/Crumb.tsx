import React, { useEffect, useRef, useState } from 'react';
import styles from './Crumb.module.scss';
import AnimateHeight from 'react-animate-height';
import { useClickOutside } from 'kwc';
import cx from 'classnames';

export type CrumbProps = {
  crumbText: string;
  LeftIconComponent: any;
  RightIconComponent?: any;
  BottomComponent: React.ReactElement;
};

function Crumb({
  crumbText,
  LeftIconComponent,
  RightIconComponent,
  BottomComponent,
}: CrumbProps) {
  const crumbRef = useRef(null);
  const [showComponent, setShowComponent] = useState(false);
  const { addClickOutsideEvents, removeClickOutsideEvents } = useClickOutside({
    componentRef: crumbRef,
    action: () => setShowComponent(false),
  });

  useEffect(() => {
    if (crumbRef && showComponent) addClickOutsideEvents();
    else removeClickOutsideEvents();
  }, [showComponent, addClickOutsideEvents, removeClickOutsideEvents]);

  return (
    <div
      className={styles.container}
      onClick={() => setShowComponent(!showComponent)}
      ref={crumbRef}
    >
      <LeftIconComponent className="icon-regular" />
      <span className={styles.crumbText}>{crumbText}</span>
      {RightIconComponent && (
        <RightIconComponent
          className={cx(styles.rightIcon, 'icon-regular', {
            [styles.opened]: showComponent,
          })}
        />
      )}
      <AnimateHeight
        height={showComponent ? 'auto' : 0}
        duration={300}
        className={styles.content}
      >
        {BottomComponent}
      </AnimateHeight>
    </div>
  );
}

export default Crumb;
