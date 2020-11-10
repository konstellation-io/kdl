import { Button, Left, Right, SearchSelect } from 'kwc';
import React, { useEffect } from 'react';

import IconAdd from '@material-ui/icons/Add';
import SettingsMenu from '../SettingsMenu/SettingsMenu';
import styles from './ProjectBar.module.scss';
import { useForm } from 'react-hook-form';
import useProjectFilters from 'Pages/Cluster/apollo/hooks/useProjectFilters';

type FormData = {
  name: string;
};

function ProjectBar() {
  const { updateFilters } = useProjectFilters();
  const { setValue, unregister, register, watch } = useForm<FormData>({
    defaultValues: { name: '' },
  });

  useEffect(() => {
    register('name');
    return () => unregister('name');
  }, [register, unregister, setValue]);

  const projectName = watch('name');
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
          onChange={(value: string) => setValue('name', value)}
          className={styles.formSearch}
          placeholder="Search"
          showSearchIcon
          hideError
          hideLabel
        />
      </Left>
      <Right className={styles.right}>
        <Button label="ADD PROJECT" Icon={IconAdd} />
        <Button label="USERS" />
        <SettingsMenu />
      </Right>
    </div>
  );
}

export default ProjectBar;
