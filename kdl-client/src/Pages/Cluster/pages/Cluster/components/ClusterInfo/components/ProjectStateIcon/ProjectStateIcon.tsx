import IconNoFav from '@material-ui/icons/FavoriteBorder';
import React from 'react';
import cx from 'classnames';
import styles from './ProjectStateIcon.module.scss';

export enum ProjectState {
  ERROR = 'ERROR',
  STARTED = 'STARTED',
  STOPPED = 'STOPPED',
  ARCHIVED = 'ARCHIVED',
  NOT_FAVORITE = 'NOT FAVORITE',
}

type Props = {
  state: ProjectState;
};
export default function ProjectStateIcon({ state }: Props) {
  let icon = null;

  switch (state) {
    case ProjectState.ERROR:
    case ProjectState.STARTED:
    case ProjectState.STOPPED:
    case ProjectState.ARCHIVED:
      icon = '';
      break;
    case ProjectState.NOT_FAVORITE:
      icon = <IconNoFav className="icon-small" />;
      break;
  }

  return <div className={cx(styles.levelIcon, styles[state])}>{icon}</div>;
}
