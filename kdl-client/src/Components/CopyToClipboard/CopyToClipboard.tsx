import React, { FC, MouseEvent } from 'react';

import { Button } from 'kwc';
import IconCopy from '@material-ui/icons/FileCopyOutlined';
import { copyToClipboard } from 'Utils/clipboard';
import cx from 'classnames';
import styles from './CopyToClipboard.module.scss';
import { toast } from 'react-toastify';

type Props = {
  children: string;
  className?: string;
};
const CopyToClipboard: FC<Props> = ({ children, className }) => {
  function onCopy(event?: MouseEvent<HTMLDivElement>) {
    event?.stopPropagation();
    event?.preventDefault();

    copyToClipboard(children);

    toast.info('Copied to clipboard');
    toast.clearWaitingQueue();
  }

  return (
    <Button
      label=""
      Icon={IconCopy}
      onClick={onCopy}
      className={cx(styles.container, className)}
    />
  );
};

export default CopyToClipboard;
