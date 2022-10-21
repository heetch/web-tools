import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { expect } from '@storybook/jest';
import { screen, userEvent } from '@storybook/testing-library';
import { FormFieldNumberRenderer } from './form-field-number-renderer';
import { FormFieldNumber } from '../../types/fields';

export default {
  component: FormFieldNumberRenderer,
  title: 'Components/Fields/Number',
  argTypes: {
    control: { table: { disable: true } },
  },
} as ComponentMeta<typeof FormFieldNumberRenderer>;

const Template: ComponentStory<typeof FormFieldNumberRenderer> = ({
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
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 300 }}>
      <FormFieldNumberRenderer
        control={control}
        field={field}
        options={options}
      />
    </form>
  );
};

const base: FormFieldNumber = {
  id: 'number',
  label: 'Amount',
  type: 'number',
  format: 'decimal',
};

export const Decimal = Template.bind({});
Decimal.args = {
  field: base,
};

export const Integer = Template.bind({});
Integer.args = {
  field: { ...base, format: 'integer', placeholder: 'Please enter an integer' },
};

export const LabelAsPlaceholder = Template.bind({});
LabelAsPlaceholder.storyName = 'Label as placeholder';
LabelAsPlaceholder.args = {
  field: base,
  options: { showLabelsAsPlaceholders: true },
};

export const Helper = Template.bind({});
Helper.args = {
  field: { ...base, helper: 'With a helper' } as FormFieldNumber,
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
        type: 'min',
        parameter: 10,
      },
      {
        type: 'function',
        name: 'the_answer',
        parameter: (value) => value === 42 || 'This is not the correct answer',
      },
    ],
  } as FormFieldNumber,
};

export const _tests = Template.bind({});
_tests.storyName = '[tests]';
_tests.args = {
  field: base,
};
_tests.play = async () => {
  const input: HTMLInputElement = screen.getByLabelText('Amount', {
    selector: 'input',
  });
  await userEvent.type(input, '1.5', { delay: 50 });
  expect(input).not.toHaveStyle({ color: '#e4566f' });
  await userEvent.clear(input);
  expect(input).not.toHaveStyle({ color: '#e4566f' });
};
