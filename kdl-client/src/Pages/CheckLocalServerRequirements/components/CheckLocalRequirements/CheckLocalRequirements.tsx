import React, { Fragment, useEffect, useState } from 'react';

import { CheckState } from 'Pages/CheckLocalServerRequirements/CheckLocalServerRequirements';
import ErrorBox from 'Components/ErrorBox/ErrorBox';
import { cloneDeep } from 'lodash';
import cx from 'classnames';
import { ipcRenderer } from 'electron';
import styles from './CheckLocalRequirements.module.scss';

enum CheckId {
  minikube = 'minikube',
  kubectl = 'kubectl',
  helm = 'helm',
  docker = 'docker',
  mkcert = 'mkcert',
}

const checkError = {
  minikube: {
    title: 'minikube executable not found',
    message: 'minikube must be installed in your system.',
    docUrl: 'https://minikube.sigs.k8s.io/docs/start/',
  },
  kubectl: {
    title: 'kubectl executable not found',
    message: 'kubectl must be installed in your system.',
    docUrl: 'https://kubernetes.io/docs/tasks/tools/',
  },
  helm: {
    title: 'helm executable not found',
    message: 'helm must be installed in your system.',
    docUrl: 'https://helm.sh/docs/intro/install/',
  },
  docker: {
    title: 'docker executable not found',
    message: 'docker must be installed in your system.',
    docUrl: 'https://docs.docker.com/get-docker/',
  },
  mkcert: {
    title: 'mkcert executable not found',
    message: 'mkcert must be installed in your system.',
    docUrl: 'https://github.com/FiloSottile/mkcert',
  },
};

type CheckRequirementResponse = [CheckId, boolean];

type Check = {
  id: CheckId;
  label: string;
  isOk: boolean | null;
  open: boolean;
};

const generateInitialCheck = (id: CheckId, label: string) => ({
  id,
  label,
  isOk: null,
  open: false,
});

const initialCheckStatus: Check[] = [
  generateInitialCheck(CheckId.minikube, 'Minikube installed'),
  generateInitialCheck(CheckId.kubectl, 'Kubernetes installed'),
  generateInitialCheck(CheckId.helm, 'Helm installed'),
  generateInitialCheck(CheckId.docker, 'Docker installed'),
  generateInitialCheck(CheckId.mkcert, 'mkcert installed'),
];

type Props = {
  setChecksState: (newCheckState: CheckState) => void;
};

function CheckLocalRequirements({ setChecksState }: Props) {
  const [checks, setChecks] = useState(initialCheckStatus);

  function resetCheck(checkId: string) {
    const newChecks = cloneDeep(checks);
    const target = newChecks.find((c) => c.id === checkId);
    if (target) target.isOk = null;

    setChecks(newChecks);
  }

  function checkRequirement(checkId: string) {
    resetCheck(checkId);
    ipcRenderer.send('checkRequirement', checkId);
  }

  useEffect(() => {
    const onRequirementReply = (
      _: unknown,
      [requirement, isOk]: CheckRequirementResponse
    ) => {
      setChecks((actChecks) => {
        const newCheckStatus = cloneDeep(actChecks);
        const actCheck = newCheckStatus.find((e) => e.id === requirement);
        if (actCheck) actCheck.isOk = isOk;

        return newCheckStatus;
      });
    };

    ipcRenderer.on('checkRequirementReply', onRequirementReply);

    checks.forEach((check) => {
      checkRequirement(check.id);
    });

    return () => {
      ipcRenderer.removeListener('checkRequirementReply', onRequirementReply);
    };
    // We want to execute this on on component mount/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (checks.every((c) => c.isOk)) {
      setChecksState(CheckState.OK);
    } else if (checks.some((c) => c.isOk === false)) {
      setChecksState(CheckState.ERROR);
    }
  }, [checks, setChecksState]);

  function toggleCheckOpen(idx: number, isOpening: boolean) {
    const newChecks = cloneDeep(checks);

    // Close all checks but opened
    newChecks.forEach((check) => (check.open = false));
    if (isOpening) newChecks[idx].open = true;

    setChecks(newChecks);
  }

  const requirements = checks.map((check, idx) => (
    <Fragment key={check.id}>
      <li
        className={cx(styles.requirement, {
          [styles.pending]: check.isOk === null,
          [styles.ok]: check.isOk,
          [styles.fail]: check.isOk === false,
        })}
      >
        {check.label}
      </li>
      {check.isOk === false && (
        <div className={styles.errorBox}>
          <ErrorBox
            title={checkError[check.id].title}
            message={checkError[check.id].message}
            docUrl={checkError[check.id].docUrl}
            onChange={() => toggleCheckOpen(idx, !check.open)}
            openController={check.open}
            action={{
              label: 'RETRY',
              onClick: () => checkRequirement(check.id),
            }}
          />
        </div>
      )}
    </Fragment>
  ));

  return (
    <div className={styles.container}>
      <div className={styles.checkList}>
        <ul>{requirements}</ul>
      </div>
    </div>
  );
}

export default CheckLocalRequirements;
