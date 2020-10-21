import React, { FC } from 'react';

import styles from './BGPage.module.scss';

type Props = {
  title: string;
  subtitle?: string;
  bgFile: string;
  children: JSX.Element;
};

const BGPage: FC<Props> = ({ title, subtitle, bgFile, children }) => {
  return (
    <>
      <div className={styles.bg}>
        <video autoPlay loop muted>
          <source src={bgFile} type="video/mp4" />
        </video>
      </div>
      <div className={styles.container}>
        <h1>{title}</h1>
        {subtitle && <h3 className={styles.subtitle}>{subtitle}</h3>}
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
};

export default BGPage;
