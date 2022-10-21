import { PropsWithChildren } from 'react';
import { Helper } from '@heetch/flamingo-react';
import styles from './error-helper.module.scss';

export const ErrorHelper = ({ children }: PropsWithChildren) => {
  return <Helper className={styles['ErrorHelper']}>{children}</Helper>;
};
