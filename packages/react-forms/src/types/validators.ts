// Forms validators
import {
  FieldValues,
  UseControllerProps,
  UseFormSetValue,
} from 'react-hook-form';

export type FormValidatorError<K extends string = string> = {
  field: K;
  error: string;
};

export type FormValidator<
  V extends Record<K, unknown>,
  K extends string = keyof V & string
> =
  | {
      async: true;
      validator: (values: V) => Promise<{ errors: FormValidatorError<K>[] }>;
    }
  | {
      async?: false;
      validator: (values: V) => { errors: FormValidatorError<K>[] };
    };

// Fields validators
export type FormFieldValidatorType =
  | 'required'
  | 'max_size'
  | 'regex'
  | 'min'
  | 'max'
  | 'function';

export type FormFieldValidator =
  | FormFieldValidatorBoolean
  | FormFieldValidatorString
  | FormFieldValidatorNumber
  | FormFieldValidatorDate
  | FormFieldValidatorFile;

export type FormFieldValidatorCommon<T> =
  | FormFieldValidatorRequired
  | FormFieldValidatorFunction<T>;

export type FormFieldValidatorBoolean = FormFieldValidatorCommon<boolean>;

export type FormFieldValidatorString =
  | FormFieldValidatorCommon<string>
  | FormFieldValidatorMaxSize
  | FormFieldValidatorRegex;

export type FormFieldValidatorNumber =
  | FormFieldValidatorCommon<number>
  | FormFieldValidatorMin<number>
  | FormFieldValidatorMax<number>;

export type FormFieldValidatorDate =
  | FormFieldValidatorCommon<Date>
  | FormFieldValidatorMin<Date | string>
  | FormFieldValidatorMax<Date | string>;

export type FormFieldValidatorFile =
  | FormFieldValidatorCommon<File[]>
  | FormFieldValidatorMaxSize
  | FormFieldValidatorMax<number>;

type FormFieldValidator_<T extends FormFieldValidatorType> = {
  type: T;
} & {
  error_message?: T extends 'function' ? never : string | undefined;
};

export type FormFieldValidatorRequired = FormFieldValidator_<'required'>;

export type FormFieldValidatorMaxSize = FormFieldValidator_<'max_size'> & {
  parameter: number;
};

export type FormFieldValidatorRegex = FormFieldValidator_<'regex'> & {
  parameter: string | RegExp;
};

export type FormFieldValidatorMin<T> = FormFieldValidator_<'min'> & {
  parameter: T;
};

export type FormFieldValidatorMax<T> = FormFieldValidator_<'max'> & {
  parameter: T;
};

export type FormFieldValidatorFunction<T> = FormFieldValidator_<'function'> & {
  name?: string;
} & (
    | {
        async: true;
        parameter: (
          value: T,
          setValue: UseFormSetValue<FieldValues>
        ) => Promise<boolean | string>;
      }
    | {
        async?: false;
        parameter: (
          value: T,
          setValue: UseFormSetValue<FieldValues>
        ) => boolean | string;
      }
  );

export type ValidationRules = UseControllerProps['rules'];
