import {
  AccessLevel,
  RemoveUsersInput,
  UpdateAccessLevelInput,
} from 'Graphql/types/globalTypes';
import {
  CHECK,
  ErrorMessage,
  ModalContainer,
  ModalLayoutConfirmList,
  SpinnerCircular,
} from 'kwc';
import {
  GET_USER_SETTINGS,
  GetUserSettings,
} from 'Graphql/client/queries/getUserSettings.graphql';
import {
  ModalInfo,
  defaultModalInfo,
  getModalInfo,
} from './confirmationModals';
import React, { useEffect, useRef, useState } from 'react';
import {
  RemoveUsers,
  RemoveUsersVariables,
  RemoveUsers_removeUsers,
} from 'Graphql/mutations/types/RemoveUsers';
import {
  UpdateAccessLevel,
  UpdateAccessLevelVariables,
} from 'Graphql/mutations/types/UpdateAccessLevel';
import { useMutation, useQuery } from '@apollo/client';

import { GetUsers } from 'Graphql/queries/types/GetUsers';
import UserFiltersAndActions from './components/UserFiltersAndActions/UserFiltersAndActions';
import UserList from './components/UserList/UserList';
import UserRow from './components/UserRow/UserRow';
import { loader } from 'graphql.macro';
import { mutationPayloadHelper } from 'Utils/formUtils';
import styles from './Users.module.scss';
import { useForm } from 'react-hook-form';

const GetUsersQuery = loader('Graphql/queries/getUsers.graphql');
const UpdateAccessLevelMutation = loader(
  'Graphql/mutations/updateAccessLevel.graphql'
);
const RemoveUsersMutation = loader('Graphql/mutations/removeUsers.graphql');

function verifyComment(value: string) {
  return CHECK.getValidationError([CHECK.isFieldNotEmpty(value)]);
}

type FormData = {
  comment: string;
};

function Users() {
  const { handleSubmit, setValue, register, unregister } = useForm<FormData>({
    defaultValues: {
      comment: '',
    },
  });
  const { data, loading, error } = useQuery<GetUsers>(GetUsersQuery);
  const { data: localData } = useQuery<GetUserSettings>(GET_USER_SETTINGS);
  const [removeUsers] = useMutation<RemoveUsers, RemoveUsersVariables>(
    RemoveUsersMutation,
    {
      update: (cache, result) => {
        if (result.data) {
          const removedUsers = result.data.removeUsers;
          const cacheResult = cache.readQuery<GetUsers>({
            query: GetUsersQuery,
          });
          if (cacheResult !== null) {
            const removedUserIds = removedUsers.map((u) => u.id);
            const { users } = cacheResult;
            cache.writeQuery({
              query: GetUsersQuery,
              data: {
                users: users.filter((u) => !removedUserIds.includes(u.id)),
              },
            });
          }
        }
      },
      onError: (e) => console.error(`removeUsers: ${e}`),
    }
  );
  const [updateAccessLevel] = useMutation<
    UpdateAccessLevel,
    UpdateAccessLevelVariables
  >(UpdateAccessLevelMutation, {
    onError: (e) => console.error(`updateAccessLevel: ${e}`),
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const modalInfo = useRef<ModalInfo>(defaultModalInfo);

  useEffect(() => {
    register('comment', { validate: verifyComment });

    return () => unregister('comment');
  }, [register, unregister, setValue]);

  function openModal() {
    setShowConfirmation(true);
  }
  function closeModal() {
    setShowConfirmation(false);
  }

  function onSubmit() {
    handleSubmit(({ comment }: FormData) =>
      modalInfo.current.action(comment)
    )();
  }

  const selectedUsers = localData?.userSettings.selectedUserIds || [];

  function getUsersInfo(user?: [string]) {
    const userIds = user || selectedUsers;
    const nUsers = userIds.length;
    const plural = nUsers > 1;

    return { userIds, nUsers, plural };
  }

  function onDeleteUsers(user?: [string]) {
    const usersInfo = getUsersInfo(user);

    openModal();
    modalInfo.current = getModalInfo({
      type: 'delete',
      action: () => {
        removeUsers(
          mutationPayloadHelper<RemoveUsersInput>({
            userIds: usersInfo.userIds,
          })
        );
        closeModal();
      },
      ...usersInfo,
    });
  }

  function onUpdateAccessLevel(newAccessLevel: AccessLevel, user?: [string]) {
    const usersInfo = getUsersInfo(user);

    openModal();
    modalInfo.current = getModalInfo({
      type: 'update',
      action: () => {
        updateAccessLevel(
          mutationPayloadHelper<UpdateAccessLevelInput>({
            userIds: usersInfo.userIds,
            accessLevel: newAccessLevel,
          })
        );
        closeModal();
      },
      accessLevel: newAccessLevel,
      ...usersInfo,
    });
  }

  function getContent() {
    if (loading) return <SpinnerCircular />;
    if (error || !data) return <ErrorMessage />;

    return (
      <>
        <UserFiltersAndActions
          onDeleteUsers={onDeleteUsers}
          onUpdateAccessLevel={onUpdateAccessLevel}
        />
        <UserList
          users={data.users}
          onDeleteUsers={onDeleteUsers}
          onUpdateAccessLevel={onUpdateAccessLevel}
        />
      </>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>Users</h1>
      {getContent()}
      {showConfirmation && (
        <ModalContainer
          title={modalInfo.current.title}
          onAccept={onSubmit}
          onCancel={closeModal}
          actionButtonLabel={modalInfo.current.acceptLabel}
          className={styles.modal}
          blocking
        >
          <ModalLayoutConfirmList message={modalInfo.current.message}>
            {modalInfo.current.userIds.map((userId) => {
              const user = data?.users.find((u) => u.id === userId);
              return (
                <UserRow
                  key={user?.email}
                  email={user?.email}
                  accessLevel={user?.accessLevel}
                />
              );
            })}
          </ModalLayoutConfirmList>
        </ModalContainer>
      )}
    </div>
  );
}

export default Users;
