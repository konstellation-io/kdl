import { ErrorMessage, SpinnerCircular } from 'kwc';
import FAQBox, { BOX_THEME } from './components/FAQBox/FAQBox';

import { GetSSHKey } from 'Graphql/queries/types/GetSSHKey';
import React from 'react';
import SSHKey from './components/SSHKey/SSHKey';
import { copyAndToast } from 'Utils/clipboard';
import { loader } from 'graphql.macro';
import styles from './UserSshKey.module.scss';
import { useQuery } from '@apollo/client';
import useSSHKey from 'Graphql/hooks/useSSHKey';

const GetSSHKeys = loader('Graphql/queries/getSSHKey.graphql');

function UserSshKey() {
  const { data, loading, error } = useQuery<GetSSHKey>(GetSSHKeys);
  const { regenerateSSHKey } = useSSHKey();

  function getContent() {
    if (loading) return <SpinnerCircular />;
    if (error || !data) return <ErrorMessage />;

    const { sshKey } = data;

    return (
      <>
        <div className={styles.key}>
          <SSHKey sshKey={sshKey} />
        </div>
        <div className={styles.faqs}>
          <h2>If you need some help, check this</h2>
          <div className={styles.box}>
            <FAQBox
              label="What is the SSH key for?"
              title="Nam dapibus nisl vitae."
              desciption="Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia."
            />
          </div>
          <div className={styles.box}>
            <FAQBox
              label="How may I upload this SSH key to a repository?"
              title="Nam dapibus nisl vitae."
              desciption="Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia."
            />
          </div>
          <div className={styles.box}>
            <FAQBox
              label="I want to change my SSH key"
              title="Nam dapibus nisl vitae."
              theme={BOX_THEME.ERROR}
              desciption="Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia."
              action={{
                needConfirmation: true,
                message: 'Sure, I will do it.',
                label: 'REGENERATE',
                onClick: regenerateSSHKey,
              }}
            />
          </div>
          <FAQBox
            label="Where can I find my SSH Key?"
            title="Nam dapibus nisl vitae."
            desciption="Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia. Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia."
            theme={BOX_THEME.WARN}
            action={{
              label: 'COPY PRIVATE KEY',
              onClick: () => copyAndToast(sshKey.private),
            }}
          />
        </div>
      </>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>SSH Key</h1>
      <h3 className={styles.subtitle}>
        This is your private SSH key, works lorem ipsum and for dolor amet. If
        you want more infromation please lorem.
      </h3>
      {getContent()}
    </div>
  );
}

export default UserSshKey;
