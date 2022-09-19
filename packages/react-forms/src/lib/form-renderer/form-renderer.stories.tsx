import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FormRenderer } from './form-renderer';
import { FormField } from '../../types/fields';

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
        error_message: 'Max. 100 characters',
      },
      {
        type: 'function',
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
  title: 'Form',
  args: {
    fields,
    values: {},
    options: {
      showRequiredAsterisk: true,
    },
    onSubmit: action('submit'),
  },
} as ComponentMeta<typeof FormRenderer>;

const Template: ComponentStory<typeof FormRenderer> = (args) => (
  <FormRenderer {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};

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
