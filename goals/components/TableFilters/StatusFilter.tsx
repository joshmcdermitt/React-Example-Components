import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import Dropdown, { DropdownItem, DropdownProps } from '~Common/V4/components/Dropdown';
import { palette } from '~Common/styles/colors';
import { camelCase } from 'lodash';
import {
  ClosedGoalStatusFilters, OpenGoalStatusFilters, ViewPerspective,
} from '~Goals/const/types';
import { SelectChangeEvent, styled } from '@mui/material';
import { DROPDOWNSTYLES, GOAL_FILTER_STYLES } from '~Goals/const/styles';
import { getGoalStatusName } from '~Common/utils/getStatusName/getGoalStatusName';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { useMemo } from 'react';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';
import GoalStatusText from '../Shared/GoalStatus/GoalStatusText';
import GoalStatusIndicatorDot from '../Shared/GoalStatus/GoalStatusIndicatorIcon';

const styles = {
  ...GOAL_FILTER_STYLES,
  ...DROPDOWNSTYLES,
  statusFiltersContainer: (isNotDesktop: boolean) => css({
    flexDirection: 'column',
    width: '8.75rem',
  }, isNotDesktop && {
    width: '100%',
  }),
};

const StyledGoalStatusContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.medium,
}));

const StyledGoalStatusText = styled(GoalStatusText)(({ theme }) => ({
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
}));

const renderValue = (value: (Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[]): string => {
  if (value?.length) {
    const statusLabels = value.map((statusValue) => getGoalStatusName(statusValue));
    return statusLabels.join(', ');
  }

  return 'All Statuses';
};

interface ViewProps extends DropdownProps<(Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[]> {
  stateFilter: ViewPerspective;
  statusFilter: (Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[];
  onStatusFilterChange: (event: SelectChangeEvent<(Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[]>) => void;
  disabled: boolean,
  isDesktop: boolean,
}

const View = ({
  items,
  stateFilter,
  statusFilter,
  onStatusFilterChange,
  disabled,
  isDesktop,
  size,
  ...props
}: ViewProps): JSX.Element => (
  <div css={styles.statusFiltersContainer(!isDesktop)}>
    <p css={styles.filterLabel()}>Status</p>
    <Dropdown
      data-test-id="goalsTableStatusFilter"
      dataTestId="status"
      multiple
      displayEmpty
      css={[styles.dropdown(!!statusFilter?.length, !isDesktop, true)]}
      value={statusFilter}
      size={size}
      disabled={disabled}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        MenuListProps: {
          sx: {
            paddingBottom: '0',
            '& li:last-child': {
              borderTop: `1px solid ${palette.neutrals.gray300}`,
            },
          },
        },
      }}
      renderItem={(item: DropdownItem<(Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[]>) => (
        <div css={styles.dropdownItemBody(!isDesktop)}>
          <JoshCheckbox
            data-test-id="statusFilterCheckbox"
            checked={statusFilter?.includes(item.value)}
          />
          <StyledGoalStatusContainer>
            <GoalStatusIndicatorDot
              status={item.value}
              size={12}
              viewPerspective={stateFilter}
            />
            <StyledGoalStatusText
              status={item.value}
            />
          </StyledGoalStatusContainer>
        </div>
      )}
      onChange={onStatusFilterChange}
      items={items}
      renderValue={renderValue}
      {...props}
    />
  </div>
);

const StatusFilter = (): JSX.Element => {
  const isDesktop = useIsDesktopQuery();
  const {
    stateFilter, setStatusFilter, statusFilter, isLoading, isFiltersNotDefault, setShouldConfirmReset,
  } = useGoalsContext();

  const items = useMemo(() => {
    const filters = stateFilter === ViewPerspective.Open ? OpenGoalStatusFilters : ClosedGoalStatusFilters;

    return (
      filters.map((statusValue) => ({
        value: statusValue,
        text: '',
        'data-test-id': `goalsFilter${camelCase(statusValue)}`,
      })));
  }, [stateFilter]);

  const onStatusFilterChange = (event: SelectChangeEvent<(Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[]>): void => {
    setStatusFilter(event.target.value as Goals.GoalStatus[] | Goals.AdditionalGoalStatusFilters[]);
    if (isFiltersNotDefault && event.target.value.length > 0) setShouldConfirmReset(true);
  };

  const hookProps = {
    items,
    onStatusFilterChange,
    renderValue,
    stateFilter,
    statusFilter,
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
export default StatusFilter;
