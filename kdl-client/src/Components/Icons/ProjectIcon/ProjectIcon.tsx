import { SvgIcon, SvgIconProps } from '@material-ui/core';
import React from 'react';
const ProjectIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <g>
      <polygon points="2,12 6,3 22,3 18,12 22,21 6,21" />
    </g>
  </SvgIcon>
);
export default ProjectIcon;
