import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FormRenderer } from './form-renderer';
import { FormField } from '../../types/fields';
import { screen, userEvent } from '@storybook/testing-library';
import { sleep } from '../../utils';

const fields: FormField[] = [
  {
    id: 'name',
    type: 'string',
    label: 'Name',
    format: 'line',
    validators: [
      { type: 'required' },
      {
        type: 'max_size',
        parameter: 100,
      },
      {
        type: 'function',
        name: 'no-unknown',
        parameter: (value) => {
          if (value === 'John Doe') return 'No unknown people';
          return true;
        },
      },
    ],
  },
  {
    id: 'email',
    type: 'string',
    label: 'E-mail',
    placeholder: 'Please enter a valid e-mail',
    format: 'email',
    validators: [{ type: 'required' }],
  },
  {
    id: 'country',
    type: 'string',
    label: 'Country',
    format: 'select',
    options: [
      { value: 'fr', label: 'France' },
      { value: 'be', label: 'Belgium' },
      { value: 'ch', label: 'Switzerland' },
    ],
    validators: [{ type: 'required' }],
  },
  {
    id: 'birthdate',
    type: 'date',
    label: 'Date of birth',
    format: 'date',
    yearSelector: true,
    validators: [{ type: 'max', parameter: new Date() }],
  },
  {
    id: 'notifications',
    type: 'boolean',
    label: 'Enable notifications',
  },
  {
    id: 'notifications-delay',
    type: 'number',
    label: 'Notifications delay',
    helper: 'Delay in minutes between notifications',
    format: 'integer',
    validators: [{ type: 'min', parameter: 0 }],
  },
];

export default {
  component: FormRenderer,
  title: 'Components/Form',
  args: {
    fields,
    values: {},
    options: {
      showRequiredAsterisk: true,
    },
    onSubmit: action('submit'),
    onChange: action('change'),
  },
} as ComponentMeta<typeof FormRenderer>;

const Template: ComponentStory<typeof FormRenderer> = (args) => (
  <FormRenderer {...args} />
);

export const Basic = Template.bind({});
Basic.args = {};

export const LabelAsPlaceholder = Template.bind({});
LabelAsPlaceholder.storyName = 'Label as placeholder';
LabelAsPlaceholder.args = {
  options: {
    ...(LabelAsPlaceholder.args?.options, {}),
    showLabelsAsPlaceholders: true,
  },
};

export const Layout = Template.bind({});
Layout.args = {
  layout: [
    {
      cells: [{ field: 'name' }, { field: 'email' }],
    },
    {
      cells: [
        { field: 'country', widthConstraint: 3 },
        { field: 'birthdate', widthConstraint: 2 },
      ],
    },
    {
      cells: [
        { field: 'notifications', widthConstraint: '200px' },
        { field: 'notifications-delay' },
      ],
    },
  ],
};

export const InitialValues = Template.bind({});
InitialValues.args = {
  values: {
    name: 'Al Capone',
    notifications: true,
    'notifications-delay': 42,
    birthdate: new Date('1899-01-17'),
  },
};

export const CustomTexts = Template.bind({});
CustomTexts.args = {
  texts: {
    submit: 'Send data',
    errors: {
      required: 'Custom required error',
      max_size: {
        string: (x) => `Custom max size error (${x} letters)`,
      },
    },
  },
  values: {
    name: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    country: 'fr',
  },
};
CustomTexts.play = async () => {
  await userEvent.type(
    screen.getByLabelText('Name *', {
      selector: 'input',
    }),
    'x'
  );
  await userEvent.type(
    screen.getByLabelText('E-mail *', {
      selector: 'input',
    }),
    'foo'
  );
  await userEvent.selectOptions(
    screen.getByLabelText('Country *', {
      selector: 'select',
    }),
    ''
  );
};

export const Validation = Template.bind({});
Validation.args = {
  fields: fields.filter((f) =>
    ['name', 'email', 'notifications', 'notifications-delay'].includes(f.id)
  ),
  layout: [
    { cells: [{ field: 'name' }] },
    { cells: [{ field: 'email' }] },
    {
      cells: [
        { field: 'notifications', widthConstraint: '200px' },
        { field: 'notifications-delay' },
      ],
    },
  ],
  values: {
    name: 'John X',
    email: 'john.x@mail.com',
    notifications: true,
    'notifications-delay': 0,
  },
  validators: [
    {
      validator: (values) => {
        if (
          typeof values['name'] === 'string' &&
          values['name'].includes('X')
        ) {
          return {
            errors: [
              {
                field: 'name',
                error: 'Unknowns are forbidden',
              },
            ],
          };
        }

        return { errors: [] };
      },
    },
    {
      validator: (values) => {
        if (
          typeof values['email'] === 'string' &&
          values['email'].includes('x')
        ) {
          return {
            errors: [
              {
                field: 'email',
                error: 'No "x" in emails',
              },
            ],
          };
        }

        return { errors: [] };
      },
    },
    {
      async: true,
      validator: (values) =>
        new Promise((resolve) => {
          setTimeout(() => {
            if (
              values['notifications'] === true &&
              (values['notifications-delay'] as number) < 1
            ) {
              resolve({
                errors: [
                  {
                    field: 'notifications-delay',
                    error: 'Must be > 1 if notifications are enabled',
                  },
                ],
              });
            }
            resolve({
              errors: [],
            });
          }, 1000);
        }),
    },
  ],
};
Validation.play = async () => {
  await sleep(500);
  await userEvent.click(screen.getByText('Submit'));
};

export const Autofill = Template.bind({});
Autofill.args = {
  fields: [
    {
      id: 'name',
      type: 'string',
      label: 'Name',
      format: 'line',
      validators: [
        { type: 'required' },
        {
          type: 'max_size',
          parameter: 100,
        },
        {
          type: 'function',
          async: true,
          parameter: (value, setValue) => {
            if (!value) return true;

            const words = value.split(/\s/).filter((w) => !!w);
            if (words.length > 1) {
              const email = words.join('.') + '@mail.com';
              setValue('email', email);
            }

            return true;
          },
        },
      ],
    },
    {
      id: 'email',
      type: 'string',
      label: 'E-mail',
      placeholder: 'Please enter a valid e-mail',
      format: 'email',
      validators: [{ type: 'required' }],
    },
  ] as FormField[],
};
Autofill.play = async () => {
  await sleep(100);
  await userEvent.type(
    screen.getByLabelText('Name *', {
      selector: 'input',
    }),
    'John Doe',
    {
      delay: 100,
    }
  );
};
