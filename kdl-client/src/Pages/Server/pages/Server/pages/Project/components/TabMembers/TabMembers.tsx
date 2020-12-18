import {
  AddMembers,
  AddMembersVariables,
  AddMembers_addMembers,
} from 'Graphql/mutations/types/AddMembers';
import {
  Button,
  ErrorMessage,
  SearchSelect,
  SearchSelectTheme,
  SpinnerCircular,
} from 'kwc';
import {
  GetProjectMembers,
  GetProjectMembersVariables,
  GetProjectMembers_project_members,
} from 'Graphql/queries/types/GetProjectMembers';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { GetUsers } from 'Graphql/queries/types/GetUsers';
import Member from './components/Member/Member';
import { loader } from 'graphql.macro';
import { mutationPayloadHelper } from 'Utils/formUtils';
import styles from './TabMembers.module.scss';

const GetUsersQuery = loader('Graphql/queries/getUsers.graphql');
const GetMembersQuery = loader('Graphql/queries/getProjectMembers.graphql');
const AddMembersMutation = loader('Graphql/mutations/addMembers.graphql');

type Props = {
  projectId: string;
  openMemberDetails: (member: GetProjectMembers_project_members | null) => void;
  memberDetails: GetProjectMembers_project_members | null;
};
function TabMembers({ projectId, openMemberDetails, memberDetails }: Props) {
  const [memberSelection, setMemberSelection] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const [addMembers] = useMutation<AddMembers, AddMembersVariables>(
    AddMembersMutation,
    {
      onCompleted: () => setMemberSelection([]),
      onError: (e) => console.error(`addMembers: ${e}`),
      update: (cache, { data }) => {
        const newMembers = data?.addMembers as AddMembers_addMembers[];
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
                members: project.members.concat(newMembers),
              },
            },
          });
        }
      },
    }
  );

  const {
    data: dataUsers,
    loading: loadingUsers,
    error: errorUsers,
  } = useQuery<GetUsers>(GetUsersQuery);
  const {
    data: dataMembers,
    loading: loadingMembers,
    error: errorMembers,
  } = useQuery<GetProjectMembers, GetProjectMembersVariables>(GetMembersQuery, {
    variables: {
      id: projectId,
    },
  });

  // Update opened member details as data is updated
  useEffect(() => {
    if (dataMembers && memberDetails) {
      const selectedMembers = dataMembers.project.members.filter(
        (m) => m.id === memberDetails.id
      );
      const selectedMember = selectedMembers[0];
      openMemberDetails(selectedMember);
    }
  }, [dataMembers, openMemberDetails, memberDetails]);

  if (loadingMembers || loadingUsers) return <SpinnerCircular />;
  if (!dataMembers || !dataUsers || errorMembers || errorUsers)
    return <ErrorMessage />;

  const users = dataUsers.users.map((user) => user.email);
  const members = dataMembers.project.members.map((member) => member.email);
  const options = users.filter(
    (email) => ![...members, ...memberSelection].includes(email)
  );

  function performAddmembers() {
    if (dataUsers) {
      const emailToId = Object.fromEntries(
        dataUsers.users.map((user) => [user.email, user.id])
      );
      addMembers(
        mutationPayloadHelper({
          projectId,
          memberIds: memberSelection.map((member) => emailToId[member]),
        })
      );
    }
  }

  return (
    <div>
      <div className={styles.formSearch}>
        <SearchSelect
          options={options}
          theme={SearchSelectTheme.LIGHT}
          chipSelection={memberSelection}
          onChange={(value: string) => {
            setError('');

            if (value) {
              if (users.includes(value)) {
                setMemberSelection([...memberSelection, value]);
              } else {
                setError('Add a user from the Server users');
              }
            }
          }}
          className={styles.formInput}
          placeholder="Find a new member..."
          error={error}
          showSearchIcon
          hideLabel
          showClear
        />
        <Button
          label="ADD"
          height={44}
          onClick={performAddmembers}
          disabled={!memberSelection.length}
        />
      </div>
      <div className={styles.members}>
        {dataMembers.project.members.map((member) => (
          <Member key={member.id} member={member} onOpen={openMemberDetails} />
        ))}
      </div>
    </div>
  );
}

export default TabMembers;
