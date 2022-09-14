import { FormField } from '@/types/fields';
import {
  FormFieldValidatorBoolean,
  FormFieldValidatorDate,
  FormFieldValidatorFile,
  FormFieldValidatorNumber,
  FormFieldValidatorString,
  ValidationRules,
} from '@/types/validators';

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
    case 'string':
      return ['date', 'date-time'].includes(field.format)
        ? buildValidationRulesDate((field.validators || []) as FormFieldValidatorDate[])
        : buildValidationRulesString((field.validators || []) as FormFieldValidatorString[]);
  }
}

function buildValidationRulesBoolean(validators: FormFieldValidatorBoolean[]): ValidationRules {
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


function buildValidationRulesNumber(validators: FormFieldValidatorNumber[]): ValidationRules {
  return validators.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      default:
        break;
    }
    return acc;
  }, {});
}

function buildValidationRulesFile(validators: FormFieldValidatorFile[]): ValidationRules {
    return validators.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      default:
        break;
    }
    return acc;
  }, {});
}

function buildValidationRulesDate(validators: FormFieldValidatorDate[]): ValidationRules {
    return validators.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      default:
        break;
    }
    return acc;
  }, {});
}

function buildValidationRulesString(validators: FormFieldValidatorString[]): ValidationRules {
    return validators.reduce<ValidationRules>((acc, cur) => {
    switch (cur.type) {
      default:
        break;
    }
    return acc;
  }, {});
}