import { ChangeEvent, useState } from 'react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { InputField } from '@heetch/flamingo-react';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldNumber } from '../../types/fields';

export function FormFieldNumberRenderer({
  field,
  control,
  options,
}: FormFieldRendererProps<FormFieldNumber>) {
  const rules = (field.validators || []).reduce<UseControllerProps['rules']>(
    (acc, cur) => {
      switch (cur.type) {
        case 'min':
        case 'max':
          return {
            ...acc,
            [cur.type]: cur.error_message
              ? { value: cur.parameter, message: cur.error_message }
              : cur.parameter,
          };
        case 'required':
          return {
            ...acc,
            required: cur.error_message
              ? { value: true, message: cur.error_message }
              : true,
          };
        case 'function':
          return {
            ...acc,
            validate: {
              ...(acc?.validate || {}),
              [cur.name || 'custom']: cur.parameter,
            },
          };
      }

      return acc;
    },
    {
      validate:
        field.format === 'integer'
          ? {
              integer: (value: number) => Number.isInteger(value),
            }
          : {
              number: (value: number) => !isNaN(value),
            },
    }
  );

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
