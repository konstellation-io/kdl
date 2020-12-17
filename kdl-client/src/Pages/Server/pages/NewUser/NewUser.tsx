import {
  AddUser,
  AddUserVariables,
  AddUser_addUser,
} from 'Graphql/mutations/types/AddUser';
import { Button, CHECK, Check, Select, TextInput } from 'kwc';
import React, { useEffect } from 'react';

import { AccessLevel } from 'Graphql/types/globalTypes';
import DefaultPage from 'Components/Layout/Page/DefaultPage/DefaultPage';
import { GetUsers } from 'Graphql/queries/types/GetUsers';
import ROUTE from 'Constants/routes';
import cx from 'classnames';
import { get } from 'lodash';
import { loader } from 'graphql.macro';
import { mutationPayloadHelper } from 'Utils/formUtils';
import styles from './NewUser.module.scss';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { useMutation } from '@apollo/client';

const GetUsersQuery = loader('Graphql/queries/getUsers.graphql');
const AddUserMutation = loader('Graphql/mutations/addUser.graphql');

function verifyEmail(value: string) {
  return CHECK.getValidationError([
    CHECK.isFieldNotEmpty(value),
    CHECK.isEmailValid(value),
  ]);
}

function verifyAccessLevel(value: string) {
  return CHECK.getValidationError([
    CHECK.isFieldNotEmpty(value),
    CHECK.isFieldNotInList(value, Object.values(AccessLevel)),
  ]);
}

function verifyConfirmation(value: boolean) {
  return value ? true : 'You need to accept this';
}

type FormData = {
  email: string;
  accessLevel: AccessLevel;
  confirmation: boolean;
};

function NewUser() {
  const history = useHistory();

  const {
    handleSubmit,
    setValue,
    register,
    unregister,
    errors,
    setError,
    clearErrors,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      email: '',
      accessLevel: AccessLevel.VIEWER,
      confirmation: false,
    },
  });
  const [addUser, { loading, error: mutationError }] = useMutation<
    AddUser,
    AddUserVariables
  >(AddUserMutation, {
    onCompleted: onCompleteAddUser,
    onError: (e) => console.error(`addUser: ${e}`),
    update: (cache, { data }) => {
      const newUser = data?.addUser as AddUser_addUser;
      const cacheResult = cache.readQuery<GetUsers>({
        query: GetUsersQuery,
      });

      if (cacheResult !== null) {
        const { users } = cacheResult;
        cache.writeQuery({
          query: GetUsersQuery,
          data: { users: users.concat([newUser]) },
        });
      }
    },
  });

  useEffect(() => {
    register('email', { validate: verifyEmail });
    register('confirmation', { validate: verifyConfirmation });
    register('accessLevel', { required: true, validate: verifyAccessLevel });

    return () => {
      unregister('email');
      unregister('confirmation');
      unregister('accessLevel');
    };
  }, [register, unregister, setValue]);

  useEffect(() => {
    if (mutationError) {
      setError('email', mutationError);
    }
  }, [mutationError, setError]);

  function onCompleteAddUser() {
    history.push(ROUTE.SERVER_USERS);
  }

  function onSubmit(formData: FormData) {
    addUser(mutationPayloadHelper(formData));
  }

  const actions = [
    <Button
      label="CANCEL"
      key="cancel"
      onClick={() => history.goBack()}
      tabIndex={0}
      className={styles.buttonCancel}
    />,
    <Button
      primary
      key="add"
      label="ADD"
      onClick={handleSubmit(onSubmit)}
      loading={loading}
      className={styles.buttonSave}
      tabIndex={0}
    />,
  ];

  return (
    <DefaultPage
      title="Add a new user"
      subtitle="In order to allow its access to the server"
      actions={actions}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>Please introduce a new user</h2>
        <p className={styles.subtitle}>
          In hac habitasse platea dictumst. Vivamus adipiscing fermentum quam
          volutpat aliquam. Integer et elit eget elit facilisis tristique. Nam
          vel iaculis mauris. Sed ullamcorper tellus.
        </p>
        <div className={styles.content}>
          <TextInput
            whiteColor
            label="email"
            error={get(errors.email, 'message') as string}
            onChange={(value: string) => {
              clearErrors('email');
              setValue('email', value);
            }}
            onEnterKeyPress={handleSubmit(onSubmit)}
            autoFocus
          />
          <Select
            label="User type"
            showSelectAllOption={false}
            options={Object.values(AccessLevel)}
            onChange={(value: AccessLevel) => setValue('accessLevel', value)}
            error={get(errors.accessLevel, 'message') as string}
            formSelectedOption={watch('accessLevel')}
            placeholder="Access level"
          />
          <div
            className={cx(styles.disclaimer, {
              [styles.disclaimerError]: errors?.confirmation?.message,
            })}
          >
            <p className={styles.disclaimerTitle}>Please be careful</p>
            <p className={styles.disclaimerDesc}>
              Curabitur lobortis id lorem id bibendum. Ut id consectetur magna.
              Quisque volutpat augue enim, pulvinar lobortis nibh lacinia at.
              Vestibulum nec erat ut mi sollicitudin porttitor id sit amet
              risus. Nam tempus vel odio vitae aliquam. In imperdiet eros id
              lacus vestibulum vestibulum. Suspendisse fermentum sem sagittis
              ante venenatis egestas quis vel justo
            </p>
            <div className={styles.formConfirmation}>
              <Check
                checked={watch('confirmation')}
                onChange={(checked) => {
                  clearErrors('confirmation');
                  setValue('confirmation', checked);
                }}
              />
              <p className={styles.disclaimerLabel}>Sure, I will do it.</p>
            </div>
          </div>
          <div className={styles.error}>{errors?.confirmation?.message}</div>
        </div>
      </div>
    </DefaultPage>
  );
}

export default NewUser;