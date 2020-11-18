import { Button, CHECK, Check, TextInput } from 'kwc';

import { GetNewProject_newProject } from 'Graphql/client/queries/getNewProject.graphql';
import React from 'react';
import cx from 'classnames';
import styles from './Repository.module.scss';

function validateUrl(value: string): string | boolean {
  return CHECK.getValidationError([CHECK.isDomainValid(value)]);
}

type Props = {
  updateValue: Function;
  updateError: Function;
  clearError: Function;
  data: GetNewProject_newProject;
};
function RepositoryExternal({
  updateValue,
  updateError,
  clearError,
  data,
}: Props) {
  const {
    values: { url, skipTest },
    errors,
  } = data.repository;

  const urlValidation = validateUrl(url);

  function validateConnection() {
    updateError('connection', '');
  }

  return (
    <div className={styles.repositoryInternal}>
      <div className={styles.formUrlRow}>
        <TextInput
          label="url"
          onChange={(value: string) => {
            updateValue('url', value);
            updateError('connection', 'Connection not tested');
            clearError('url');
          }}
          onBlur={() =>
            url &&
            updateError('url', urlValidation === true ? '' : urlValidation)
          }
          error={errors.url}
          customClassname={styles.formUrl}
          formValue={url}
          showClearButton
        />
        <Button
          label="TEST"
          primary
          className={styles.test}
          onClick={validateConnection}
        />
      </div>
      <div
        className={cx(styles.connectionError, {
          [styles.show]: !skipTest && url,
          [styles.error]: errors.connection,
        })}
      >
        {errors.connection || 'Connection OK.'}
      </div>
      <div className={styles.formTestRow}>
        <Check
          className={styles.testCheck}
          checked={skipTest}
          onChange={(checked) => updateValue('skipTest', checked)}
        />
        <p className={styles.testCheckLabel}>
          Save my project without testing the url
        </p>
      </div>
    </div>
  );
}

export default RepositoryExternal;
