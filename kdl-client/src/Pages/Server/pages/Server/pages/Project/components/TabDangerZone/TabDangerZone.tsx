import MessageActionBox, {
  BOX_THEME,
} from 'Components/MessageActionBox/MessageActionBox';

import IconArchive from '@material-ui/icons/Archive';
import IconDelete from '@material-ui/icons/Delete';
import React from 'react';
import styles from './TabDangerZone.module.scss';

function TabDangerZone() {
  return (
    <div className={styles.container}>
      <p className={styles.title}>
        Everything you do in this area is dangerous, be careful.
      </p>
      <MessageActionBox
        title="Archive project"
        desciption="Atrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia.."
        action={{
          label: 'ARCHIVE',
          onClick: () => {},
          Icon: IconArchive,
        }}
        theme={BOX_THEME.DEFAULT}
      />
      <MessageActionBox
        title="¿Do you want to delete this project? Be carefull"
        desciption="Atrum, neque sem pretium metus, quis mollis nisl nunc et massa. Vestibulum sed metus in lorem tristique ullamcorper id vitae erat. Nulla mollis sapien sollicitudin lacinia lacinia.."
        action={{
          label: 'DELETE',
          onClick: () => {},
          Icon: IconDelete,
        }}
        theme={BOX_THEME.ERROR}
      />
    </div>
  );
}

export default TabDangerZone;
