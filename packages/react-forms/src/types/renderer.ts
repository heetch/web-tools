import { FormField } from './fields';
import { Control } from 'react-hook-form';
import { DefaultTexts, FormOptions } from '@heetch/react-forms';

export type FormFieldRendererProps<T extends FormField> = {
  field: T;
  control: Control;
  options?: FormOptions;
  texts?: DefaultTexts;
};
