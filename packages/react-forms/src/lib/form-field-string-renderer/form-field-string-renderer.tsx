import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldString } from '../../types/fields';
import { Controller } from 'react-hook-form';
import { InputField, SelectField, TextareaField } from '@heetch/flamingo-react';
import { buildValidationRules } from '../../utils';

export function FormFieldStringRenderer({
  field,
  control,
  options,
}: FormFieldRendererProps<FormFieldString>) {
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
          value: fieldProps.value !== undefined ? fieldProps.value : '',
          label: options?.showLabelsAsPlaceholders ? undefined : field.label,
          placeholder: options?.showLabelsAsPlaceholders
            ? field.label
            : field.placeholder,
          helper: fieldState?.error ? fieldState.error.message : field.helper,
          invalid: !!fieldState?.error,
        };

        switch (field.format) {
          case 'text':
            return <TextareaField {...props} />;
          case 'select':
            return <SelectField {...props} options={field.options} />;
          default:
            return <InputField {...props} />;
        }
      }}
    />
  );
}
