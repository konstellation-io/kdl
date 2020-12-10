import { CHECK, SpinnerCircular, TextInput } from 'kwc';
import {
  GET_NEW_PROJECT,
  GetNewProject,
} from 'Graphql/client/queries/getNewProject.graphql';
import React, { useEffect } from 'react';

import { RouteServerParams } from 'Constants/routes';
import styles from './InternalRepository.module.scss';
import useNewProject from '../../../../../../apollo/hooks/useNewProject';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import useServers from 'Hooks/useServers';
import IconLink from '@material-ui/icons/Link';

function validateProjectSlug(value: string): string {
  const error = CHECK.getValidationError([
    CHECK.isLowerCase(value),
    CHECK.matches(value, /^[a-z]/, 'Slug must start with a lowercase letter'),
    CHECK.matches(value, /.{3,}/, 'Slug must contain at least 3 characters'),
    CHECK.isAlphanumeric(
      value.replace('-', ''),
      'Slug only can contain lowercase alphanumeric and hyphens'
    ),
    CHECK.isSlug(value),
  ]);
  return error === true ? '' : (error as string);
}
type Props = {
  showErrors: boolean;
};
function InternalRepository({ showErrors }: Props) {
  const { data } = useQuery<GetNewProject>(GET_NEW_PROJECT);
  const { serverId } = useParams<RouteServerParams>();
  const { getServer } = useServers();
  const { updateValue, updateError, clearError } = useNewProject(
    'internalRepository'
  );
  const { values } = data?.newProject.internalRepository || {};
  const { errors } = data?.newProject.internalRepository || {};

  const slug = values?.slug || '';
  const slugError = errors?.slug;

  const server = getServer(serverId);

  useEffect(() => {
    updateValue('url', `${server?.url}.${slug}`);
  }, [updateValue, slug, server]);

  if (!data) return <SpinnerCircular />;

  const slugOk = validateProjectSlug(slug);

  return (
    <div className={styles.repositoryInternal}>
      <div className={styles.url}>
        <p className={styles.urlTitle}>repository url</p>
        <div className={styles.serverUrlContainer}>
          <IconLink className="icon-regular" />
          <span className={styles.urlContent}>{`${server?.url}/`}</span>
        </div>
      </div>
      <TextInput
        label="repository slug"
        customClassname={styles.slug}
        onChange={(value: string) => {
          updateValue('slug', value);
          clearError('slug');
        }}
        onBlur={() => updateError('slug', slugOk)}
        formValue={slug}
        error={showErrors ? slugError : ''}
        showClearButton
      />
    </div>
  );
}

export default InternalRepository;
