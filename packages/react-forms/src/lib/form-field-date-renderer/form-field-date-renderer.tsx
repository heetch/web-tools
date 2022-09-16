import { Controller } from 'react-hook-form';
import {
  DatepickerDay,
  Helper,
  Label,
  theme as flamingo,
} from '@heetch/flamingo-react';
import { useWindowWidth } from '@react-hook/window-size';
import { FormFieldRendererProps } from '../../types/renderer';
import { FormFieldDate } from '../../types/fields';
import { buildValidationRules, MOBILE_BREAKPOINT } from '../../utils';
import { ErrorHelper } from '../styled-components';
import {
  FormFieldValidatorCommon,
  FormFieldValidatorDate,
} from '../../types/validators';

export function FormFieldDateRenderer({
  field,
  control,
  options,
}: FormFieldRendererProps<FormFieldDate>) {
  const rules = buildValidationRules(field);

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => {
        const vpWidth = useWindowWidth();

        const props = {
          ...fieldProps,
          id: fieldProps.name,
          value: fieldProps.value !== undefined ? fieldProps.value : '',
          placeholder: options?.showLabelsAsPlaceholders
            ? field.label
            : field.placeholder || '',
          invalid: !!fieldState?.error,
        };

        const label = options?.showLabelsAsPlaceholders
          ? undefined
          : field.label;

        const helper = fieldState?.error ? undefined : field.helper;

        const errorHelper = fieldState?.error?.message;

        const iconColor = props.invalid
          ? flamingo.color_v3.feedback.error
          : options?.iconColor;

        type MinMaxValidator = Exclude<
          FormFieldValidatorDate,
          FormFieldValidatorCommon<Date>
        >;
        const minDate = (
          field.validators?.find((v) => v.type === 'min') as
            | MinMaxValidator
            | undefined
        )?.parameter;
        const maxDate = (
          field.validators?.find((v) => v.type === 'max') as
            | MinMaxValidator
            | undefined
        )?.parameter;

        return (
          <>
            {label && <Label htmlFor={fieldProps.name}>{label}</Label>}
            <DatepickerDay
              {...props}
              dateFormat={
                field.format === 'date' ? 'dd/MM/yyyy' : 'dd/MM/yyyy HH:mm'
              }
              iconColor={iconColor}
              withPortal={vpWidth <= MOBILE_BREAKPOINT}
              minDate={minDate}
              maxDate={maxDate}
              showTimeSelect={field.format === 'date-time'}
              timeFormat="HH:mm"
            />
            {helper && <Helper>{helper}</Helper>}
            {errorHelper && <ErrorHelper>{errorHelper}</ErrorHelper>}
          </>
        );
      }}
    />
  );
}
