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

import { GetUsers } from 'Graphql/queries/types/GetUsers';
import Member from './components/Member/Member';
import { loader } from 'graphql.macro';
import styles from './TabMembers.module.scss';
import useMember from 'Graphql/hooks/useMember';
import { useQuery } from '@apollo/client';

const GetUsersQuery = loader('Graphql/queries/getUsers.graphql');
const GetMembersQuery = loader('Graphql/queries/getProjectMembers.graphql');

type Props = {
  projectId: string;
  openMemberDetails: (member: GetProjectMembers_project_members | null) => void;
  memberDetails: GetProjectMembers_project_members | null;
};
function TabMembers({ projectId, openMemberDetails, memberDetails }: Props) {
  const [memberSelection, setMemberSelection] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const { addMembersById } = useMember(projectId, {
    onCompleteAdd: () => setMemberSelection([]),
  });

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

      openMemberDetails(selectedMembers[0]);
    }
  }, [dataMembers, openMemberDetails, memberDetails]);

  if (loadingMembers || loadingUsers) return <SpinnerCircular />;
  if (!dataMembers || !dataUsers || errorMembers || errorUsers)
    return <ErrorMessage />;

  const users = dataUsers.users.map((user) => user.email);
  const members = dataMembers.project.members.map((member) => member.email);
  const allMembers = [...members, ...memberSelection];

  const options = users.filter((email) => !allMembers.includes(email));

  function performAddmembers() {
    if (dataUsers) {
      const emailToId = Object.fromEntries(
        dataUsers.users.map((user) => [user.email, user.id])
      );
      addMembersById(memberSelection.map((member) => emailToId[member]));
    }
  }

  return (
    <div>
      <div className={styles.formSearch}>
        <SearchSelect
          options={options}
          theme={SearchSelectTheme.LIGHT}
          chipSelection={memberSelection}
          onRemoveChip={(email) =>
            setMemberSelection(memberSelection.filter((m) => m !== email))
          }
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
