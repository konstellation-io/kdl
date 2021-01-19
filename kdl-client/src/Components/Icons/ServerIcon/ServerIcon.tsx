import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
const ServerIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <g>
      <polygon points="3,20 12,2 21,20" />
    </g>
  </SvgIcon>
);
export default ServerIcon;
