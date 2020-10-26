import React, { Fragment, useEffect, useState } from 'react';

import { CheckState } from 'Pages/CheckLocalClusterRequirements/CheckLocalClusterRequirements';
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
    switch (true) {
      case checks.some((c) => c):
        // FIXME: Uncomment next line and remove previous.
        // case checks.every((c) => c.isOk):
        setChecksState(CheckState.OK);
        break;
      case checks.some((c) => c.isOk === false):
        setChecksState(CheckState.ERROR);
        break;
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
            title="To add a Resource Startud"
            message="Nam porttitor blandit accumsan. Ut vel dictum sem, a pretium dui. In malesuada enim in dolor at vestibulum nisi. Nullam vehicula nisi velit. Mauris turpis nisl, molestie ut vehicula."
            docUrl="https://github.com/konstellation-io/kdl"
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
