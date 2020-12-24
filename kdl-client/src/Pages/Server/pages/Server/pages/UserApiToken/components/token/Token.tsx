import {
  RemoveApiToken,
  RemoveApiTokenVariables,
  RemoveApiToken_removeApiToken,
} from 'Graphql/mutations/types/RemoveApiToken';

import { Button } from 'kwc';
import ConfirmAction from 'Components/Layout/ConfirmAction/ConfirmAction';
import DeleteIcon from '@material-ui/icons/Delete';
import { GetMe } from 'Graphql/queries/types/GetMe';
import KeyIcon from '@material-ui/icons/VpnKey';
import React from 'react';
import { loader } from 'graphql.macro';
import { mutationPayloadHelper } from 'Utils/formUtils';
import styles from './Token.module.scss';
import { useMutation } from '@apollo/client';

const GetMeQuery = loader('Graphql/queries/getMe.graphql');
const RemoveApiTokenMutation = loader(
  'Graphql/mutations/removeApiToken.graphql'
);

type Props = {
  id: string;
  name: string;
  creationDate: string;
  lastUsedDate: string;
};

function Token({ id, name, creationDate, lastUsedDate }: Props) {
  const [removeApiToken] = useMutation<RemoveApiToken, RemoveApiTokenVariables>(
    RemoveApiTokenMutation,
    {
      variables: mutationPayloadHelper({ apiTokenId: id }).variables,
      onError: (e) => console.error(`removeApiToken: ${e}`),
      update: (cache, result) => {
        if (result.data) {
          const { id: removedTokenId } = result.data
            .removeApiToken as RemoveApiToken_removeApiToken;

          const cacheResult = cache.readQuery<GetMe>({
            query: GetMeQuery,
          });

          if (cacheResult !== null) {
            const { me } = cacheResult;
            cache.writeQuery({
              query: GetMeQuery,
              data: {
                me: {
                  ...me,
                  apiTokens: me.apiTokens.filter(
                    (token) => token.id !== removedTokenId
                  ),
                },
              },
            });
          }
        }
      },
    }
  );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.labelContainer}>
          <div className={styles.labelWrapper}>
            <KeyIcon className="icon-small" />
            <div className={styles.infoContainer}>
              <span className={styles.label}>{name}</span>
              <div className={styles.datesContainer}>
                <div>
                  <span className={styles.dateLabel}>GENERATED ON:</span>
                  <span className={styles.date}>{creationDate}</span>
                </div>
                <div>
                  <span className={styles.dateLabel}>LAST USED:</span>
                  <span className={styles.date}>{lastUsedDate}</span>
                </div>
              </div>
            </div>
          </div>
          <ConfirmAction
            title="DELETE API TOKEN"
            subtitle="To be sure, type the word “DELETE” and will be deleted now."
            action={() => removeApiToken()}
            confirmationWord={'DELETE'}
            showInput
            error
          >
            <Button label="DELETE" Icon={DeleteIcon} />
          </ConfirmAction>
        </div>
      </div>
    </div>
  );
}

export default Token;
