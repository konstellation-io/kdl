import {
  BUTTON_ALIGN,
  Button,
  CustomOptionProps,
  Select,
  SelectTheme,
} from 'kwc';
import ROUTE, { buildRoute } from 'Constants/routes';
import React, { FunctionComponent } from 'react';

import { Cluster } from 'Hooks/useClusters';
import CopyToClipboard from 'Components/CopyToClipboard/CopyToClipboard';
import IconProjects from '@material-ui/icons/Widgets';
import IconUsers from '@material-ui/icons/Person';
import styles from './ServerOptions.module.scss';

interface ServerButtonProps extends CustomOptionProps {
  to: string;
  Icon: FunctionComponent;
}
function ServerButton({ label, to, Icon }: ServerButtonProps) {
  return (
    <Button
      label={label.toUpperCase()}
      to={to}
      Icon={Icon}
      key={`button${label}`}
      className={styles.selectButton}
      align={BUTTON_ALIGN.LEFT}
    />
  );
}

function UrlOption({ label }: CustomOptionProps) {
  return (
    <div className={styles.urlOption}>
      <p className={styles.title}>SERVER URL:</p>
      <p className={styles.url}>{label}</p>
      <CopyToClipboard>{label}</CopyToClipboard>
    </div>
  );
}

type Props = {
  openedCluster: Cluster;
};
function ServerOptions({ openedCluster }: Props) {
  const projectsUrl = buildRoute.cluster(ROUTE.CLUSTER, openedCluster.id);
  function ProjectsButton({ label }: CustomOptionProps) {
    return <ServerButton Icon={IconProjects} to={projectsUrl} label={label} />;
  }

  const usersUrl = buildRoute.cluster(ROUTE.CLUSTER, openedCluster.id);
  function UsersButton({ label }: CustomOptionProps) {
    return <ServerButton Icon={IconUsers} to={usersUrl} label={label} />;
  }

  const optionToButton = {
    [openedCluster.url || '']: UrlOption,
    proyects: ProjectsButton,
    signOut: UsersButton,
  };

  const options = ['proyects', 'signOut'];
  if (openedCluster.url) options.unshift(openedCluster.url);

  return (
    <div className={styles.container}>
      <Select
        label=""
        placeholder={openedCluster.name}
        options={options}
        theme={SelectTheme.DARK}
        CustomOptions={optionToButton}
        className={styles.settings}
        shouldSort={false}
        showSelectAllOption={false}
        hideError
      />
    </div>
  );
}

export default ServerOptions;
