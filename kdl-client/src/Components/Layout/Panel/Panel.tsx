import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React, { FC } from 'react';

import { Button } from 'kwc';
import IconClose from '@material-ui/icons/Close';
import styles from './Panel.module.scss';

type Props = {
  title: string;
  show: boolean;
  close: () => void;
  children: JSX.Element;
};
const Panel: FC<Props> = ({ title, show, close, children }) => (
  <TransitionGroup>
    <CSSTransition
      key={`${show}`}
      timeout={500}
      classNames={{
        enter: styles.enter,
        exit: styles.exit,
      }}
    >
      <>
        {show && (
          <div className={styles.container}>
            <header>
              <div className={styles.separator} />
              <p className={styles.title}>{title}</p>
              <Button label="" Icon={IconClose} onClick={close} />
            </header>
            <div className={styles.content}>{children}</div>
          </div>
        )}
      </>
    </CSSTransition>
  </TransitionGroup>
);

export default Panel;
