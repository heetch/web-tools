import {
    FormFieldValidatorBoolean,
    FormFieldValidatorDate,
    FormFieldValidatorFile,
    FormFieldValidatorNumber,
    FormFieldValidatorString
} from "./validators";

export type FormFieldType = 'string' | 'number' | 'boolean' | 'file';

export type FormField<K extends string = string> =
    | FormFieldBoolean<K>
    | FormFieldNumber<K>
    | FormFieldFile<K>
    | FormFieldString<K>
    ;


export type FormFieldOption = {
    value: string;
    label: string;
}

// Internals

type FormField_<T extends FormFieldType, K extends string> = {
    id: K;
    type: T;
    label: string;
    placeholder?: string;
    helper?: string;
}

export type FormFieldBoolean<K extends string = string> = FormField_<'boolean', K> & {
    placeholder?: never;
    format?: 'checkbox' | 'toggle';
    validators?: FormFieldValidatorBoolean[];
}

export type FormFieldNumber<K extends string = string> = FormField_<'number', K> & {
    format: 'integer' | 'decimal';
    validators?: FormFieldValidatorNumber[];
}

export type FormFieldFile<K extends string = string> = FormField_<'file', K> & {
    accepts: string;
    validators?: FormFieldValidatorFile[];
}

export type FormFieldString<K extends string = string> = FormField_<'string', K> & (
    | {
        format: 'line' | 'text' | 'uuid' | 'email';
        validators?: FormFieldValidatorString[];
    }
    | {
        format: 'date' | 'date-time';
        validators?: FormFieldValidatorDate[];
    }
    | {
        format: 'select';
        options: FormFieldOption[];
        validators?: FormFieldValidatorString[];
    }
);


