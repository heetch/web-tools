import { useForm } from 'react-hook-form';
import { Button } from '@heetch/flamingo-react';
import { Form } from '../../types/forms';
import { FormFieldBooleanRenderer } from '../form-field-boolean-renderer/form-field-boolean-renderer';
import { FormFieldNumberRenderer } from '../form-field-number-renderer/form-field-number-renderer';
import { FormFieldFileRenderer } from '../form-field-file-renderer/form-field-file-renderer';
import { FormFieldStringRenderer } from '../form-field-string-renderer/form-field-string-renderer';
import { FormFieldDateRenderer } from '../form-field-date-renderer/form-field-date-renderer';
import { FormRow } from '../../types/layout';
import {
  FormLayout,
  FormLayoutCell,
  FormLayoutRow,
} from '../form-layout/form-layout';

export function FormRenderer({
  fields,
  values,
  onSubmit,
  options,
  layout,
}: Form) {
  const { control, handleSubmit, formState } = useForm({
    defaultValues: values,
    mode: 'onChange',
  });

  const formLayout: FormRow[] =
    layout || fields.map((field) => ({ cells: [{ field: field.id }] }));

  return (
    <FormLayout onSubmit={handleSubmit(onSubmit)}>
      {formLayout.map((row, rowIndex) => (
        <FormLayoutRow key={'row-' + rowIndex}>
          {row.cells.map((cell) => {
            const field = fields.find((f) => f.id === cell.field);
            if (!field) return null;

            let Renderer = null;
            switch (field.type) {
              case 'boolean':
                Renderer = (
                  <FormFieldBooleanRenderer
                    field={field}
                    options={options}
                    control={control}
                  />
                );
                break;
              case 'number':
                Renderer = (
                  <FormFieldNumberRenderer
                    field={field}
                    options={options}
                    control={control}
                  />
                );
                break;
              case 'file':
                Renderer = (
                  <FormFieldFileRenderer
                    field={field}
                    options={options}
                    control={control}
                  />
                );
                break;
              case 'string':
                Renderer = (
                  <FormFieldStringRenderer
                    field={field}
                    options={options}
                    control={control}
                  />
                );
                break;
              case 'date':
                Renderer = (
                  <FormFieldDateRenderer
                    field={field}
                    options={options}
                    control={control}
                  />
                );
                break;
            }

            return (
              <FormLayoutCell key={field.id} {...cell}>
                {Renderer}
              </FormLayoutCell>
            );
          })}
        </FormLayoutRow>
      ))}
      <FormLayoutRow>
        <FormLayoutCell field="submit-button">
          <Button
            type="submit"
            disabled={!formState.isValid}
            isLoading={formState.isSubmitting}
          >
            Submit
          </Button>
        </FormLayoutCell>
      </FormLayoutRow>
    </FormLayout>
  );
}

export default FormRenderer;
