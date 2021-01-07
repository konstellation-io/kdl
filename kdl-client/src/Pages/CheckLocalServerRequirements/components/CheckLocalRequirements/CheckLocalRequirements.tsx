import React, { Fragment, useEffect, useState } from 'react';

import { CheckState } from 'Pages/CheckLocalServerRequirements/CheckLocalServerRequirements';
import ErrorBox from 'Components/ErrorBox/ErrorBox';
import { cloneDeep } from 'lodash';
import cx from 'classnames';
import { ipcRenderer } from 'electron';
import styles from './CheckLocalRequirements.module.scss';

enum CheckId {
  k8s = 'k8s',
  minikube = 'minikube',
  helm = 'helm',
}

const checkError = {
  k8s: {
    title: 'Check 1 error',
    message: 'Check 1 message',
    docUrl: 'google.es',
  },
  minikube: {
    title: 'Check 2 error',
    message: 'Check 2 message',
    docUrl: 'google.es',
  },
  helm: {
    title: 'Check 3 error',
    message: 'Check 3 message',
    docUrl: 'google.es',
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
  generateInitialCheck(CheckId.k8s, 'Kubernetes installed'),
  generateInitialCheck(CheckId.minikube, 'Minikube running'),
  generateInitialCheck(CheckId.helm, 'Helm available'),
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
