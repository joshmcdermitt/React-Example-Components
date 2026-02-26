import { GoalPriorities } from '~Goals/const/defaults';
import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import Dropdown, { DropdownProps } from './Shared/Dropdown/Dropdown';

const styles = {
  dropdown: css({
    minWidth: '10rem',
    width: '10rem',
    '.MuiSelect-listbox': {
      height: 'auto',
      maxHeight: 'unset',
      minWidth: '10rem',
      width: '10rem',
    },
    '.MuiSelect-popper': {
      width: '10rem',
    },
  }),
};

type PrioritySelectorProps = Omit<DropdownProps<Goals.GoalPriority>, 'name' | 'label' | 'dataTestId' | 'options'>

const PrioritySelector = ({ ...props }: PrioritySelectorProps): JSX.Element => (
  <Dropdown
    css={styles.dropdown}
    name="priority"
    label="Priority"
    dataTestId="goalPrioritySelect"
    placeholder="Select a priority"
    options={GoalPriorities}
    {...props}
  />
);

export default PrioritySelector;
