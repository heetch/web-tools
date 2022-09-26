import { FieldValues, useForm } from 'react-hook-form';
import { Button } from '@heetch/flamingo-react';
import { DefaultTexts, Form, FormOptions } from '../../types/forms';
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
import { DEFAULT_TEXTS, injectDefaultTexts } from '../../utils';
import { useCallback, useEffect, useMemo } from 'react';

export function FormRenderer({
  fields,
  values,
  onSubmit,
  options,
  texts: textsOverrides,
  layout,
  validators,
}: Form) {
  const { control, handleSubmit, formState, setError, setValue } = useForm({
    defaultValues: values,
    mode: 'onChange',
  });

  const validateAndSubmit = useCallback(
    async (values: FieldValues) => {
      // Execute each validator first
      let isValid = true;

      for (const { validator, async } of validators || []) {
        const result = async ? await validator(values) : validator(values);

        if (result.errors.length > 0) {
          isValid = false;
          result.errors.forEach(({ error, field }) => {
            setError(field, { type: 'onSubmit', message: error });
          });
        }
      }

      if (!isValid) return;

      return onSubmit(values);
    },
    [validators, setError, setValue, onSubmit]
  );

  const formLayout: FormRow[] =
    layout || fields.map((field) => ({ cells: [{ field: field.id }] }));

  const texts: DefaultTexts = {
    submit: textsOverrides?.submit || DEFAULT_TEXTS.submit,
    errors: {
      required:
        textsOverrides?.errors?.required || DEFAULT_TEXTS.errors?.required,
      regex: textsOverrides?.errors?.regex || DEFAULT_TEXTS.errors?.regex,
      max_size: {
        string:
          textsOverrides?.errors?.max_size?.string ||
          DEFAULT_TEXTS.errors?.max_size?.string,
        file:
          textsOverrides?.errors?.max_size?.file ||
          DEFAULT_TEXTS.errors?.max_size?.file,
      },
      min: {
        number:
          textsOverrides?.errors?.min?.number ||
          DEFAULT_TEXTS.errors?.min?.number,
        date:
          textsOverrides?.errors?.min?.date || DEFAULT_TEXTS.errors?.min?.date,
      },
      max: {
        number:
          textsOverrides?.errors?.max?.number ||
          DEFAULT_TEXTS.errors?.max?.number,
        date:
          textsOverrides?.errors?.max?.date || DEFAULT_TEXTS.errors?.max?.date,
      },
      email: textsOverrides?.errors?.email || DEFAULT_TEXTS.errors?.email,
      number: textsOverrides?.errors?.number || DEFAULT_TEXTS.errors?.number,
      integer: textsOverrides?.errors?.integer || DEFAULT_TEXTS.errors?.integer,
      uuid: textsOverrides?.errors?.uuid || DEFAULT_TEXTS.errors?.uuid,
    },
  };

  return (
    <FormLayout onSubmit={handleSubmit(validateAndSubmit)}>
      {formLayout.map((row, rowIndex) => (
        <FormLayoutRow key={'row-' + rowIndex}>
          {row.cells.map((cell) => {
            let field = fields.find((f) => f.id === cell.field);
            if (!field) return null;

            field = injectDefaultTexts(texts, field);

            let Renderer = null;
            switch (field.type) {
              case 'boolean':
                Renderer = (
                  <FormFieldBooleanRenderer
                    field={field}
                    options={options}
                    texts={texts}
                    control={control}
                    setValue={setValue}
                  />
                );
                break;
              case 'number':
                Renderer = (
                  <FormFieldNumberRenderer
                    field={field}
                    options={options}
                    texts={texts}
                    control={control}
                    setValue={setValue}
                  />
                );
                break;
              case 'file':
                Renderer = (
                  <FormFieldFileRenderer
                    field={field}
                    options={options}
                    texts={texts}
                    control={control}
                    setValue={setValue}
                  />
                );
                break;
              case 'string':
                Renderer = (
                  <FormFieldStringRenderer
                    field={field}
                    options={options}
                    texts={texts}
                    control={control}
                    setValue={setValue}
                  />
                );
                break;
              case 'date':
                Renderer = (
                  <FormFieldDateRenderer
                    field={field}
                    options={options}
                    texts={texts}
                    control={control}
                    setValue={setValue}
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
            {texts?.submit}
          </Button>
        </FormLayoutCell>
      </FormLayoutRow>
    </FormLayout>
  );
}

export default FormRenderer;
