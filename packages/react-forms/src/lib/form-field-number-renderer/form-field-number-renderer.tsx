import { ChangeEvent, useState } from 'react';
import { Controller } from 'react-hook-form';
import { InputField } from '@heetch/flamingo-react';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldNumber } from '../../types/fields';
import { buildValidationRules, isRequired } from '../../utils';
import {
  FormFieldValidatorCommon,
  FormFieldValidatorDate,
  FormFieldValidatorNumber,
} from '../../types/validators';

export function FormFieldNumberRenderer({
  field,
  control,
  options,
  texts,
}: FormFieldRendererProps<FormFieldNumber>) {
  const rules = buildValidationRules(field, texts);
  const showAsterisk = options?.showRequiredAsterisk && isRequired(field);

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

        let label: string | undefined =
          field.label + (showAsterisk ? ' *' : '');
        let placeholder: string | undefined = field.placeholder;
        if (options?.showLabelsAsPlaceholders) {
          placeholder = label;
          label = undefined;
        }

        type MinMaxValidator = Exclude<
          FormFieldValidatorNumber,
          FormFieldValidatorCommon<number>
        >;
        const min = (
          field.validators?.find((v) => v.type === 'min') as
            | MinMaxValidator
            | undefined
        )?.parameter;
        const max = (
          field.validators?.find((v) => v.type === 'max') as
            | MinMaxValidator
            | undefined
        )?.parameter;

        const props = {
          ...fieldProps,
          onChange,
          value,
          id: fieldProps.name,
          label,
          placeholder,
          helper: fieldState?.error ? fieldState.error.message : field.helper,
          invalid: !!fieldState?.error,
          type: 'number',
          min,
          max,
        };

        return <InputField {...props} />;
      }}
    />
  );
}
