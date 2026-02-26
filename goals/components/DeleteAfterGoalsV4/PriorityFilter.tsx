import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import Dropdown, { DropdownItem, DropdownProps } from '~Common/V3/components/Dropdown';
import { palette } from '~Common/styles/colors';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { GoalPriorityLabels } from '~Goals/const/defaults';
import { SelectChangeEvent } from '@mui/material';
import { GOAL_FILTER_STYLES } from '~Goals/const/styles';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import { GoalPriorities } from '../Shared/goalPriorities';

const renderValue = (value: Goals.GoalPriority[]): string => {
  if (value?.length) {
    const priorityLabels = value.map((statusValue) => GoalPriorityLabels[statusValue]);
    return priorityLabels.join(', ');
  }

  return 'All Priorities';
};

const styles = {
  ...GOAL_FILTER_STYLES,
  dropdown: (hasValue: boolean) => css({
    border: '1px solid transparent',
    height: '2rem',
    padding: 0,
    // width: '11rem',
    width: '8.8125rem',

    '.MuiSelect-select': {
      fontSize: '0.75rem',
      paddingLeft: '0.75rem',
    },

    // TODO: Fix the placement of the dropdown arrow inside the common Dropdown component
    '.MuiSelect-icon': {
      right: '0.75rem',
    },
  }, hasValue && {
    borderColor: palette.brand.indigo,
  }),
  dropdownItemBoy: css({
    display: 'flex',
    alignItems: 'center',
    color: palette.neutrals.gray700,
    gap: '.75rem',
  }),
};

const View = ({
  onChange,
  items,
  value,
  ...props
}: DropdownProps<Goals.GoalPriority[]>): JSX.Element => (
  <div>
    <p css={styles.filterLabel(!!value?.length)}>Priority</p>
    <Dropdown
      multiple
      displayEmpty
      css={styles.dropdown(!!value?.length)}
      value={value}
      renderItem={(item: DropdownItem<Goals.GoalPriority[]>) => (
        <div css={styles.dropdownItemBoy}>
          <JoshCheckbox
            data-test-id="priorityFilterCheckbox"
            checked={value?.includes(item.value)}
          />
          {item.text}
        </div>
      )}
      onChange={onChange}
      items={items}
      renderValue={renderValue}
      {...props}
    />
  </div>
);

/**
 * @deprecated Old UI PriorityFilter, Use packages/josh-frontend/src/goals/components/TableFilters/StatusFilter.tsx instead
 */

const PriorityFilter = (): JSX.Element => {
  const [value, setPriorityValue] = useQueryParamState<Goals.GoalPriority[]>('goals', 'priority', [], true);

  // @ts-expect-error : The interop between queryParamState and internal MUI state change was causing some issues.
  const items: DropdownItem<Goals.GoalPriority[]>[] = GoalPriorities.map((priority) => ({
    ...priority,
    value: priority.value.toString(),
  }));

  const onChange = (event: SelectChangeEvent<Goals.GoalPriority[]>): void => {
    setPriorityValue(event.target.value as Goals.GoalPriority[]);
  };

  const hookProps = {
    value,
    items,
    onChange,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default PriorityFilter;
