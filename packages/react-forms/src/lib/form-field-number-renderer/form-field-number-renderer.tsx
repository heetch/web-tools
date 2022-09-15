import { ChangeEvent, useState } from 'react';
import { Controller } from 'react-hook-form';
import { InputField } from '@heetch/flamingo-react';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldNumber } from '../../types/fields';
import { buildValidationRules } from '../../utils';

export function FormFieldNumberRenderer({
  field,
  control,
  options,
}: FormFieldRendererProps<FormFieldNumber>) {
  const rules = buildValidationRules(field);

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => {
        const [value, setValue] = useState(
          fieldProps.value !== undefined ? fieldProps.value : ''
        );

        const onChange = (e: ChangeEvent<HTMLInputElement>) => {
          fieldProps.onChange(
            e.target.value === '' ? undefined : parseFloat(e.target.value)
          );
          setValue(e.target.value);
        };

        const props = {
          ...fieldProps,
          onChange,
          value,
          id: fieldProps.name,
          label: options?.showLabelsAsPlaceholders ? undefined : field.label,
          placeholder: options?.showLabelsAsPlaceholders
            ? field.label
            : field.placeholder,
          helper: fieldState?.error ? fieldState.error.message : field.helper,
          invalid: !!fieldState?.error,
          type: 'number',
        };

        return <InputField {...props} />;
      }}
    />
  );
}

export default FormFieldNumberRenderer;
