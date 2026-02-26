import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import Dropdown, { DropdownItem, DropdownProps } from '~Common/V4/components/Dropdown';
import { GoalPriorityLabels } from '~Goals/const/defaults';
import { SelectChangeEvent } from '@mui/material';
import { DROPDOWNSTYLES, GOAL_FILTER_STYLES } from '~Goals/const/styles';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';
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
  ...DROPDOWNSTYLES,
  priorityFiltersContainer: (isNotDesktop: boolean) => css({
    flexDirection: 'column',
    width: '9rem',
  }, isNotDesktop && {
    width: '100%',
  }),
};

interface ViewProps extends DropdownProps<Goals.GoalPriority[]> {
  isDesktop: boolean,
}

const View = ({
  onChange,
  items,
  value,
  disabled,
  isDesktop,
  ...props
}: ViewProps): JSX.Element => (
  <div css={styles.priorityFiltersContainer(!isDesktop)}>
    <p css={styles.filterLabel()}>Priority</p>
    <Dropdown
      data-test-id="goalsTablePriorityFilter"
      dataTestId="priority"
      multiple
      displayEmpty
      css={[styles.dropdown(!!value?.length, !isDesktop, true)]}
      value={value}
      disabled={disabled}
      renderItem={(item: DropdownItem<Goals.GoalPriority[]>) => (
        <div css={styles.dropdownItemBody(!isDesktop)}>
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

const PriorityFilter = (): JSX.Element => {
  const isDesktop = useIsDesktopQuery();
  const {
    priorityFilter, setPriorityFilter, isLoading, isFiltersNotDefault, setShouldConfirmReset,
  } = useGoalsContext();

  // @ts-expect-error : The interop between queryParamState and internal MUI state change was causing some issues.
  const items: DropdownItem<Goals.GoalPriority[]>[] = GoalPriorities.map((priority) => ({
    ...priority,
    value: priority.value.toString(),
  }));

  const onChange = (event: SelectChangeEvent<Goals.GoalPriority[]>): void => {
    setPriorityFilter(event.target.value as Goals.GoalPriority[]);
    if (isFiltersNotDefault && event.target.value.length > 0) setShouldConfirmReset(true);
  };

  const hookProps = {
    value: priorityFilter,
    items,
    onChange,
    disabled: isLoading,
    isDesktop,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default PriorityFilter;
