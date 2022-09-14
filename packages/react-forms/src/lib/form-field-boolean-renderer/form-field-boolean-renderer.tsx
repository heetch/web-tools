import { Checkbox, Toggle } from '@heetch/flamingo-react';
import { Controller, UseControllerProps } from 'react-hook-form';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldBoolean } from '../../types/fields';

export function FormFieldBooleanRenderer({
  field,
  control,
}: FormFieldRendererProps<FormFieldBoolean>) {
  const rules = (field.validators || []).reduce<UseControllerProps['rules']>(
    (acc, cur) => {
      switch (cur.type) {
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
            validate: cur.parameter,
          };
      }

      return acc;
    },
    {}
  );

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
