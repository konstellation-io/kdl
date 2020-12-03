import {
  BUTTON_ALIGN,
  Button,
  CustomOptionProps,
  Select,
  SelectTheme,
} from 'kwc';
import ROUTE, { buildRoute } from 'Constants/routes';
import React, { FunctionComponent } from 'react';

import CopyToClipboard from 'Components/CopyToClipboard/CopyToClipboard';
import IconProjects from '@material-ui/icons/Widgets';
import IconUsers from '@material-ui/icons/Person';
import { Server } from 'Hooks/useServers';
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
  openedServer: Server;
};
function ServerOptions({ openedServer }: Props) {
  const projectsUrl = buildRoute.server(ROUTE.SERVER, openedServer.id);
  function ProjectsButton({ label }: CustomOptionProps) {
    return <ServerButton Icon={IconProjects} to={projectsUrl} label={label} />;
  }

  const usersUrl = buildRoute.server(ROUTE.SERVER, openedServer.id);
  function UsersButton({ label }: CustomOptionProps) {
    return <ServerButton Icon={IconUsers} to={usersUrl} label={label} />;
  }

  const optionToButton = {
    [openedServer.url || '']: UrlOption,
    proyects: ProjectsButton,
    signOut: UsersButton,
  };

  const options = ['proyects', 'signOut'];
  if (openedServer.url) options.unshift(openedServer.url);

  return (
    <div className={styles.container}>
      <Select
        label=""
        placeholder={openedServer.name}
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
