import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldString } from '../../types/fields';
import { Controller, UseControllerProps } from 'react-hook-form';
import { InputField, SelectField, TextareaField } from '@heetch/flamingo-react';
import { EMAIL_REGEX, UUID_REGEX } from '../../utils';

export function FormFieldStringRenderer({
  field,
  control,
  options,
}: FormFieldRendererProps<FormFieldString>) {
  let rules: UseControllerProps['rules'] = {};

  switch (field.format) {
    case 'uuid':
      rules.validate = {
        uuid: (value) => UUID_REGEX.test(value),
      };
      break;
    case 'email':
      rules.validate = {
        email: (value) => EMAIL_REGEX.test(value),
      };
      break;
    default:
      break;
  }

  rules = (field.validators || []).reduce<UseControllerProps['rules']>(
    (acc, cur) => {
      switch (cur.type) {
        case 'max_size':
          return {
            ...acc,
            maxLength: cur.error_message
              ? { value: cur.parameter, message: cur.error_message }
              : cur.parameter,
          };
        case 'regex':
          const re =
            cur.parameter instanceof RegExp
              ? cur.parameter
              : new RegExp(cur.parameter);
          return {
            ...acc,
            pattern: cur.error_message
              ? { value: re, message: cur.error_message }
              : re,
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
    rules
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

export default FormFieldStringRenderer;
