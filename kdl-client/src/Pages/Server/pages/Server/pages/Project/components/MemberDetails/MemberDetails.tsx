import { Button, Select } from 'kwc';
import {
  GetProjectMembers,
  GetProjectMembers_project_members,
} from 'Graphql/queries/types/GetProjectMembers';
import React, { useEffect } from 'react';
import {
  RemoveMember,
  RemoveMemberVariables,
  RemoveMember_removeMember,
} from 'Graphql/mutations/types/RemoveMember';
import {
  UpdateMember,
  UpdateMemberVariables,
} from 'Graphql/mutations/types/UpdateMember';

import { AccessLevel } from 'Graphql/types/globalTypes';
import ActionsBar from 'Components/Layout/ActionsBar/ActionsBar';
import Gravatar from 'react-gravatar';
import IconDate from '@material-ui/icons/Today';
import IconRemove from '@material-ui/icons/Delete';
import IconTime from '@material-ui/icons/Schedule';
import { formatDate } from 'Utils/format';
import { loader } from 'graphql.macro';
import { mutationPayloadHelper } from 'Utils/formUtils';
import styles from './MemberDetails.module.scss';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';

const GetMembersQuery = loader('Graphql/queries/getProjectMembers.graphql');
const UpdateMemberMutation = loader('Graphql/mutations/updateMember.graphql');
const RemoveMemberMutation = loader('Graphql/mutations/removeMember.graphql');

const gravatarStyle = {
  borderRadius: '50%',
};

type FormData = {
  accessLevel: AccessLevel;
};

type Props = {
  member: GetProjectMembers_project_members;
  projectId: string;
  close: () => void;
};
function MemberDetail({ member, projectId, close }: Props) {
  const [updateMember] = useMutation<UpdateMember, UpdateMemberVariables>(
    UpdateMemberMutation,
    {
      onError: (e) => console.error(`updateMember: ${e}`),
    }
  );

  const [removeMember] = useMutation<RemoveMember, RemoveMemberVariables>(
    RemoveMemberMutation,
    {
      onError: (e) => console.error(`removeMember: ${e}`),
      update: (cache, { data }) => {
        const removedMember = data?.removeMember as RemoveMember_removeMember;
        const cacheResult = cache.readQuery<GetProjectMembers>({
          variables: {
            id: projectId,
          },
          query: GetMembersQuery,
        });

        if (cacheResult !== null) {
          const { project } = cacheResult;

          cache.writeQuery({
            query: GetMembersQuery,
            variables: {
              id: projectId,
            },
            data: {
              project: {
                ...project,
                members: project.members.filter(
                  (m) => m.id !== removedMember.id
                ),
              },
            },
          });
        }
      },
    }
  );

  const { handleSubmit, setValue, unregister, register, watch } = useForm<
    FormData
  >({
    defaultValues: { accessLevel: member.accessLevel },
  });

  useEffect(() => {
    register('accessLevel');

    return () => unregister('accessLevel');
  }, [register, unregister]);

  function handleUpdateMember({ accessLevel }: FormData) {
    updateMember(
      mutationPayloadHelper({
        projectId,
        memberId: member.id,
        accessLevel,
      })
    );
  }
  function handleRemoveMember() {
    removeMember(mutationPayloadHelper({ projectId, memberId: member.id }));
    close();
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.info}>
          <Gravatar email={member.email} size={160} style={gravatarStyle} />
          <p className={styles.accessLevel}>{member.accessLevel}</p>
          <p className={styles.email}>{member.email}</p>
          <div className={styles.added}>
            <IconDate className="icon-small" />
            <p className={styles.addedValue}>
              {`ACTIVE FROM: ${formatDate(new Date(member.addedDate), true)}`}
            </p>
          </div>
        </div>
        <div className={styles.form}>
          <p className={styles.lastActivityTitle}>LAST ACTIVITY</p>
          {member.lastActivity ? (
            <div className={styles.lastActivity}>
              <IconTime className="icon-small" />
              <p className={styles.lastActivityValue}>
                {`${formatDate(new Date(member.lastActivity), true)}`}
              </p>
            </div>
          ) : (
            <p>User has no activity yet</p>
          )}
          <Select
            label="What access level does the user have?"
            options={Object.values(AccessLevel)}
            formSelectedOption={watch('accessLevel')}
            className={styles.formAccessLevel}
            onChange={(value: AccessLevel) => setValue('accessLevel', value)}
            hideError
          />
          <div className={styles.removeButtonContainer}>
            <Button
              label="REMOVE FROM PROYECT"
              Icon={IconRemove}
              className={styles.removeButton}
              onClick={handleRemoveMember}
            />
          </div>
        </div>
      </div>
      <ActionsBar className={styles.actions}>
        <Button
          label="SAVE"
          onClick={handleSubmit(handleUpdateMember)}
          disabled={member.accessLevel === watch('accessLevel')}
          primary
        />
        <Button label="CANCEL" onClick={close} />
      </ActionsBar>
    </div>
  );
}

export default MemberDetail;
