import styled from 'styled-components';

/* eslint-disable-next-line */
export interface FormFieldBooleanRendererProps {}

const StyledFormFieldBooleanRenderer = styled.div`
  color: pink;
`;

export function FormFieldBooleanRenderer(props: FormFieldBooleanRendererProps) {
  return (
    <StyledFormFieldBooleanRenderer>
      <h1>Welcome to FormFieldBooleanRenderer!</h1>
    </StyledFormFieldBooleanRenderer>
  );
}

export default FormFieldBooleanRenderer;
