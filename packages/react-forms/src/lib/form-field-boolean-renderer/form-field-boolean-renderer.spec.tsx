import { render } from '@testing-library/react';

import FormFieldBooleanRenderer from './form-field-boolean-renderer';

describe('FormFieldBooleanRenderer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormFieldBooleanRenderer />);
    expect(baseElement).toBeTruthy();
  });
});
