import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ReactForms } from './react-forms';

export default {
  component: ReactForms,
  title: 'ReactForms',
} as ComponentMeta<typeof ReactForms>;

const Template: ComponentStory<typeof ReactForms> = (args) => (
  <ReactForms {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
