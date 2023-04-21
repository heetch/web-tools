import { Checkbox, Toggle } from '@heetch/flamingo-react';
import { Controller } from 'react-hook-form';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldBoolean } from '../../types/fields';
import { buildValidationRules, classNames, isRequired } from '../../utils';

export function FormFieldBooleanRenderer({
  field,
  control,
  setValue,
  options,
  texts,
}: FormFieldRendererProps<FormFieldBoolean>) {
  const rules = buildValidationRules(field, texts, setValue);
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
          disabled: field.disabled,
        };

        return field.format === 'toggle' ? (
          <Toggle
            {...props}
            className={[
              classNames.field.boolean.common,
              classNames.field.boolean.toggle,
            ].join(' ')}
          >
            {label}
          </Toggle>
        ) : (
          <Checkbox
            {...props}
            className={[
              classNames.field.boolean.common,
              classNames.field.boolean.checkbox,
            ].join(' ')}
          >
            {label}
          </Checkbox>
        );
      }}
    />
  );
}
