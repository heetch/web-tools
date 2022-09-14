// Forms validators
import { UseControllerProps } from 'react-hook-form';

export type FormValidatorError<K extends string> = {
    field: K;
    error: string;
}

export type FormValidator<V extends Record<K, unknown>, K extends string = keyof V & string> = {
    trigger?: 'submit' | 'change'; // Default: submit
} & (
    | { async: true, validator: (values: V) => Promise<{ errors: FormValidatorError<K>[] }> }
    | { async?: false, validator: (values: V) => { errors: FormValidatorError<K>[] } }
    )


// Fields validators
export type FormFieldValidatorType = 'required' | 'max_size' | 'regex' | 'min' | 'max' | 'function';

type FormFieldValidatorCommon<T> =
    | FormFieldValidatorRequired
    | FormFieldValidatorFunction<T>
    ;

export type FormFieldValidatorBoolean = FormFieldValidatorCommon<boolean>

export type FormFieldValidatorString =
    | FormFieldValidatorCommon<string>
    | FormFieldValidatorMaxSize
    | FormFieldValidatorRegex
    ;

export type FormFieldValidatorNumber =
    | FormFieldValidatorCommon<number>
    | FormFieldValidatorMin<number>
    | FormFieldValidatorMax<number>
    ;

export type FormFieldValidatorDate =
    | FormFieldValidatorCommon<string>
    | FormFieldValidatorMin<string>
    | FormFieldValidatorMax<string>
    ;

export type FormFieldValidatorFile =
    | FormFieldValidatorCommon<File>
    | FormFieldValidatorMaxSize
    ;

type FormFieldValidator_<T extends FormFieldValidatorType> = {
    type: T;
    error_message?: string;
}

type FormFieldValidatorRequired = FormFieldValidator_<'required'>;

type FormFieldValidatorMaxSize = FormFieldValidator_<'max_size'> & { parameter: number };

type FormFieldValidatorRegex = FormFieldValidator_<'regex'> & { parameter: string | RegExp };

type FormFieldValidatorMin<T> = FormFieldValidator_<'min'> & { parameter: T };

type FormFieldValidatorMax<T> = FormFieldValidator_<'max'> & { parameter: T };

type FormFieldValidatorFunction<T> = FormFieldValidator_<'function'> & (
    | { async: true, parameter: (value: T) => Promise<boolean | string> }
    | { async?: false, parameter: (value: T) => boolean | string }
    );


export type ValidationRules = UseControllerProps['rules'];
