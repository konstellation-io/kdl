import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
import styles from './ServerIcon.module.scss';
import cx from 'classnames';
import { LocalServerStates } from '../../../Pages/Servers/components/Server/LocalServer';
import { RemoteServerStates } from '../../../Pages/Servers/components/Server/RemoteServer';

interface AdditionalProps {
  state: LocalServerStates | RemoteServerStates;
}
const ServerIcon = (props: SvgIconProps & AdditionalProps) => (
  <SvgIcon {...props} className={cx(props.className, styles[props.state])}>
    <g>
      <polygon points="3,20 12,2 21,20" />
    </g>
  </SvgIcon>
);
export default ServerIcon;
