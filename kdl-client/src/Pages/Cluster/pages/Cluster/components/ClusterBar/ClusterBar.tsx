import { ExpandableTextInput, Left, Right } from 'kwc';
import React, { useEffect } from 'react';

import ClusterDetails from './ClusterDetails';
import ClusterMetrics from './components/ClusterMetrics/ClusterMetrics';
import SettingsMenu from '../SettingsMenu/SettingsMenu';
import styles from './ClusterBar.module.scss';
import { useForm } from 'react-hook-form';
import useProjectFilters from 'Pages/Cluster/apollo/hooks/useProjectFilters';

type FormData = {
  projectName: string;
};

function ClusterBar() {
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
      <Left className={styles.left}>
        <ClusterDetails />
        <ClusterMetrics />
      </Left>
      <Right className={styles.right}>
        <ExpandableTextInput
          onChange={(value: string) => setValue('projectName', value)}
          className={styles.formSearch}
        />
        <SettingsMenu />
      </Right>
    </div>
  );
}

export default ClusterBar;
