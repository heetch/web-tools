import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldString } from '../../types/fields';
import { Controller } from 'react-hook-form';
import { InputField, SelectField, TextareaField } from '@heetch/flamingo-react';
import { buildValidationRules, classNames, isRequired } from '../../utils';

export function FormFieldStringRenderer({
  field,
  control,
  setValue,
  options,
  texts,
}: FormFieldRendererProps<FormFieldString>) {
  const rules = buildValidationRules(field, texts, setValue);
  const showAsterisk = options?.showRequiredAsterisk && isRequired(field);

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => {
        let label: string | undefined =
          field.label + (showAsterisk ? ' *' : '');
        let placeholder: string | undefined =
          field.placeholder || (field.format === 'select' ? '-' : undefined);
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
          disabled: field.disabled,
        };

        switch (field.format) {
          case 'text':
            return (
              <TextareaField
                {...props}
                className={[
                  classNames.field.string.common,
                  classNames.field.string.text,
                ].join(' ')}
              />
            );
          case 'select':
            return (
              <SelectField
                {...props}
                options={field.options}
                className={[
                  classNames.field.string.common,
                  classNames.field.string.select,
                ].join(' ')}
              />
            );
          default:
            return (
              <InputField
                {...props}
                className={[
                  classNames.field.string.common,
                  classNames.field.string.line,
                ].join(' ')}
              />
            );
        }
      }}
    />
  );
}
