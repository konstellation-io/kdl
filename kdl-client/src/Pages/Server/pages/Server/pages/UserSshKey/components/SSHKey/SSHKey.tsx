import { Button } from 'kwc';
import { GetSSHKey_sshKey } from 'Graphql/queries/types/GetSSHKey';
import IconCalendar from '@material-ui/icons/Event';
import IconTime from '@material-ui/icons/Schedule';
import React from 'react';
import { copyToClipboard } from 'Utils/clipboard';
import { formatDate } from 'Utils/format';
import styles from './SSHKey.module.scss';
import { toast } from 'react-toastify';

type Props = {
  sshKey: GetSSHKey_sshKey;
};
function SSHKey({ sshKey }: Props) {
  const { public: key, lastActivity, creationDate } = sshKey;

  function onCopy() {
    copyToClipboard(key);

    toast.info('Copied to clipboard');
    toast.clearWaitingQueue();
  }

  return (
    <div className={styles.container}>
      <p className={styles.fieldLabel}>KEY</p>
      <div className={styles.key}>
        <div className={styles.keyValue} title={key}>
          {key}
        </div>
        <p className={styles.copyPre}>TO SEE THE KEY, JUST</p>
        <Button
          className={styles.copy}
          label="COPY IT"
          onClick={onCopy}
          height={30}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.infoEl}>
          <IconCalendar className="icon-small" />
          <p className={styles.infoValue}>{`ADDED ON ${formatDate(
            new Date(creationDate)
          )}`}</p>
        </div>
        <div className={styles.infoEl}>
          <IconTime className="icon-small" />
          <p className={styles.infoValue}>
            {lastActivity
              ? `LAST USED ON ${formatDate(new Date(lastActivity))}`
              : 'STILL NOT USED'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SSHKey;
