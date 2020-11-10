import { CHECK, TextInput } from 'kwc';
import React, { useEffect } from 'react';

import { GetNewProject_newProject } from 'Graphql/client/queries/getNewProject.graphql';
import { RouteClusterParams } from 'Constants/routes';
import styles from './Repository.module.scss';
import useClusters from 'Hooks/useClusters';
import { useParams } from 'react-router-dom';

function validateProjectSlug(value: string): string | boolean {
  return CHECK.getValidationError([
    CHECK.isLowerCase(value),
    CHECK.matches(value, /^[a-z]/, 'Slug must start with a lowercase letter'),
    CHECK.matches(value, /.{3,}/, 'Slug must contain at least 3 characters'),
    CHECK.isAlphanumeric(
      value.replace('-', ''),
      'Slug only can contain lowercase alphanumeric and hyphens'
    ),
    CHECK.isSlug(value),
  ]);
}

type Props = {
  updateValue: Function;
  updateError: Function;
  clearError: Function;
  data: GetNewProject_newProject;
};
function RepositoryInternal({
  updateValue,
  updateError,
  clearError,
  data,
}: Props) {
  const { clusterId } = useParams<RouteClusterParams>();
  const {
    values: { slug, url },
    errors,
  } = data.repository;
  const { getCluster } = useClusters();
  const cluster = getCluster(clusterId);

  useEffect(() => {
    updateValue('url', `${cluster?.url}.${slug}`);
  }, [updateValue, slug, cluster]);

  const slugOk = validateProjectSlug(slug);

  return (
    <div className={styles.repositoryInternal}>
      <TextInput
        label="repository slug"
        onChange={(value: string) => {
          updateValue('slug', value);
          clearError('slug');
        }}
        onBlur={() =>
          slug && updateError('slug', slugOk === true ? '' : slugOk)
        }
        formValue={slug}
        error={errors.slug}
        showClearButton
      />
      <div className={styles.url}>
        <p className={styles.urlTitle}>REPOSITORY URL</p>
        <p className={styles.urlContent}>{url}</p>
      </div>
    </div>
  );
}

export default RepositoryInternal;
