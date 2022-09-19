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

export const MOBILE_BREAKPOINT = 480;

export const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const UUID_REGEX =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isRequired(field: FormField): boolean {
  return field.validators?.some(({ type }) => type === 'required') || false;
}

export function buildValidationRules(field: FormField): ValidationRules {
  const validators = field.validators || [];
  switch (field.type) {
    case 'boolean':
      return buildValidationRulesBoolean(
        validators as FormFieldValidatorBoolean[]
      );
    case 'number':
      return buildValidationRulesNumber(
        validators as FormFieldValidatorNumber[],
        field.format
      );
    case 'file':
      return buildValidationRulesFile(validators as FormFieldValidatorFile[]);
    case 'date':
      return buildValidationRulesDate(validators as FormFieldValidatorDate[]);
    case 'string':
      return buildValidationRulesString(
        validators as FormFieldValidatorString[],
        field.format
      );
  }
}

function buildValidationRulesCommon<T>(
  validators: FormFieldValidatorCommon<T>[]
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
            [cur.name || 'custom']: cur.parameter,
          },
        };
    }
    return acc;
  }, {});
}

function buildValidationRulesBoolean(
  validators: FormFieldValidatorBoolean[]
): ValidationRules {
  return buildValidationRulesCommon<boolean>(validators);
}

function buildValidationRulesNumber(
  validators: FormFieldValidatorNumber[],
  format: FormFieldNumber['format']
): ValidationRules {
  const { common, other } = extractCommonValidators<number>(validators);

  let baseRules = buildValidationRulesCommon<number>(common);
  if (format === 'integer') {
    baseRules = {
      ...(baseRules || {}),
      validate: {
        ...(baseRules?.validate || {}),
        integer: (value: number) => Number.isInteger(value),
      },
    };
  } else {
    baseRules = {
      ...(baseRules || {}),
      validate: {
        ...(baseRules?.validate || {}),
        number: (value: number) => !isNaN(value),
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
  validators: FormFieldValidatorFile[]
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
  }, buildValidationRulesCommon<File[]>(common));
}

function buildValidationRulesDate(
  validators: FormFieldValidatorDate[]
): ValidationRules {
  const { common, other } = extractCommonValidators<Date>(validators);
  return other.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      case 'min':
      case 'max':
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
      default:
        return acc;
    }
  }, buildValidationRulesCommon<Date>(common));
}

function buildValidationRulesString(
  validators: FormFieldValidatorString[],
  format: FormFieldString['format']
): ValidationRules {
  const { common, other } = extractCommonValidators<string>(validators);

  let baseRules = buildValidationRulesCommon<string>(common);
  if (format === 'uuid') {
    baseRules = {
      ...(baseRules || {}),
      validate: {
        ...(baseRules?.validate || {}),
        uuid: (value) => UUID_REGEX.test(value),
      },
    };
  }
  if (format === 'email') {
    baseRules = {
      ...(baseRules || {}),
      validate: {
        ...(baseRules?.validate || {}),
        email: (value) => EMAIL_REGEX.test(value),
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
