import React, { MouseEvent } from 'react';

import { Button } from 'kwc';
import containerStyles from '../../Repository.module.scss';
import cx from 'classnames';
import repositoryStyles from '../RepositoryTypeComponent/Repository.module.scss';
import styles from './RepositoryOption.module.scss';

type Props = {
  title: string;
  subtitle: string;
  actionLabel: string;
  isSelected: boolean;
  onSelect: (e?: MouseEvent<HTMLDivElement> | undefined) => void;
  Repository: JSX.Element;
};

function RepositoryOption({
  title,
  subtitle,
  actionLabel,
  isSelected,
  onSelect,
  Repository,
}: Props) {
  return (
    <div
      className={cx(
        styles.container,
        repositoryStyles.hoverContainer,
        containerStyles.server,
        {
          [styles.selected]: isSelected,
        }
      )}
      onClick={onSelect}
    >
      <div>{Repository}</div>
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}

export default RepositoryOption;
