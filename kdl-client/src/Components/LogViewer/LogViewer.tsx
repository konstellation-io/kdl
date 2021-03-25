import React, { useRef, useEffect } from 'react';

import cx from 'classnames';
import styles from './LogViewer.module.scss';

export type Log = {
  text: string;
  isError?: boolean;
};

interface Props {
  logs: Log[];
}

function LogViewer({ logs }: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current !== null) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className={styles.wrapper}>
      {logs.map(({ text, isError = false }, idx) => (
        <p key={idx} className={cx(styles.log, { [styles.error]: isError })}>
          {text}
        </p>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default LogViewer;
