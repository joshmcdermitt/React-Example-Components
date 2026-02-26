import { css } from '@emotion/react';
import { GOAL_FILTER_STYLES } from '~Goals/const/styles';
import { Goals } from '@josh-hr/types';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';
import ResetFiltersButton from '~Common/components/Cards/FilterBarCard/ResetFiltersButton';
import TeamAutoCompleteFilter from './TeamAutoCompleteFilter';
import StatusFilter from './StatusFilter';
import StateFilter from './StateFilter';
import ScopeFilter from './ScopeFilter';
// import PriorityFilter from './PriorityFilter';
import CategoryFilter from './CategoryFilter';
import ParticipantsAutoCompleteFilters from './ParticipantsAutoCompleteFilters';

const styles = {
  ...GOAL_FILTER_STYLES,
  container: (isDesktop: boolean) => css({
    alignItems: 'center',
    display: 'flex',
    flexDirection: isDesktop ? 'row' : 'column',
    gap: '1rem',
    marginTop: '.625rem',
    flexWrap: 'nowrap',
    padding: '0 2.5rem 1rem 2.5rem',
    justifyContent: isDesktop ? 'flex-start' : undefined,
  }),
  filtersGroupContainer: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '1rem',
  }),
};

interface ViewProps {
  areFiltersActive: boolean,
  isDesktop: boolean,
  resetFilters: () => void,
  scopeFilter: Goals.GoalContextType[],
}

/**
 * Renders the filter view component for goals with various filtering options.
 *
 * @param {boolean} areFiltersActive - Indicates if any filters are currently active.
 * @param {Goals.GoalContextType[]} scopeFilter - The current scope filter applied, determining the context type.
 * @param {Function} resetFilters - Function to reset all filters to their default state.
 * @param {Function} setScopeFilter - Function to update the scope filter.
 * @returns {JSX.Element} The rendered filter view component.
 */
const View = ({
  areFiltersActive,
  isDesktop,
  scopeFilter,
  resetFilters,
}: ViewProps): JSX.Element => (
  <div
    css={styles.container(isDesktop)}
  >
    <div css={styles.filtersGroupContainer}>
      <StateFilter />
      <ScopeFilter />
      {scopeFilter.includes(Goals.GoalContextType.Team) && (
        <TeamAutoCompleteFilter />
      )}
      <ParticipantsAutoCompleteFilters />
      <StatusFilter />
      {/* <PriorityFilter /> */}
      <CategoryFilter />
    </div>
    {isDesktop && (
      <div>
        <ResetFiltersButton
          hasFilters={areFiltersActive}
          onClick={resetFilters}
        />
      </div>
    )}
  </div>
);

type TableFiltersProps = Pick<ViewProps, 'areFiltersActive'>

export const TableFilters = ({
  areFiltersActive,
}: TableFiltersProps): JSX.Element => {
  const isDesktop = useIsDesktopQuery();

  const {
    scopeFilter,
    resetFilters,
    setScopeFilter,
    stateFilter,
  } = useGoalsContext();

  const hookProps = {
    areFiltersActive,
    isDesktop,
    resetFilters,
    scopeFilter,
    setScopeFilter,
    stateFilter,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
