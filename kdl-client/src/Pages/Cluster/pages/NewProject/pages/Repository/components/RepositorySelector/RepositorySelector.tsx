import Repository, { LOCATION } from '../Repository/Repository';

import React from 'react';
import RepositoryOption from '../RepositoryOption/RepositoryOption';
import { RepositoryType } from 'Graphql/types/globalTypes';
import styles from './RepositorySelector.module.scss';

type Props = {
  setRepositoryType: Function;
};

function RepositorySelector({ setRepositoryType }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.repositories}>
        <RepositoryOption
          title="External Repository"
          subtitle="Mauris non tempor quam, et lacinia sapien. Mauris accumsan eros eget libero posuere vulputate. Etiam elit elit, elementum sed varius at, adipiscing vitae est. Sed nec felis."
          actionLabel="USE EXTERNAL"
          onSelect={() => setRepositoryType(RepositoryType.EXTERNAL)}
          Repository={<Repository squareLocation={LOCATION.OUT} />}
        />
        <RepositoryOption
          title="Internal Repository"
          subtitle="Fusce vehicula dolor arcu, sit amet blandit dolor mollis nec. Donec viverra eleifend lacus, vitae ullamcorper metus. Sed sollicitudin ipsum quis nunc sollicitudin ultrices."
          actionLabel="USE INTERNAL"
          onSelect={() => setRepositoryType(RepositoryType.INTERNAL)}
          Repository={<Repository squareLocation={LOCATION.IN} />}
        />
      </div>
    </div>
  );
}

export default RepositorySelector;
