import styled, { css } from 'styled-components';
import { FormCell } from '@heetch/react-forms';
import { PropsWithChildren } from 'react';
import { classNames } from '../../utils';

export const FormLayout = styled.form.attrs({ className: classNames.form })`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

export const FormLayoutRow = styled.div.attrs({
  className: classNames.layout.row,
})`
  display: flex;
  gap: 8px;
  justify-content: baseline;
  align-items: center;
`;

export const FormLayoutCell = ({
  widthConstraint,
  children,
}: PropsWithChildren<FormCell>) => {
  return <StyledCell widthConstraint={widthConstraint}>{children}</StyledCell>;
};

const StyledCell = styled.div.attrs({ className: classNames.layout.cell })<
  Pick<FormCell, 'widthConstraint'>
>`
  ${({ widthConstraint }) =>
    typeof widthConstraint === 'string'
      ? css`
          width: ${widthConstraint};
        `
      : css`
          flex: ${widthConstraint || 1};
        `}
`;
