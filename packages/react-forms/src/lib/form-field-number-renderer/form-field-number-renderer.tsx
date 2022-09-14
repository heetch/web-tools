import { Controller, FieldValue, UseControllerProps } from 'react-hook-form';
import { InputField } from '@heetch/flamingo-react';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldNumber } from '../../types/fields';

export function FormFieldNumberRenderer({
  field,
  control,
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
    field.format === 'integer'
      ? {
          validate: {
            // number: (value) => !isNaN(Number(value)),
            integer: (value) => Number.isInteger(Number(value)),
          },
        }
      : {}
  );

  if (field.format === 'integer') {
    rules;
  }

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => {
        const props = {
          ...fieldProps,
          id: fieldProps.name,
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
