import { FormField } from './fields';
import { FormValidator } from './validators';
import { FormRow } from './layout';

export type Form<
  V extends Record<K, unknown> = Record<string, unknown>,
  K extends string = keyof V & string
> = {
  fields: FormField<K>[];
  values: Partial<V>;
  onSubmit: (values: V) => Promise<{ errors: string[] }>;
  validators?: FormValidator<V>[];
  layout?: FormRow<K>[];
  options?: FormOptions;
};

export type FormOptions = {
  showLabelsAsPlaceholders?: boolean;
};
