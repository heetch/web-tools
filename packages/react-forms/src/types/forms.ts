import { FormField } from './fields';
import { FormValidator } from './validators';
import { FormRow } from './layout';
import { DeepPartial } from 'react-hook-form/dist/types/utils';

export type Form<
  V extends Record<K, unknown> = Record<string, unknown>,
  K extends string = keyof V & string
> = {
  fields: FormField<K>[];
  values: DeepPartial<V>;
  onSubmit: (values: V) => Promise<any>;
  validators?: FormValidator<V>[];
  layout?: FormRow<K>[];
  options?: FormOptions;
  texts?: DefaultTexts;
};

export type FormOptions = {
  showLabelsAsPlaceholders?: boolean;
  iconColor?: string;
  showRequiredAsterisk?: boolean;
};

export type DefaultTexts = {
  submit?: string;
  errors?: {
    required?: string;
    regex?: string;
    max_size?: {
      string?: (size: number) => string;
      file?: (size: number) => string;
    };
    min?: {
      number?: (min: number) => string;
      date?: (min: Date) => string;
    };
    max?: {
      number?: (min: number) => string;
      date?: (min: Date) => string;
    };
    integer?: string;
    number?: string;
    uuid?: string;
    email?: string;
  };
};
