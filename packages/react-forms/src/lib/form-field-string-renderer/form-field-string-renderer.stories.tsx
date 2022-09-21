import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { action } from '@storybook/addon-actions';
import { expect } from '@storybook/jest';
import { screen, userEvent } from '@storybook/testing-library';
import { useEffect } from 'react';
import { FormFieldStringRenderer } from './form-field-string-renderer';
import { FormFieldString } from '../../types/fields';
import { sleep } from '../../utils';

export default {
  component: FormFieldStringRenderer,
  title: 'Components/Fields/String',
  argTypes: {
    control: { table: { disable: true } },
  },
} as ComponentMeta<typeof FormFieldStringRenderer>;

const Template: ComponentStory<typeof FormFieldStringRenderer> = ({
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
      <FormFieldStringRenderer
        control={control}
        field={field}
        options={options}
      />
    </form>
  );
};

const base: FormFieldString = {
  id: 'string',
  label: 'Name',
  type: 'string',
  format: 'line',
};

export const Default = Template.bind({});
Default.args = {
  field: base,
};

export const LabelAsPlaceholder = Template.bind({});
LabelAsPlaceholder.storyName = 'Label as placeholder';
LabelAsPlaceholder.args = {
  field: base,
  options: { showLabelsAsPlaceholders: true },
};

export const Helper = Template.bind({});
Helper.args = {
  field: { ...base, helper: 'With a helper' },
};

export const Uuid = Template.bind({});
Uuid.args = {
  field: {
    ...base,
    format: 'uuid',
    label: 'User ID',
    placeholder: 'Enter a valid uuid',
  },
};

export const Email = Template.bind({});
Email.args = {
  field: {
    ...base,
    format: 'email',
    label: 'E-mail',
    placeholder: 'Enter a valid e-mail',
  },
};

export const Select = Template.bind({});
Select.args = {
  field: {
    ...base,
    format: 'select',
    label: 'Country',
    placeholder: 'Choose your country',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'be', label: 'Belgium' },
      { value: 'ch', label: 'Switzerland' },
    ],
  },
};

export const Text = Template.bind({});
Text.args = {
  field: {
    ...base,
    format: 'text',
    label: 'Description',
    placeholder: 'Tell us what happened...',
  },
};

export const Validation = Template.bind({});
Validation.args = {
  field: {
    ...base,
    validators: [
      {
        type: 'required',
        error_message: 'Mandatory!',
      },
      {
        type: 'max_size',
        parameter: 10,
        error_message: 'Max. 10 characters',
      },
      {
        type: 'regex',
        parameter: /^\S*$/,
        error_message: 'No spaces',
      },
    ],
  },
};

export const _tests = Template.bind({});
_tests.storyName = '[tests]';
_tests.args = {
  field: {
    ...base,
    validators: [
      { type: 'regex', parameter: /(John Doe)/, error_message: 'Bad name' },
    ],
  },
};
_tests.play = async () => {
  const input: HTMLInputElement = screen.getByLabelText('Name', {
    selector: 'input',
  });
  expect(input).toHaveValue('');
  await sleep(100);
  await userEvent.type(input, 'John ', { delay: 50 });
  expect(screen.queryByText('Bad name')).toBeVisible();
  await sleep(1000);
  await userEvent.type(input, 'Doe', { delay: 50 });
  expect(input).toHaveValue('John Doe');
  await sleep(100);
  expect(screen.queryByText('Bad name')).not.toBeInTheDocument();
};
