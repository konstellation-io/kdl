import React, { useEffect, useRef, useState } from 'react';
import styles from './Crumb.module.scss';
import AnimateHeight from 'react-animate-height';
import { useClickOutside } from 'kwc';
import cx from 'classnames';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core';

export type CrumbProps = {
  crumbText: string;
  LeftIconComponent: React.ReactElement;
  RightIconComponent?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
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
    <div className={styles.container} ref={crumbRef}>
      <div onClick={() => setShowComponent(!showComponent)}>
        {LeftIconComponent}
        <span className={styles.crumbText}>{crumbText}</span>
        {RightIconComponent && (
          <RightIconComponent
            className={cx(styles.rightIcon, 'icon-regular', {
              [styles.opened]: showComponent,
            })}
          />
        )}
      </div>
      <AnimateHeight
        height={showComponent ? 'auto' : 0}
        duration={300}
        className={styles.content}
        onClick={(e) => e.stopPropagation()}
      >
        {BottomComponent}
      </AnimateHeight>
    </div>
  );
}

export default Crumb;
