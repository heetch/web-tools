import { ChangeEvent, useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import { InputField } from '@heetch/flamingo-react';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldNumber } from '../../types/fields';
import { buildValidationRules, classNames, isRequired } from '../../utils';
import {
  FormFieldValidatorCommon,
  FormFieldValidatorNumber,
} from '../../types/validators';
import {
  ControllerFieldState,
  ControllerRenderProps,
} from 'react-hook-form/dist/types/controller';

type MinMaxValidator = Exclude<
  FormFieldValidatorNumber,
  FormFieldValidatorCommon<number>
>;

export function FormFieldNumberRenderer({
  field,
  control,
  setValue,
  options,
  texts,
}: FormFieldRendererProps<FormFieldNumber>) {
  const rules = buildValidationRules(field, texts, setValue);
  const showAsterisk = options?.showRequiredAsterisk && isRequired(field);

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => (
        <NumberFieldRenderer
          field={field}
          fieldProps={fieldProps}
          fieldState={fieldState}
          showAsterisk={showAsterisk || false}
          showLabelsAsPlaceholders={options?.showLabelsAsPlaceholders || false}
        />
      )}
    />
  );
}

function NumberFieldRenderer({
  field,
  fieldProps,
  fieldState,
  showAsterisk,
  showLabelsAsPlaceholders,
}: {
  field: FormFieldNumber;
  fieldProps: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  showAsterisk: boolean;
  showLabelsAsPlaceholders: boolean;
}) {
  const [value, setValue] = useState(
    fieldProps.value !== undefined ? fieldProps.value : ''
  );

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    fieldProps.onChange(
      e.target.value === '' ? undefined : parseFloat(e.target.value)
    );
    setValue(e.target.value);
  };

  let label: string | undefined = field.label + (showAsterisk ? ' *' : '');
  let placeholder: string | undefined = field.placeholder;
  if (showLabelsAsPlaceholders) {
    placeholder = label;
    label = undefined;
  }

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
    className: classNames.field.number,
  };

  return <InputField {...props} />;
}
