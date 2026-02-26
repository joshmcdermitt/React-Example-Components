import { css } from '@emotion/react';
import { Goals as GoalsTypes } from '@josh-hr/types';
import { useGoalSearchField } from '~Goals/hooks/useGoalSearchField';
import { GridSortModel } from '@mui/x-data-grid-pro';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import emptyActionItems from '~ActionItems/assets/images/emptyActionItems.png';
import emptySearch from '~Assets/images/empty-views/emptySearch.png';
import EmptyStateWithImage from '~Common/components/EmptyStates/EmptyStateWithImage';
import { UsePaginationReturn, usePagination } from '~Common/hooks/usePagination';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import JoshCard from '~Common/V3/components/JoshCard';
import LinkButton from '~Common/V3/components/LinkButton';
import Pagination from '~Common/V3/components/Pagination';
import TabHeader from '~Goals/components/DeleteAfterGoalsV4/TabHeader';
import { TableFilters as TableFiltersOld } from '~Goals/components/DeleteAfterGoalsV4/TableFilters';
import GoalsTable, { goalSortColumnField } from '~Goals/components/DeleteAfterGoalsV4/GoalsTable';
import { GOALS_PAGE_SIZE } from '~Goals/const/defaults';
import { ViewPerspective } from '~Goals/const/types';
import { useGetGoals } from '~Goals/hooks/useGetGoalsDeprecated';
import useGetOpenGoalTabs from '~Goals/hooks/utils/tabs/useGetOpenGoalTabs';
import { useEnableCascadingGoals } from '~Goals/hooks/utils/useEnableCascadingGoals';
import useGetGoalRoutes, { GetGoalRoutesReturn } from '~Goals/hooks/utils/useGetGoalRoutes';
import { useGoalsIndexSearch } from '~Goals/stores/useGoalsIndexSearch';
import { TeamsListScope } from '~People/components/Teams/const/types';
import { useGetTeams } from '~People/components/Teams/hooks/useGetTeams';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import TableLoader from '../Shared/Tables/TableLoader';

const styles = {
  joshCard: css({
    marginBottom: '1.5rem',
  }),
  emptyStateContainer: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1.5rem',
  }),
  emptyStateImage: css({
    height: '10rem',
  }),
  emptyMessageWrapper: css({
    display: 'flex',
    gap: '.2rem',
    flexWrap: 'wrap',
  }),
  createButton: css({
    margin: '0 .25rem',
  }),
  searchFiltersContainer: css({
    gap: '1rem',
    borderRadius: '.75rem .75rem 0 0',
  }),
  pagination: css({
    padding: '.75rem 1.5rem 1rem 1.5rem',
    gap: '12px',
  }),
};

export const dataGridToGoalsSortOrder: Record<'asc' | 'desc', GoalsTypes.GetGoalsSortOrder> = {
  asc: GoalsTypes.GetGoalsSortOrder.Ascending,
  desc: GoalsTypes.GetGoalsSortOrder.Descending,
};

interface ViewProps extends UsePaginationReturn {
  viewPerspective: ViewPerspective,
  activeTab: GoalsTypes.GoalContextType,
  setActiveTab: (tab: GoalsTypes.GoalContextType) => void,
  showEmptyStateCreateGoal: boolean,
  areFiltersActive: boolean,
  clearAllFilters: () => void,
  isLoading: boolean,
  isSearchedOrFiltered: boolean,
  goals: GoalsTypes.Goal[] | undefined,
  isCompleted: boolean,
  onSortModelChange: (sortModel: GridSortModel) => void,
  sortByField: GoalsTypes.GetGoalsSortBy,
  sortByOrder: GoalsTypes.GetGoalsSortOrder,
  isFetching: boolean,
  page: number,
  featureNamesText: FeatureNamesText,
  goalRoutes: GetGoalRoutesReturn['goalRoutes'],
}

const View = ({
  viewPerspective,
  activeTab,
  setActiveTab,
  areFiltersActive,
  clearAllFilters,
  showEmptyStateCreateGoal,
  isLoading,
  isSearchedOrFiltered,
  goals,
  isCompleted,
  onSortModelChange,
  sortByField,
  sortByOrder,
  isFetching,
  numberOfPages,
  page,
  onPageChange,
  onPreviousClick,
  onNextClick,
  featureNamesText,
  goalRoutes,
}: ViewProps): JSX.Element => (
  <JoshCard
    css={styles.joshCard}
  >
    <TabHeader
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      viewPerspective={viewPerspective}
    />
    <TableFiltersOld
      activeTab={activeTab}
      viewPerspective={viewPerspective}
      areFiltersActive={areFiltersActive}
      clearAllFilters={clearAllFilters}
    />
    {isLoading && (
      <div css={styles.emptyStateContainer}>
        <TableLoader
          numberOfRows={10}
          activeTab={activeTab}
        />
      </div>
    )}
    {!isLoading && (
      <>
        <div css={styles.emptyStateContainer}>
          {isSearchedOrFiltered && goals && goals.length === 0 && (
            <EmptyStateWithImage
              renderImage={() => (
                <img
                  css={styles.emptyStateImage}
                  src={emptySearch}
                  alt="No Search Results"
                  data-test-id="goalsNoSearchResults"
                />
              )}
              text={`No ${featureNamesText.goals.plural.toLowerCase()} found.`}
            />
          )}
          {!isSearchedOrFiltered && goals && goals.length === 0 && (
            <EmptyStateWithImage
              renderImage={() => (
                <img
                  css={styles.emptyStateImage}
                  src={emptyActionItems}
                  alt={`Empty ${featureNamesText.goals.plural}`}
                />
              )}
              renderText={() => (
                <>
                  {isCompleted && (
                    <span>
                      {`You have no completed ${activeTab.toLocaleLowerCase()} ${featureNamesText.goals.plural.toLowerCase()}.`}
                    </span>
                  )}
                  {!isCompleted && (
                    <div css={styles.emptyMessageWrapper}>
                      {`You have no open ${activeTab.toLocaleLowerCase()} ${featureNamesText.goals.plural.toLowerCase()}.`}
                      {showEmptyStateCreateGoal && (
                        <LinkButton
                          to={goalRoutes.Create}
                          variant="text"
                          data-test-id="actionItemsEmptyStateCreateActionItem"
                          renderContents={() => <>Click here to create one.</>}
                          css={styles.createButton}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            />
          )}
        </div>
        {!isLoading && goals && goals.length > 0 && (
          <>
            <GoalsTable
              data={goals}
              onSortModelChange={onSortModelChange}
              sortByField={sortByField}
              sortByOrder={sortByOrder}
              isFetching={isFetching}
            />
            {numberOfPages > 1 && (
              <div css={styles.pagination}>
                <Pagination
                  page={page}
                  onPageChange={onPageChange}
                  numberOfPages={numberOfPages}
                  onPreviousClick={onPreviousClick}
                  onNextClick={onNextClick}
                />
              </div>
            )}
          </>
        )}

      </>
    )}
  </JoshCard>
);

interface GoalsProps {
  viewPerspective: ViewPerspective,
}

const Goals = ({
  viewPerspective,
}: GoalsProps): JSX.Element => {
  const { openTabs } = useGetOpenGoalTabs();
  const { goalRoutes } = useGetGoalRoutes();

  const [activeTab, setActiveTab] = useQueryParamState<GoalsTypes.GoalContextType>(
    'goals',
    'tab',
    openTabs[0].value as GoalsTypes.GoalContextType,
  );

  const debouncedSearchText = useGoalsIndexSearch((state) => state.debouncedSearchText);
  const orgUserId = getOrganizationUserId();
  const { featureNamesText } = useGetFeatureNamesText();

  const [statusFilter, setStatusFilter] = useQueryParamState<GoalsTypes.GoalStatus[]>('goals', 'status', [], true);
  const [priorityFilter, setPriorityFilter] = useQueryParamState<GoalsTypes.GoalPriority[]>('goals', 'priority', [], true);
  const [categoryFilter, setCategoryFilter] = useQueryParamState<GoalsTypes.GoalCategory[]>('goals', 'category', [], true);
  const [ownerFilter, setOwnerFilter] = useQueryParamState<string[]>('goals', 'owner', [], true);
  const [participantFilter, setParticipantFilter] = useQueryParamState<string[]>('goals', 'participant', orgUserId ? [orgUserId] : [], true);
  const [teamFilter, setTeamFilter] = useQueryParamState<string[]>('goals', 'team', [], true);

  const [page, setPage] = useState(1);

  const location = useLocation();
  const isCompleted = location.pathname === goalRoutes?.ListComplete;
  const [sortByField, setSortByField] = useState(GoalsTypes.GetGoalsSortBy.DueDate);
  const [sortByOrder, setSortByOrder] = useState(GoalsTypes.GetGoalsSortOrder.Ascending);

  const history = useHistory();

  const {
    orgLevelEnableCascadingGoals,
    userLevelEnableCascadingGoals,
  } = useEnableCascadingGoals();

  const enableCascadingGoals = orgLevelEnableCascadingGoals && userLevelEnableCascadingGoals;

  // If the filters/searchText change, reset the page number so we don't look at page 2 of a 1 page searchText as an example.
  useEffect(() => {
    setPage(1);
  }, [history.location.search, debouncedSearchText]);

  const params: GoalsTypes.Requests.GetGoalsRequestQueryParameters = {
    category: categoryFilter.length ? categoryFilter.toString() : undefined,
    contextId: activeTab === GoalsTypes.GoalContextType.Team && teamFilter.length ? teamFilter.join(',') : '',
    contextType: activeTab,
    enableCascading: enableCascadingGoals,
    isCompleted,
    ownerIds: ownerFilter.join(','),
    participantIds: activeTab !== GoalsTypes.GoalContextType.Organization ? participantFilter.join(',') : undefined,
    priority: priorityFilter.length ? priorityFilter.toString() : undefined,
    searchField: useGoalSearchField(debouncedSearchText),
    searchText: debouncedSearchText,
    skip: (page - 1) * GOALS_PAGE_SIZE,
    sortBy: sortByField,
    sortOrder: sortByOrder,
    status: statusFilter.length ? statusFilter.toString() : undefined,
    take: GOALS_PAGE_SIZE,
  };

  const {
    data, isLoading: goalsAreLoading, isFetching,
  } = useGetGoals({ params });

  const goals = useMemo(() => data?.response.filter((goal) => goal.permissions.includes(GoalsTypes.GoalPermission.CanViewGoal)), [data?.response]);
  const [isLoading] = useSkeletonLoaders(goalsAreLoading);

  const usePaginationProps = usePagination({
    totalCount: data?.meta?.total ?? 1,
    pageSize: GOALS_PAGE_SIZE,
    page,
    setPage,
  });

  const areFiltersActive = statusFilter.length > 0
    || priorityFilter.length > 0
    || categoryFilter.length > 0
    || ownerFilter.length > 0
    || participantFilter.length > 0
    || teamFilter.length > 0;

  const isSearchActive = !!debouncedSearchText;

  const isSearchedOrFiltered = areFiltersActive || isSearchActive;

  const clearAllFilters = (): void => {
    setStatusFilter([]);
    setPriorityFilter([]);
    setCategoryFilter([]);
    setOwnerFilter([]);
    setParticipantFilter([]);
    setTeamFilter([]);
  };

  // Clear out the status filters when changing between Open and Closed, since they are mutually exclusive.
  useEffect(() => {
    setStatusFilter([]);
  }, [setStatusFilter, viewPerspective]);

  // Clear out the team filters if we're not on the team tab.
  useEffect(() => {
    if (activeTab !== GoalsTypes.GoalContextType.Team) {
      setTeamFilter([]);
    }
  }, [activeTab, setCategoryFilter, setTeamFilter]);

  const onSortModelChange = useCallback((sortModel: GridSortModel) => {
    if (sortModel.length) {
      setSortByField(goalSortColumnField[sortModel[0].field]);
      if (sortModel[0].sort) {
        setSortByOrder(dataGridToGoalsSortOrder[sortModel[0].sort]);
      }
    }
  }, []);

  const {
    isAdmin,
    isExecutive,
  } = useUserPermissions();

  const listScope = isAdmin ? TeamsListScope.AllTeams : TeamsListScope.OwnedTeams;

  const { data: teamsData } = useGetTeams({
    page: 0,
    count: 1000, // TODO: Need to make this NOT a predefined number - Should update this to pull everything or change the select box to be a searchfilter or something
    listScope,
  });

  const teamsList = teamsData?.response.teams.map((team) => ({
    label: team.name,
    value: team.teamId,
  })) || [];

  const hasTeams = teamsList.length > 0;

  const showEmptyStateCreateGoal = ((activeTab === GoalsTypes.GoalContextType.Team && hasTeams)
    || (activeTab === GoalsTypes.GoalContextType.Personal)
    || (activeTab === GoalsTypes.GoalContextType.Organization && (isAdmin || isExecutive)));

  const hookProps = {
    viewPerspective,
    activeTab,
    setActiveTab,
    areFiltersActive,
    clearAllFilters,
    goals,
    hasTeams,
    isCompleted,
    isFetching,
    isSearchedOrFiltered,
    onSortModelChange,
    page,
    setTeamFilter,
    isLoading,
    sortByField,
    sortByOrder,
    teamFilter,
    showEmptyStateCreateGoal,
    featureNamesText,
    goalRoutes,
    ...usePaginationProps,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };

export default Goals;
