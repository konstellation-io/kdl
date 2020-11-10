import React, { MouseEvent } from 'react';

import { Button } from 'kwc';
import containerStyles from '../RepositorySelector/RepositorySelector.module.scss';
import cx from 'classnames';
import repositoryStyles from '../Repository/Repository.module.scss';
import styles from './RepositoryOption.module.scss';

type Props = {
  title: string;
  subtitle: string;
  actionLabel: string;
  onSelect: (e?: MouseEvent<HTMLDivElement> | undefined) => void;
  Repository: JSX.Element;
};

function RepositoryOption({
  title,
  subtitle,
  actionLabel,
  onSelect,
  Repository,
}: Props) {
  return (
    <div
      className={cx(
        styles.container,
        repositoryStyles.hoverContainer,
        containerStyles.cluster
      )}
    >
      <div>{Repository}</div>
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{subtitle}</p>
      <div className={styles.button}>
        <Button label={actionLabel} onClick={onSelect} primary />
      </div>
    </div>
  );
}

export default RepositoryOption;
