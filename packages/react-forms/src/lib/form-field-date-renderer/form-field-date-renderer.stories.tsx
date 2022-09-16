import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { action } from '@storybook/addon-actions';
import { expect } from '@storybook/jest';
import { screen, userEvent } from '@storybook/testing-library';
import { useEffect } from 'react';
import { theme as flamingo } from '@heetch/flamingo-react';
import { FormFieldDateRenderer } from './form-field-date-renderer';
import { FormFieldDate } from '../../types/fields';
import { sleep } from '../../utils';

export default {
  component: FormFieldDateRenderer,
  title: 'Fields/Date',
  argTypes: {
    control: { table: { disable: true } },
  },
} as ComponentMeta<typeof FormFieldDateRenderer>;

const Template: ComponentStory<typeof FormFieldDateRenderer> = ({
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
      <FormFieldDateRenderer
        control={control}
        field={field}
        options={options}
      />
    </form>
  );
};

const base: FormFieldDate = {
  id: 'date',
  label: 'Date',
  type: 'date',
  format: 'date',
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

export const IconColor = Template.bind({});
IconColor.args = {
  field: base,
  options: { iconColor: flamingo.color_v3.brand.pink.shade1 },
};

export const DateTime = Template.bind({});
DateTime.storyName = 'Date & Time';
DateTime.args = {
  field: { ...base, format: 'date-time' },
};

export const Validation = Template.bind({});
const today = new Date();
today.setHours(0, 0, 0, 0);
Validation.args = {
  field: {
    ...base,
    helper: 'This is mandatory',
    validators: [
      {
        type: 'required',
        error_message: 'Mandatory!',
      },
      {
        type: 'min',
        parameter: today,
      },
    ],
  },
};

export const _tests = Template.bind({});
_tests.storyName = '[tests]';
_tests.args = {
  field: base,
};
_tests.play = async () => {
  const input: HTMLInputElement = screen.getByLabelText('Date', {
    selector: 'input',
  });
  expect(input).toHaveValue('');
  await userEvent.click(input);
  await sleep(100);
  await userEvent.click(screen.getByText('15'));
  expect(
    screen.getByLabelText('Date', {
      selector: 'input',
    })
  ).toHaveDisplayValue(/^15\//);
};
