import React, { FC } from 'react';

import { bottomRef } from './Sidebar';
import { createPortal } from 'react-dom';
import styles from './DefaultPage.module.scss';

type Props = {
  children: JSX.Element;
};
const SidebarBottom: FC<Props> = ({ children }) => (
  <div className={styles.container}>
    {bottomRef?.current && createPortal(children, bottomRef.current)}
  </div>
);

export default SidebarBottom;
