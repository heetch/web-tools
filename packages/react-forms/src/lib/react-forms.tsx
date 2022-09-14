import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ReactFormsProps {}

const StyledReactForms = styled.div`
  color: pink;
`;

export function ReactForms(props: ReactFormsProps) {
  return (
    <StyledReactForms>
      <h1>Welcome to ReactForms!</h1>
    </StyledReactForms>
  );
}

export default ReactForms;
