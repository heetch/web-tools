import { FormCell } from '@heetch/react-forms';
import { CSSProperties, HTMLProps, PropsWithChildren, ReactNode } from 'react';
import { classNames } from '../../utils';
import styles from './form-layout.module.scss';

export const FormLayout = ({
  children,
  ...formProps
}: PropsWithChildren<HTMLProps<HTMLFormElement>>) => {
  return (
    <form
      className={[styles['FormLayout'], classNames.form].join(' ')}
      {...formProps}
    >
      {children}
    </form>
  );
};

export const FormLayoutRow = ({ children }: { children?: ReactNode }) => {
  return (
    <div className={[styles['FormLayoutRow'], classNames.layout.row].join(' ')}>
      {children}
    </div>
  );
};

export const FormLayoutCell = ({
  widthConstraint,
  children,
}: PropsWithChildren<FormCell>) => {
  const cellStyle: CSSProperties =
    typeof widthConstraint === 'string'
      ? { width: widthConstraint }
      : { flex: widthConstraint || 1 };

  return (
    <div style={cellStyle} className={classNames.layout.cell}>
      {children}
    </div>
  );
};
