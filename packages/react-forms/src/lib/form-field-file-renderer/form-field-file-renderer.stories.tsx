import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { action } from '@storybook/addon-actions';
import { useEffect } from 'react';
import { FormFieldFileRenderer } from './form-field-file-renderer';
import { FormFieldFile } from '../../types/fields';

export default {
  component: FormFieldFileRenderer,
  title: 'Components/Fields/File',
  argTypes: {
    control: { table: { disable: true } },
  },
} as ComponentMeta<typeof FormFieldFileRenderer>;

const Template: ComponentStory<typeof FormFieldFileRenderer> = ({
  field,
  options,
}) => {
  const { control, getValues, handleSubmit, watch } = useForm({
    mode: 'onChange',
  });
  const onChange = action('form-values-change');

  const watchForm = watch();
  useEffect(() => {
    onChange(getValues());
  }, [watchForm, onChange, getValues]);

  const onSubmit = action('form-submit');

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400 }}>
      <FormFieldFileRenderer
        control={control}
        field={field}
        options={options}
      />
    </form>
  );
};

const base: FormFieldFile = {
  id: 'file',
  label: 'File',
  type: 'file',
  accepts: '*',
};

export const Default = Template.bind({});
Default.args = {
  field: base,
};

export const Multiple = Template.bind({});
Multiple.args = {
  field: { ...base, multiple: true },
};

export const LabelAsPlaceholder = Template.bind({});
LabelAsPlaceholder.storyName = 'Label as placeholder';
LabelAsPlaceholder.args = {
  field: base,
  options: { showLabelsAsPlaceholders: true },
};

export const Helper = Template.bind({});
Helper.args = {
  field: {
    ...base,
    placeholder: 'Add images',
    helper: 'With a helper',
  },
};

export const Validation = Template.bind({});
Validation.args = {
  field: {
    ...base,
    multiple: true,
    placeholder: 'Add images',
    accepts: 'image/*',
    validators: [
      {
        type: 'required',
        error_message: 'Mandatory!',
      },
      {
        type: 'max_size',
        parameter: 0.5,
        error_message: 'Max. 500kB per file',
      },
      { type: 'max', parameter: 2, error_message: 'Max. 2 files' },
    ],
  },
};
