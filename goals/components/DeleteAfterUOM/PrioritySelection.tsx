import { css, SerializedStyles } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { Select } from '~Common/V3/components/uncontrolled';
import MenuItem from '@mui/material/MenuItem';
import { palette } from '~Common/styles/colors';
import { GoalPriorities } from '../Shared/goalPriorities';

const styles = {
  priority: css({
    color: palette.neutrals.gray700,
    fontWeight: 400,
  }),
};

interface PrioritySelectionProps {
  defaultValue: Goals.GoalPriority | undefined,
  containerStyles?: SerializedStyles,
}

const PrioritySelection = ({ defaultValue, containerStyles, ...props }: PrioritySelectionProps): JSX.Element => (
  <Select
    css={styles.priority}
    id="priority"
    name="priority"
    defaultValue={defaultValue}
    label="Priority"
    required
    containerStyles={containerStyles}
    {...props}
  >
    {GoalPriorities.map((type) => (
      <MenuItem
        key={type.value}
        value={type.value}
      >
        {type.text}
      </MenuItem>
    ))}
  </Select>
);

export default PrioritySelection;
