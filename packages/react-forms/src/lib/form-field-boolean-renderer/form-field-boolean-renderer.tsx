import { Checkbox, Toggle } from '@heetch/flamingo-react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldBoolean } from '../../types/fields';
import { buildValidationRules } from '../../utils';

export function FormFieldBooleanRenderer({
  field,
  control,
}: FormFieldRendererProps<FormFieldBoolean>) {
  const rules = buildValidationRules(field);

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => {
        const props = {
          ...fieldProps,
          id: fieldProps.name,
          value: fieldProps.value ? 'checked' : '',
          checked: fieldProps.value,
          helper: fieldState?.error ? fieldState.error.message : field.helper,
          invalid: !!fieldState?.error,
        };

        return field.format === 'toggle' ? (
          <Toggle {...props}>{field.label}</Toggle>
        ) : (
          <Checkbox {...props}>{field.label}</Checkbox>
        );
      }}
    />
  );
}

export default FormFieldBooleanRenderer;
