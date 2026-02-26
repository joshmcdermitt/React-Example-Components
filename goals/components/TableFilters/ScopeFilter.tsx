import { Goals } from '@josh-hr/types';
import { SelectChangeEvent } from '@mui/material';
import Dropdown, { DropdownItem } from '~Common/V4/components/Dropdown';
import { DROPDOWNSTYLES, GOAL_FILTER_STYLES } from '~Goals/const/styles';
import { css } from '@emotion/react';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';

const styles = {
  ...GOAL_FILTER_STYLES,
  ...DROPDOWNSTYLES,
  scopeFiltersContainer: (isNotDesktop: boolean) => css({
    flexDirection: 'column',
    width: '8.125rem',
  }, isNotDesktop && {
    width: '100%',
  }),
};

const ScopeFilter = (): JSX.Element => {
  const isDesktop = useIsDesktopQuery();
  const {
    scopeFilter, setScopeFilter, isLoading, isFiltersNotDefault, setShouldConfirmReset,
  } = useGoalsContext();

  const items = [
    { value: Goals.GoalContextType.Personal, text: Goals.GoalContextType.Personal },
    { value: Goals.GoalContextType.Team, text: Goals.GoalContextType.Team },
    { value: Goals.GoalContextType.Organization, text: Goals.GoalContextType.Organization },
  ];

  const renderValue = (value: Goals.GoalContextType[]): string => {
    if (value?.length) return value.join(', ');

    return 'All Scopes';
  };

  const onScopeFilterChange = (event: SelectChangeEvent<Goals.GoalContextType[]>): void => {
    setScopeFilter(event.target.value as Goals.GoalContextType[]);
    if (isFiltersNotDefault && event.target.value.length > 0) setShouldConfirmReset(true);
  };

  return (
    <div css={styles.scopeFiltersContainer(!isDesktop)}>
      <p css={styles.filterLabel()}>Scope</p>
      <Dropdown
        data-test-id="goalsTableScopeFilter"
        dataTestId="scope"
        multiple
        displayEmpty
        css={[styles.dropdown(!!scopeFilter?.length, !isDesktop, true)]}
        value={scopeFilter}
        renderItem={(item: DropdownItem<Goals.GoalContextType[]>) => (
          <div css={styles.dropdownItemBody(!isDesktop)}>
            <JoshCheckbox
              data-test-id="scopeFilterCheckbox"
              checked={scopeFilter?.includes(item.value)}
            />
            {item.text}
          </div>
        )}
        onChange={onScopeFilterChange}
        items={items}
        renderValue={renderValue}
        disabled={isLoading}
      />
    </div>
  );
};

export default ScopeFilter;
