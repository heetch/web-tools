import { Story, Meta } from '@storybook/react';
import { FormLayoutCell, FormLayoutRow } from './form-layout';
import styled from 'styled-components';
import { FormCell } from '../../types/layout';

type LayoutStoryProps = { cells: FormCell[] };

const CellContent = styled.div`
  background-color: lightpink;
  padding: 4px;
`;

export default {
  title: 'Layout',
} as Meta<LayoutStoryProps>;

const Template: Story<LayoutStoryProps> = (args) => (
  <FormLayoutRow>
    {args.cells.map((cell) => (
      <FormLayoutCell key={cell.field} {...cell}>
        <CellContent>{cell.field}</CellContent>
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
