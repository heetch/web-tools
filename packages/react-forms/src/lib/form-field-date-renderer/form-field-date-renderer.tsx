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
import {
  buildValidationRules,
  classNames,
  isRequired,
  MOBILE_BREAKPOINT,
} from '../../utils';
import { ErrorHelper } from '../error-helper/error-helper';
import {
  FormFieldValidatorCommon,
  FormFieldValidatorDate,
} from '../../types/validators';

export function FormFieldDateRenderer({
  field,
  control,
  setValue,
  options,
  texts,
}: FormFieldRendererProps<FormFieldDate>) {
  const rules = buildValidationRules(field, texts, setValue);
  const showAsterisk = options?.showRequiredAsterisk && isRequired(field);
  const vpWidth = useWindowWidth();

  return (
    <Controller
      control={control}
      name={field.id}
      rules={rules}
      render={({ field: fieldProps, fieldState }) => {
        let label: string | undefined =
          field.label + (showAsterisk ? ' *' : '');
        let placeholder: string | undefined = field.placeholder;
        if (options?.showLabelsAsPlaceholders) {
          placeholder = label;
          label = undefined;
        }

        const props = {
          ...fieldProps,
          id: fieldProps.name,
          value: fieldProps.value !== undefined ? fieldProps.value : '',
          placeholder: placeholder || '',
          invalid: !!fieldState?.error,
          disabled: field.disabled,
        };

        const helper = fieldState?.error ? undefined : field.helper;

        const errorHelper = fieldState?.error?.message;

        const iconColor = props.invalid
          ? flamingo.color.element.error
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
          <div
            className={[
              classNames.field.date.common,
              ...(field.format === 'date-time'
                ? [classNames.field.date.datetime]
                : []),
            ].join(' ')}
          >
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
              showMonthDropdown={field.yearSelector}
              showYearDropdown={field.yearSelector}
              timeFormat="HH:mm"
            />
            {helper && <Helper>{helper}</Helper>}
            {errorHelper && <ErrorHelper>{errorHelper}</ErrorHelper>}
          </div>
        );
      }}
    />
  );
}
