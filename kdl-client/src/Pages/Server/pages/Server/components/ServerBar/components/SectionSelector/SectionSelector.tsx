import React, { FC } from 'react';
import styles from './SectionSelector.module.scss';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { EnhancedRouteConfiguration } from 'Hooks/useProjectNavigation';

type Props = {
  options: EnhancedRouteConfiguration[];
  selectedSection: string;
};
const SectionSelector: FC<Props> = ({ options, selectedSection }) => (
  <div className={styles.container}>
    <ul>
      {options.map(({ to, Icon, label }) => (
        <Link to={to} key={label}>
          <li
            className={cx(styles.section, {
              [styles.selectedSection]:
                label.toLowerCase() === selectedSection.toLowerCase(),
            })}
          >
            <Icon className={cx('icon-regular', styles.icon)} />
            <span className={styles.label}>{label}</span>
          </li>
        </Link>
      ))}
    </ul>
  </div>
);
export default SectionSelector;
