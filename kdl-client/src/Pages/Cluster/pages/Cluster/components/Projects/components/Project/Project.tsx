import { Link, useParams } from 'react-router-dom';
import ROUTE, { RouteClusterParams, buildRoute } from 'Constants/routes';
import React, { FC, MouseEvent } from 'react';

import { Button } from 'kwc';
import { GetProjects_projects } from 'Graphql/queries/types/GetProjects';
import IconFav from '@material-ui/icons/Favorite';
import IconNoFav from '@material-ui/icons/FavoriteBorder';
import IconOpen from '@material-ui/icons/KeyboardArrowRight';
import { RepositoryType } from 'Graphql/types/globalTypes';
import cx from 'classnames';
import styles from './Project.module.scss';
import { toast } from 'react-toastify';

type Props = {
  project: GetProjects_projects;
};

const Project: FC<Props> = ({ project }) => {
  const { clusterId } = useParams<RouteClusterParams>();

  return (
    <Link to={buildRoute.project(ROUTE.PROJECT, clusterId, project.id)}>
      <div className={styles.container}>
        <UpperBg project={project} />
        <LowerBg project={project} />
        <Band project={project} />
        <Square project={project} />
      </div>
    </Link>
  );
};

const UpperBg: FC<Props> = ({ project }) => {
  const Favorite = project.favorite ? IconFav : IconNoFav;
  const FavoriteBg = project.favorite ? IconNoFav : IconFav;

  function onToggleFav(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    toast.dismiss();
    toast.info(
      `${project.name} ${
        project.favorite ? 'removed from' : 'added to'
      } favorites.`
    );

    // TODO: mutation to change this
  }

  return (
    <div className={styles.sup}>
      <div className={styles.bg}>
        <div className={styles.bgBand} />
      </div>
      <div className={styles.content}>
        <p className={styles.name}>{project.name}</p>
        <div className={styles.favorite} onClick={onToggleFav}>
          <Favorite className={cx('icon-small', styles.fav)} />
          <FavoriteBg className={cx('icon-small', styles.favBg)} />
        </div>
        {project.repository?.type === RepositoryType.INTERNAL && (
          <div className={styles.internalTag}>Internal</div>
        )}
      </div>
    </div>
  );
};

const LowerBg: FC<Props> = ({ project }) => (
  <div className={styles.inf}>
    <div className={styles.bg}>
      <div className={styles.bgBand} />
    </div>
    <div className={styles.content}>
      <p className={styles.description} title={project.description}>
        {project.description}
      </p>
    </div>
  </div>
);

const Band: FC<Props> = ({ project }) => (
  <div className={styles.band}>
    <div className={cx(styles.label, styles[project.state])}>
      {project.state.replace('_', ' ')}
    </div>
    {project.error && (
      <div className={cx(styles.label, styles.ERROR)}>ERROR</div>
    )}
    <div className={styles.open}>
      <Button label="" Icon={IconOpen} />
    </div>
  </div>
);

const Square: FC<Props> = ({ project }) => (
  <div className={styles.square}>
    <div className={cx(styles.state, styles[project.state])} />
  </div>
);

export default Project;