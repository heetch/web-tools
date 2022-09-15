import { FormField } from './types/fields';
import {
  FormFieldValidatorBoolean,
  FormFieldValidatorDate,
  FormFieldValidatorFile,
  FormFieldValidatorNumber,
  FormFieldValidatorString,
  ValidationRules,
} from './types/validators';

export const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const UUID_REGEX =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildValidationRules(field: FormField): ValidationRules {
  switch (field.type) {
    case 'boolean':
      return buildValidationRulesBoolean(field.validators || []);
    case 'number':
      return buildValidationRulesNumber(field.validators || []);
    case 'file':
      return buildValidationRulesFile(field.validators || []);
    case 'date':
      return buildValidationRulesDate(field.validators || []);
    case 'string':
      return buildValidationRulesString(field.validators || []);
  }
}

function buildValidationRulesBoolean(
  validators: FormFieldValidatorBoolean[]
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
          validate: cur.parameter,
        };
    }
    return acc;
  }, {});
}

function buildValidationRulesNumber(
  validators: FormFieldValidatorNumber[]
): ValidationRules {
  return validators.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      default:
        break;
    }
    return acc;
  }, {});
}

function buildValidationRulesFile(
  validators: FormFieldValidatorFile[]
): ValidationRules {
  return validators.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      default:
        break;
    }
    return acc;
  }, {});
}

function buildValidationRulesDate(
  validators: FormFieldValidatorDate[]
): ValidationRules {
  return validators.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      default:
        break;
    }
    return acc;
  }, {});
}

function buildValidationRulesString(
  validators: FormFieldValidatorString[]
): ValidationRules {
  return validators.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      default:
        break;
    }
    return acc;
  }, {});
}
