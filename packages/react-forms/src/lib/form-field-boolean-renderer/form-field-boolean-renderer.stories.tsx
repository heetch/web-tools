import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormFieldBooleanRenderer } from './form-field-boolean-renderer';

export default {
  component: FormFieldBooleanRenderer,
  title: 'Form Fields/Boolean',
} as ComponentMeta<typeof FormFieldBooleanRenderer>;

const Template: ComponentStory<typeof FormFieldBooleanRenderer> = (args) => (
  <FormFieldBooleanRenderer {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
