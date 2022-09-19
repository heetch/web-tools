import styled, { css } from 'styled-components';
import { FormCell } from '@heetch/react-forms';
import { PropsWithChildren } from 'react';

export const FormLayoutRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const FormLayoutCell = ({
  widthConstraint,
  children,
}: PropsWithChildren<FormCell>) => {
  return <StyledCell widthConstraint={widthConstraint}>{children}</StyledCell>;
};

const StyledCell = styled.div<Pick<FormCell, 'widthConstraint'>>`
  ${({ widthConstraint }) =>
    typeof widthConstraint === 'string'
      ? css`
          width: ${widthConstraint};
        `
      : css`
          flex: ${widthConstraint || 1};
        `}
`;
