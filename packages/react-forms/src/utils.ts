import { FormField, FormFieldNumber, FormFieldString } from './types/fields';
import {
  FormFieldValidator,
  FormFieldValidatorBoolean,
  FormFieldValidatorCommon,
  FormFieldValidatorDate,
  FormFieldValidatorFile,
  FormFieldValidatorNumber,
  FormFieldValidatorString,
  ValidationRules,
} from './types/validators';
import { DefaultTexts } from './types/forms';
import { FieldValues, UseFormSetValue } from 'react-hook-form';

export const MOBILE_BREAKPOINT = 480;

// eslint-disable-line no-control-regex
export const EMAIL_REGEX =
  /(?:[a-z\d!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z\d!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z\d](?:[a-z\d-]*[a-z\d])?\.)+[a-z\d](?:[a-z\d-]*[a-z\d])?|\[(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?|[a-z\d-]*[a-z\d]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // eslint-disable-line no-control-regex

export const UUID_REGEX =
  /^[\da-fA-F]{8}\b-[\da-fA-F]{4}\b-[\da-fA-F]{4}\b-[\da-fA-F]{4}\b-[\da-fA-F]{12}$/; // eslint-disable-line no-control-regex

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRequired(field: FormField): boolean {
  return field.validators?.some(({ type }) => type === 'required') || false;
}

export function buildValidationRules(
  field: FormField,
  texts?: DefaultTexts,
  setValue: UseFormSetValue<FieldValues> = () => {} // eslint-disable-line @typescript-eslint/no-empty-function
): ValidationRules {
  const validators = field.validators || [];
  switch (field.type) {
    case 'boolean':
      return buildValidationRulesBoolean(
        validators as FormFieldValidatorBoolean[],
        setValue
      );
    case 'number':
      return buildValidationRulesNumber(
        validators as FormFieldValidatorNumber[],
        setValue,
        field.format,
        texts
      );
    case 'file':
      return buildValidationRulesFile(
        validators as FormFieldValidatorFile[],
        setValue
      );
    case 'date':
      return buildValidationRulesDate(
        validators as FormFieldValidatorDate[],
        setValue
      );
    case 'string':
      return buildValidationRulesString(
        validators as FormFieldValidatorString[],
        setValue,
        field.format,
        texts
      );
  }
}

function buildValidationRulesCommon<T>(
  validators: FormFieldValidatorCommon<T>[],
  setValue: UseFormSetValue<FieldValues>
): ValidationRules {
  return validators.reduce<ValidationRules>((acc, cur) => {
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
          validate: {
            ...(acc?.validate || {}),
            [cur.name || 'custom']: (value) => cur.parameter(value, setValue),
          },
        };
    }
    return acc;
  }, {});
}

function buildValidationRulesBoolean(
  validators: FormFieldValidatorBoolean[],
  setValue: UseFormSetValue<FieldValues>
): ValidationRules {
  return buildValidationRulesCommon<boolean>(validators, setValue);
}

function buildValidationRulesNumber(
  validators: FormFieldValidatorNumber[],
  setValue: UseFormSetValue<FieldValues>,
  format: FormFieldNumber['format'],
  texts?: DefaultTexts
): ValidationRules {
  const { common, other } = extractCommonValidators<number>(validators);

  let baseRules = buildValidationRulesCommon<number>(common, setValue);
  if (format === 'integer') {
    baseRules = {
      ...(baseRules || {}),
      validate: {
        ...(baseRules?.validate || {}),
        integer: (value: number) =>
          Number.isInteger(value) || texts?.errors?.integer || false,
      },
    };
  } else {
    baseRules = {
      ...(baseRules || {}),
      validate: {
        ...(baseRules?.validate || {}),
        number: (value: number) =>
          !isNaN(value) || texts?.errors?.number || false,
      },
    };
  }

  return other.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      case 'min':
      case 'max':
        return {
          ...acc,
          [cur.type]: cur.error_message
            ? { value: cur.parameter, message: cur.error_message }
            : cur.parameter,
        };
      default:
        return acc;
    }
  }, baseRules);
}

function buildValidationRulesFile(
  validators: FormFieldValidatorFile[],
  setValue: UseFormSetValue<FieldValues>
): ValidationRules {
  const { common, other } = extractCommonValidators<File[]>(validators);
  return other.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      case 'max_size':
        return {
          ...acc,
          validate: {
            ...(acc?.validate || {}),
            file_max_size: (files: File[]) => {
              const valid = files.every(
                (file) => file.size <= cur.parameter * 1000000
              );
              return valid || cur.error_message || false;
            },
          },
        };
      case 'max':
        return {
          ...acc,
          validate: {
            ...(acc?.validate || {}),
            file_max: (files: File[]) => {
              const valid = files.length <= cur.parameter;
              return valid || cur.error_message || false;
            },
          },
        };
      default:
        return acc;
    }
  }, buildValidationRulesCommon<File[]>(common, setValue));
}

function buildValidationRulesDate(
  validators: FormFieldValidatorDate[],
  setValue: UseFormSetValue<FieldValues>
): ValidationRules {
  const { common, other } = extractCommonValidators<Date>(validators);
  return other.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      case 'min':
      case 'max': {
        const parameter =
          cur.parameter instanceof Date
            ? cur.parameter
            : new Date(cur.parameter);

        return {
          ...acc,
          [cur.type]: cur.error_message
            ? { value: parameter, message: cur.error_message }
            : parameter,
        };
      }
      default:
        return acc;
    }
  }, buildValidationRulesCommon<Date>(common, setValue));
}

function buildValidationRulesString(
  validators: FormFieldValidatorString[],
  setValue: UseFormSetValue<FieldValues>,
  format: FormFieldString['format'],
  texts?: DefaultTexts
): ValidationRules {
  const { common, other } = extractCommonValidators<string>(validators);

  let baseRules = buildValidationRulesCommon<string>(common, setValue);
  if (format === 'uuid') {
    baseRules = {
      ...(baseRules || {}),
      validate: {
        ...(baseRules?.validate || {}),
        uuid: (value) => UUID_REGEX.test(value) || texts?.errors?.uuid || false,
      },
    };
  }
  if (format === 'email') {
    baseRules = {
      ...(baseRules || {}),
      validate: {
        ...(baseRules?.validate || {}),
        email: (value) =>
          EMAIL_REGEX.test(value) || texts?.errors?.email || false,
      },
    };
  }

  return other.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      case 'max_size':
        return {
          ...acc,
          maxLength: cur.error_message
            ? { value: cur.parameter, message: cur.error_message }
            : cur.parameter,
        };
      case 'regex': {
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
      }
      default:
        return acc;
    }
  }, baseRules);
}

function extractCommonValidators<
  T,
  K = Exclude<FormFieldValidator, FormFieldValidatorCommon<T>>
>(
  validators: FormFieldValidator[]
): {
  common: FormFieldValidatorCommon<T>[];
  other: K[];
} {
  const common: FormFieldValidatorCommon<T>[] = [];
  const other: K[] = [];

  validators.forEach((validator) => {
    if (validator.type === 'required' || validator.type === 'function') {
      common.push(validator as FormFieldValidatorCommon<T>);
    } else {
      other.push(validator as K);
    }
  });

  return { common, other };
}

export const DEFAULT_TEXTS: DefaultTexts = {
  submit: 'Submit',
  errors: {
    required: 'This field is mandatory',
    regex: 'Bad format',
    min: {
      number: (min) => `Minimum: ${min}`,
      date: (min) => `Minimum: ${min.toLocaleDateString('fr-FR')}`,
    },
    max: {
      number: (max) => `Maximum: ${max}`,
      date: (max) => `Maximum: ${max.toLocaleDateString('fr-FR')}`,
    },
    max_size: {
      string: (size) => `Maximum: ${size} characters`,
      file: (size) => `Maximum file size: ${size}MB`,
    },
    integer: 'Expected: integer',
    number: 'Expected: number',
    uuid: 'Expected: valid UUID',
    email: 'Expected: valid e-mail',
  },
};

export function injectDefaultTexts<T extends FormField>(
  texts: DefaultTexts,
  field: T
): T {
  const validators = field.validators?.map((validator) => {
    let defaultText: string | undefined = undefined;

    switch (validator.type) {
      case 'required':
        defaultText = texts?.errors?.required;
        break;
      case 'max_size':
        if (field.type === 'string') {
          defaultText = texts?.errors?.max_size?.string?.(validator.parameter);
        }
        if (field.type === 'file') {
          defaultText = texts?.errors?.max_size?.file?.(validator.parameter);
        }
        break;
      case 'regex':
        defaultText = texts?.errors?.regex;
        break;
      case 'min':
      case 'max':
        if (field.type === 'number') {
          defaultText = texts?.errors?.[validator.type]?.number?.(
            validator.parameter as number
          );
        }
        if (field.type === 'date') {
          const d =
            validator.parameter instanceof Date
              ? validator.parameter
              : new Date(validator.parameter);
          defaultText = texts?.errors?.[validator.type]?.date?.(d);
        }
        break;
      case 'function':
        return validator; // The custom validation function provides its own error message
      default:
        break;
    }

    if (validator.error_message) return validator;

    return { ...validator, error_message: defaultText };
  });

  return {
    ...field,
    validators,
  };
}

export const classNames = {
  form: 'rf-form',
  submit: 'rf-submit',
  layout: {
    row: 'rf-layout-row',
    cell: 'rf-layout-cell',
  },
  field: {
    boolean: {
      common: 'rf-field-boolean',
      checkbox: 'rf-field-boolean-checkbox',
      toggle: 'rf-field-boolean-toggle',
    },
    date: {
      common: 'rf-field-date',
      datetime: 'rf-field-date-datetime',
    },
    file: {
      base: 'rf-field-file',
      list: 'rf-field-file-list',
      item: 'rf-field-file-item',
      input_wrapper: 'rf-field-file-input-wrapper',
      input: 'rf-field-file-input',
      add_button: 'rf-field-file-add-btn',
    },
    number: 'rf-field-number',
    string: {
      common: 'rf-field-string',
      line: 'rf-field-string-line',
      text: 'rf-field-string-text',
      select: 'rf-field-string-select',
    },
  },
};
