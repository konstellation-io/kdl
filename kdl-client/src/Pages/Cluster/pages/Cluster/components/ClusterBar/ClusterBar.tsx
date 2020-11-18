import { Button, Left, Right, SearchSelect } from 'kwc';
import ROUTE, { RouteClusterParams, buildRoute } from 'Constants/routes';
import React, { useEffect } from 'react';

import IconAdd from '@material-ui/icons/Add';
import SettingsMenu from '../SettingsMenu/SettingsMenu';
import styles from './ClusterBar.module.scss';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import useProjectFilters from 'Pages/Cluster/apollo/hooks/useProjectFilters';

type FormData = {
  projectName: string;
};

function ClusterBar() {
  const { clusterId } = useParams<RouteClusterParams>();
  const { updateFilters } = useProjectFilters();
  const { setValue, unregister, register, watch } = useForm<FormData>({
    defaultValues: { projectName: '' },
  });

  useEffect(() => {
    register('projectName');
    return () => unregister('projectName');
  }, [register, unregister, setValue]);

  const projectName = watch('projectName');
  useEffect(() => {
    updateFilters({
      name: projectName,
    });
  }, [projectName, updateFilters]);

  return (
    <div className={styles.container}>
      <Left>
        <SearchSelect
          label=""
          options={[]}
          onChange={(value: string) => setValue('projectName', value)}
          className={styles.formSearch}
          placeholder="Search"
          showSearchIcon
          hideError
          hideLabel
        />
      </Left>
      <Right className={styles.right}>
        <Button
          label="ADD PROJECT"
          Icon={IconAdd}
          to={buildRoute.cluster(ROUTE.NEW_PROJECT, clusterId)}
        />
        <Button label="USERS" />
        <SettingsMenu />
      </Right>
    </div>
  );
}

export default ClusterBar;
