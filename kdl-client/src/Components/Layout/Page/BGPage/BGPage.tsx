import React, { FC } from 'react';

import ActionsBar from 'Components/Layout/ActionsBar/ActionsBar';
import styles from './BGPage.module.scss';

type Props = {
  title: string;
  subtitle?: string;
  bgFile: string;
  children: JSX.Element;
  actions?: JSX.Element | JSX.Element[];
};

const BGPage: FC<Props> = ({ title, subtitle, bgFile, actions, children }) => {
  return (
    <>
      <div className={styles.bg}>
        <video autoPlay loop muted>
          <source src={bgFile} type="video/mp4" />
        </video>
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>{title}</h1>
          {subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
          <div className={styles.children}>{children}</div>
        </div>
        {actions && <ActionsBar centerActions>{actions}</ActionsBar>}
      </div>
    </>
  );
};

export default BGPage;
