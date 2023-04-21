import { ReactNode } from 'react';
import { Helper } from '@heetch/flamingo-react';
import styles from './error-helper.module.scss';

export const ErrorHelper = ({ children }: { children?: ReactNode }) => {
  return <Helper className={styles['ErrorHelper']}>{children}</Helper>;
};
