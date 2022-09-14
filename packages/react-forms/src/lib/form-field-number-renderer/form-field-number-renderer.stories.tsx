import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
// import { expect } from '@storybook/jest';
// import { screen, userEvent, within } from '@storybook/testing-library';
import { FormFieldNumberRenderer } from './form-field-number-renderer';
import { FormFieldNumber } from '../../types/fields';
// import { sleep } from '../../utils';

export default {
  component: FormFieldNumberRenderer,
  title: 'Fields/Number',
  argTypes: {
    control: { table: { disable: true } },
  },
  // decorators: [
  //   (Story) => {
  //     const { control, getValues, handleSubmit, watch } = useForm({
  //       mode: 'onChange',
  //     });
  //     const onChange = action('form-values-change');
  //
  //     const watchForm = watch();
  //     useEffect(() => {
  //       onChange(getValues());
  //     }, [watchForm, onChange, getValues]);
  //
  //     const onSubmit = action('form-submit');
  //
  //     return (
  //       <form onSubmit={handleSubmit(onSubmit)}>
  //         <Story control={control} />
  //       </form>
  //     );
  //   },
  // ],
} as ComponentMeta<typeof FormFieldNumberRenderer>;

const Template: ComponentStory<typeof FormFieldNumberRenderer> = ({
  field,
  options,
}) =>
  // { control }
  {
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
        parameter: (value) => value == 42 || 'This is not the correct answer',
      },
    ],
  } as FormFieldNumber,
};

// export const _tests = Template.bind({});
// _tests.storyName = '[tests]';
// _tests.args = {
//   field: base,
// };
// _tests.play = async () => {
//   const cb = screen.getByLabelText('As checkbox', { selector: 'input' });
//   expect(cb).not.toBeChecked();
//   await userEvent.click(cb);
//   expect(cb).toBeChecked();
//
//   const tg = within(screen.getByText('As toggle').parentElement!).getByRole(
//     'button',
//     {}
//   );
//   expect(tg).toHaveTextContent('OFF');
//   await sleep(100);
//   await userEvent.click(tg);
//   expect(tg).toHaveTextContent('ON');
// };
