import { FormField } from '@/types/fields';
import { Control } from 'react-hook-form';

export type FormFieldRendererProps<T extends FormField> = {
  field: T;
  control: Control;
}
