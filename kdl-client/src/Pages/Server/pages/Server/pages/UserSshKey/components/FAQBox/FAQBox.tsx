import { BUTTON_THEMES, Button, Check } from 'kwc';
import React, { useState } from 'react';

import AnimateHeight from 'react-animate-height';
import IconHelp from '@material-ui/icons/Help';
import cx from 'classnames';
import styles from './FAQBox.module.scss';

const SIZE_CLOSED = 42;

export enum BOX_THEME {
  DEFAULT = 'default',
  WARN = 'warn',
  ERROR = 'error',
}

const toButtonTheme = new Map([
  [BOX_THEME.DEFAULT, BUTTON_THEMES.DEFAULT],
  [BOX_THEME.WARN, BUTTON_THEMES.WARN],
  [BOX_THEME.ERROR, BUTTON_THEMES.ERROR],
]);

type Action = {
  needConfirmation?: boolean;
  message?: string;
  label: string;
  onClick: () => void;
};

type Props = {
  label: string;
  title: string;
  desciption: string;
  action?: Action;
  theme?: BOX_THEME;
};
function FAQBox({
  label,
  title,
  desciption,
  action,
  theme = BOX_THEME.DEFAULT,
}: Props) {
  const [opened, setOpened] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  function toggleOpened() {
    setOpened(!opened);
  }

  return (
    <AnimateHeight
      duration={300}
      height={opened ? 'auto' : SIZE_CLOSED}
      className={cx(styles.container, { [styles.opened]: opened })}
      onClick={toggleOpened}
    >
      <div className={styles.header}>
        <IconHelp className="icon-small" />
        <p className={styles.label}>{label}</p>
      </div>
      <div
        className={cx(styles.content, styles[theme])}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{desciption}</p>
        {action && (
          <div className={styles.action}>
            {action.needConfirmation && (
              <div className={styles.confirmation}>
                <Check checked={confirmed} onChange={(v) => setConfirmed(v)} />
                <p className={styles.confirmationText}>{action.message}</p>
              </div>
            )}
            <Button
              label={action.label}
              theme={toButtonTheme.get(theme)}
              onClick={action.onClick}
              disabled={action.needConfirmation && !confirmed}
              height={30}
              primary
            />
          </div>
        )}
      </div>
    </AnimateHeight>
  );
}

export default FAQBox;
