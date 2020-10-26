import { Button, Left, Right, SearchSelect } from 'kwc';
import useClusters, { ClusterType } from 'Hooks/useClusters';

import IconAdd from '@material-ui/icons/Add';
import ROUTE from 'Constants/routes';
import React from 'react';
import styles from './ClustersBar.module.scss';

type Props = {
  nClusters: number;
  setValue: Function;
};
function ClustersBar({ nClusters, setValue }: Props) {
  const { clusters } = useClusters();
  const hasLocalCluster = !!clusters.find((c) => c.type === ClusterType.LOCAL);
  const addClusterRoute = hasLocalCluster
    ? ROUTE.CONNECT_TO_REMOTE_CLUSTER
    : ROUTE.NEW_CLUSTER;

  return (
    <div className={styles.container}>
      <Left>
        <SearchSelect
          label=""
          options={[]}
          onChange={(value: string) => setValue('clusterSearch', value)}
          className={styles.formSearch}
          placeholder="Search"
          showSearchIcon
          hideError
          hideLabel
        />
      </Left>
      <Right className={styles.right}>
        <p className={styles.nClusters}>{`${nClusters} clusters shown`}</p>
        <Button label="ADD CLUSTER" Icon={IconAdd} to={addClusterRoute} />
      </Right>
    </div>
  );
}

export default ClustersBar;
