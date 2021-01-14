import React from 'react';
import styles from './Breadcrumbs.module.scss';
import Crumb from './components/Crumb/Crumb';
import useBreadcrumbs from './useBreadcrumbs';

function Breadcrumbs() {
  const { crumbs } = useBreadcrumbs();
  return (
    <div className={styles.container}>
      {crumbs.map((crumb, index) => (
        <Crumb
          key={index}
          LeftIconComponent={crumb.LeftIconComponent}
          RightIconComponent={crumb.RightIconComponent}
          crumbText={crumb.crumbText}
          bottomComponent={crumb.bottomComponent}
        />
      ))}
    </div>
  );
}

export default Breadcrumbs;
