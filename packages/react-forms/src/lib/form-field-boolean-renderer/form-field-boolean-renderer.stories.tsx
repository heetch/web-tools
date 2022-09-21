import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { expect } from '@storybook/jest';
import { screen, userEvent, within } from '@storybook/testing-library';
import { FormFieldBooleanRenderer } from './form-field-boolean-renderer';
import { FormFieldBoolean } from '../../types/fields';
import { sleep } from '../../utils';

export default {
  component: FormFieldBooleanRenderer,
  title: 'Components/Fields/Boolean',
  argTypes: {
    control: { table: { disable: true } },
  },
} as ComponentMeta<typeof FormFieldBooleanRenderer>;

const Template: ComponentStory<typeof FormFieldBooleanRenderer> = ({
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
      <FormFieldBooleanRenderer
        control={control}
        field={{
          ...field,
          id: 'as-checkbox',
          format: 'checkbox',
          label: 'As checkbox',
        }}
        options={options}
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
        options={options}
      />
    </form>
  );
};

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

export const _tests = Template.bind({});
_tests.storyName = '[tests]';
_tests.args = {
  field: base,
};
_tests.play = async () => {
  const cb = screen.getByLabelText('As checkbox', { selector: 'input' });
  expect(cb).not.toBeChecked();
  await userEvent.click(cb);
  expect(cb).toBeChecked();

  const tg = within(screen.getByText('As toggle').parentElement!).getByRole(
    'button',
    {}
  );
  expect(tg).toHaveTextContent('OFF');
  await sleep(100);
  await userEvent.click(tg);
  expect(tg).toHaveTextContent('ON');
};
