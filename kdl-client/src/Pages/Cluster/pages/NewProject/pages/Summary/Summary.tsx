import {
  GET_NEW_PROJECT,
  GetNewProject,
} from 'Graphql/client/queries/getNewProject.graphql';
import React, { FC } from 'react';

import CopyToClipboard from 'Components/CopyToClipboard/CopyToClipboard';
import { GetMe } from 'Graphql/queries/types/GetMe';
import IconEmail from '@material-ui/icons/Email';
import IconLink from '@material-ui/icons/Link';
import { SpinnerCircular } from 'kwc';
import cx from 'classnames';
import { loader } from 'graphql.macro';
import styles from './Summary.module.scss';
import { useQuery } from '@apollo/client';

const GetMeQuery = loader('Graphql/queries/getMe.graphql');

const Incomplete: FC = () => <p className={styles.incomplete}>Incomplete</p>;

type FieldProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
  incomplete?: boolean;
};
const Field: FC<FieldProps> = ({ title, children, incomplete = false }) => (
  <div className={styles.field}>
    <p className={styles.label}>{title}</p>
    <div>{incomplete ? <Incomplete /> : children}</div>
  </div>
);

type SectionProps = {
  children: JSX.Element | JSX.Element[];
  title: string;
};
const Section: FC<SectionProps> = ({ title, children }) => (
  <div className={styles.section}>
    <p className={styles.title}>{title}</p>
    {children}
  </div>
);

function Summary() {
  const { data } = useQuery<GetNewProject>(GET_NEW_PROJECT);
  const { data: dataMe } = useQuery<GetMe>(GetMeQuery);

  if (!data || !dataMe) return <SpinnerCircular />;

  const {
    information: {
      values: { name, description },
    },
    repository: {
      values: { url, skipTest, type },
      errors: { connection },
    },
  } = data.newProject;

  function getRepositoryCheckMessage() {
    let text = '';

    switch (true) {
      case skipTest:
        text = 'Connection test skipped';
        break;
      case connection !== '':
        text = connection;
        break;
      default:
        text = 'Connection ok';
    }

    return (
      <div
        className={cx(styles.check, {
          [styles.skip]: skipTest,
          [styles.error]: connection !== '',
        })}
      >
        {text}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Section title="Information">
        <Field title="PROJECT NAME" incomplete={name === ''}>
          <p className={styles.name}>{name}</p>
        </Field>
        <Field title="PROJECT DESCRIPTION" incomplete={description === ''}>
          <p className={styles.description}>{description}</p>
        </Field>
      </Section>
      <Section title="Repository">
        <Field title="TYPE" incomplete={type === null}>
          <p className={styles.description}>{type}</p>
        </Field>
        <Field title="URL" incomplete={url === ''}>
          <div className={styles.repository}>
            <IconLink className="icon-regular" />
            <p>{url}</p>
            <CopyToClipboard>{url}</CopyToClipboard>
          </div>
          {getRepositoryCheckMessage()}
        </Field>
        <Field title="EMAIL">
          <div className={styles.email}>
            <IconEmail className="icon-regular" />
            <p>{dataMe.me.email}</p>
          </div>
        </Field>
      </Section>
    </div>
  );
}

export default Summary;
