import React, { useEffect, useState } from 'react';

import { CheckState } from 'Pages/CheckLocalClusterRequirements/CheckLocalClusterRequirements';
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
};

const generateInitialCheck = (id: CheckId, label: string) => ({
  id,
  label,
  isOk: null,
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
      ipcRenderer.send('runCheckRequirement', check.id);
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

  const requirements = checks.map((check) => (
    <li
      key={check.id}
      className={cx(styles.requirement, {
        [styles.pending]: check.isOk === null,
        [styles.ok]: check.isOk,
        [styles.fail]: check.isOk === false,
      })}
    >
      {check.label}
    </li>
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
