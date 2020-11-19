import React, { FC } from 'react';

import { createPortal } from 'react-dom';
import styles from './DefaultPage.module.scss';
import { topRef } from './Sidebar';

type Props = {
  children: JSX.Element;
};
const SidebarTop: FC<Props> = ({ children }) => (
  <div className={styles.container}>
    {topRef?.current && createPortal(children, topRef.current)}
  </div>
);

export default SidebarTop;
