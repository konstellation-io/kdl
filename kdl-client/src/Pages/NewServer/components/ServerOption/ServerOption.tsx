import { Button } from 'kwc';
import { Link } from 'react-router-dom';
import React from 'react';
import containerStyles from '../../NewServer.module.scss';
import cx from 'classnames';
import serverStyles from '../Server/Server.module.scss';
import styles from './ServerOption.module.scss';

type Props = {
  title: string;
  subtitle: string;
  actionLabel: string;
  to: string;
  Server: JSX.Element;
};

function ServerOption({ title, subtitle, actionLabel, to, Server }: Props) {
  return (
    <Link to={to}>
      <div
        className={cx(
          styles.container,
          serverStyles.hoverContainer,
          containerStyles.server
        )}
      >
        <div>{Server}</div>
        <p className={styles.title}>{title}</p>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.button}>
          <Button label={actionLabel} primary />
        </div>
      </div>
    </Link>
  );
}

export default ServerOption;
