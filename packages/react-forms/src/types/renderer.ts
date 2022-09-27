import { FormField } from './fields';
import { Control, FieldValues, UseFormSetValue } from 'react-hook-form';
import { DefaultTexts, FormOptions } from '@heetch/react-forms';

export type FormFieldRendererProps<T extends FormField> = {
  field: T;
  control: Control;
  setValue?: UseFormSetValue<FieldValues>;
  options?: FormOptions;
  texts?: DefaultTexts;
};
