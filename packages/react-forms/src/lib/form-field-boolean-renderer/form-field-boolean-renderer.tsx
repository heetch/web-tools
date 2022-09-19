import { Checkbox, Toggle } from '@heetch/flamingo-react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldBoolean } from '../../types/fields';
import { buildValidationRules, isRequired } from '../../utils';

export function FormFieldBooleanRenderer({
  field,
  control,
  options,
}: FormFieldRendererProps<FormFieldBoolean>) {
  const rules = buildValidationRules(field);
  const showAsterisk = options?.showRequiredAsterisk && isRequired(field);

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => {
        const label = field.label + (showAsterisk ? ' *' : '');

        const props = {
          ...fieldProps,
          id: fieldProps.name,
          value: fieldProps.value ? 'checked' : '',
          checked: fieldProps.value,
          helper: fieldState?.error ? fieldState.error.message : field.helper,
          invalid: !!fieldState?.error,
        };

        return field.format === 'toggle' ? (
          <Toggle {...props}>{label}</Toggle>
        ) : (
          <Checkbox {...props}>{label}</Checkbox>
        );
      }}
    />
  );
}
