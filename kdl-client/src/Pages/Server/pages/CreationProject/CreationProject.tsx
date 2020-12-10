// import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import {
//   GET_NEW_PROJECT,
//   GetNewProject,
// } from 'Graphql/client/queries/getNewProject.graphql';
// import ROUTE, { buildRoute, RouteServerParams } from 'Constants/routes';
import React from 'react';
import styles from './CreationProject.module.scss';
import { Button } from 'kwc';
import StatusCircle from 'Components/LottieShapes/StatusCircle/StatusCircle';

function CreationProject() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Your project is creating now</h1>
        <span className={styles.subtitle}>
          In order to receive a login link to access
        </span>
        <div className={styles.animation}>
          <StatusCircle label="CREATING..." key="ok" size={280} />
        </div>
        <p className={styles.infoMessage}>
          If you don't want to wait, you may go to the project detail, but not
          still created, or to the dashboard with all the projects.
        </p>
        <div className={styles.buttonsContainer}>
          <Button label="GO TO SERVER" className={styles.button} />
          <Button label="GO TO PROJECT" className={styles.button} />
        </div>
      </div>
    </div>
  );
}

export default CreationProject;
