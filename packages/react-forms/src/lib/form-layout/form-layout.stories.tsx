import { Meta, Story } from '@storybook/react';
import { FormLayoutCell, FormLayoutRow } from './form-layout';
import { FormCell } from '../../types/layout';

type LayoutStoryProps = { cells: FormCell[] };

export default {
  title: 'Components/Layout',
} as Meta<LayoutStoryProps>;

const Template: Story<LayoutStoryProps> = (args) => (
  <FormLayoutRow>
    {args.cells.map((cell) => (
      <FormLayoutCell key={cell.field} {...cell}>
        <div
          style={{
            backgroundColor: 'lightpink',
            padding: '4px',
          }}
        >
          {cell.field}
        </div>
      </FormLayoutCell>
    ))}
  </FormLayoutRow>
);

export const Default = Template.bind({});
Default.args = {
  cells: [{ field: 'age' }, { field: 'phone' }, { field: 'name' }],
};

export const WidthConstraints = Template.bind({});
WidthConstraints.args = {
  cells: [
    { field: 'age', widthConstraint: '60px' },
    { field: 'phone' },
    { field: 'name', widthConstraint: 2 },
  ],
};
