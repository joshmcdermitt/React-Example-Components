import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import Dropdown, { DropdownItem, DropdownProps } from '~Common/V3/components/Dropdown';
import { palette } from '~Common/styles/colors';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { camelCase } from 'lodash';
import {
  ClosedGoalStatusFilters, OpenGoalStatusFilters, ViewPerspective,
} from '~Goals/const/types';
import { SelectChangeEvent, styled } from '@mui/material';
import { GOAL_FILTER_STYLES } from '~Goals/const/styles';
import { getGoalStatusName } from '~Common/utils/getStatusName/getGoalStatusName';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import GoalStatusText from '../Shared/GoalStatus/GoalStatusText';
import GoalStatusIndicatorDot from '../Shared/GoalStatus/GoalStatusIndicatorIcon';

const styles = {
  ...GOAL_FILTER_STYLES,

  dropdown: (hasValue: boolean) => css({
    width: '11rem',
    border: '1px solid transparent',
    padding: 0,

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
  dropdownItemBody: css({
    display: 'flex',
    alignItems: 'center',
    color: palette.neutrals.gray700,
    gap: '.75rem',
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

const View = ({
  onChange,
  items,
  value,
  viewPerspective,
  ...props
}: DropdownProps<(Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[]> & StatusFilterUniqueProps): JSX.Element => (
  <div>
    <p css={styles.filterLabel(!!value?.length)}>Status</p>
    <Dropdown
      multiple
      displayEmpty
      css={styles.dropdown(!!value?.length)}
      value={value}
      MenuProps={{
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
        <div css={styles.dropdownItemBody}>
          <JoshCheckbox
            data-test-id="statusFilterCheckbox"
            checked={value?.includes(item.value)}
          />
          <StyledGoalStatusContainer>
            <GoalStatusIndicatorDot
              status={item.value}
              size={12}
              viewPerspective={viewPerspective}
            />
            <StyledGoalStatusText
              status={item.value}
            />
          </StyledGoalStatusContainer>
        </div>
      )}
      onChange={onChange}
      items={items}
      renderValue={renderValue}
      {...props}
    />
  </div>
);

interface StatusFilterUniqueProps {
  viewPerspective: ViewPerspective,
}
/**
 * @deprecated Old UI StatusFilter, Use packages/josh-frontend/src/goals/components/TableFilters/StatusFilter.tsx instead
 */

const StatusFilter = ({
  viewPerspective,
}: Omit<DropdownProps<Goals.GoalStatus[]>, 'items' | 'renderValue'> & StatusFilterUniqueProps): JSX.Element => {
  const [value, setStatusValue] = useQueryParamState<(Goals.AdditionalGoalStatusFilters | Goals.GoalStatus)[]>('goals', 'status', [], true);
  const filters = viewPerspective === ViewPerspective.Open ? OpenGoalStatusFilters : ClosedGoalStatusFilters;
  const items = filters.map((statusValue) => ({
    value: statusValue,
    text: '',
    'data-test-id': `goalsFilter${camelCase(statusValue)}`,
  }));

  const onChange = (event: SelectChangeEvent<(Goals.AdditionalGoalStatusFilters | Goals.GoalStatus)[]>): void => {
    setStatusValue(event.target.value as (Goals.AdditionalGoalStatusFilters | Goals.GoalStatus)[]);
  };

  const hookProps = {
    value,
    items,
    onChange,
    renderValue,
    viewPerspective,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default StatusFilter;
