import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FormFieldBooleanRenderer } from './form-field-boolean-renderer';
import { FormFieldBoolean } from '../../types/fields';

export default {
  component: FormFieldBooleanRenderer,
  title: 'Fields/Boolean',
  argTypes: {
    control: { table: { disable: true } },
  },
  decorators: [
    (Story) => {
      const { control, getValues, handleSubmit, watch } = useForm({
        mode: 'onChange',
      });
      const onChange = action('form-values-change');

      const watchForm = watch();
      useEffect(() => {
        onChange(getValues());
      }, [watchForm, onChange]);

      const onSubmit = console.log;

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Story control={control} />
        </form>
      );
    },
  ],
} as ComponentMeta<typeof FormFieldBooleanRenderer>;

const Template: ComponentStory<typeof FormFieldBooleanRenderer> = (
  { field },
  { control }
) => (
  <>
    <FormFieldBooleanRenderer
      control={control}
      field={{
        ...field,
        id: 'as-checkbox',
        format: 'checkbox',
        label: 'As checkbox',
      }}
    />
    <br />
    <FormFieldBooleanRenderer
      control={control}
      field={{
        ...field,
        id: 'as-toggle',
        format: 'toggle',
        label: 'As toggle',
      }}
    />
  </>
);

const base: FormFieldBoolean = {
  id: 'boolean',
  label: 'Is it true?',
  type: 'boolean',
};

export const Default = Template.bind({});
Default.args = {
  field: base,
};

export const Helper = Template.bind({});
Helper.args = {
  field: { ...base, helper: 'With a helper' } as FormFieldBoolean,
};

export const Validation = Template.bind({});
Validation.args = {
  field: {
    ...base,
    validators: [
      {
        type: 'function',
        parameter: (checked) => checked || 'You have to accept',
      },
    ],
  } as FormFieldBoolean,
};
