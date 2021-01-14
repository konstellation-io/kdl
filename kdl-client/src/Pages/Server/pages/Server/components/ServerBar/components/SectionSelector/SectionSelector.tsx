import React, { FC } from 'react';
import styles from './SectionSelector.module.scss';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { enhancedRouteConfiguration } from 'Hooks/useProjectNavigation';

type Props = {
  options: enhancedRouteConfiguration[];
  selectedSection: string;
};
const SectionSelector: FC<Props> = ({ options, selectedSection }) => (
  <div className={styles.container}>
    <ul>
      {options.map((option: enhancedRouteConfiguration) => {
        const Icon = option.icon;
        return (
          <Link to={option.to}>
            <li
              className={cx(styles.section, {
                [styles.selectedSection]:
                  option.label.toLowerCase() === selectedSection.toLowerCase(),
              })}
              key={option.id}
            >
              <Icon className={cx('icon-regular', styles.icon)} />
              <span className={styles.label}>{option.label}</span>
            </li>
          </Link>
        );
      })}
    </ul>
  </div>
);
export default SectionSelector;
