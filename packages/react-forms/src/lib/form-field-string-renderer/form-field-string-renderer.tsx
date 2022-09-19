import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldString } from '../../types/fields';
import { Controller } from 'react-hook-form';
import { InputField, SelectField, TextareaField } from '@heetch/flamingo-react';
import { buildValidationRules, isRequired } from '../../utils';

export function FormFieldStringRenderer({
  field,
  control,
  options,
}: FormFieldRendererProps<FormFieldString>) {
  const rules = buildValidationRules(field);
  const showAsterisk = options?.showRequiredAsterisk && isRequired(field);

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => {
        let label: string | undefined =
          field.label + (showAsterisk ? ' *' : '');
        let placeholder: string = field.placeholder || '-';
        if (options?.showLabelsAsPlaceholders) {
          placeholder = label;
          label = undefined;
        }

        const props = {
          ...fieldProps,
          id: fieldProps.name,
          value: fieldProps.value !== undefined ? fieldProps.value : '',
          label,
          placeholder,
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
