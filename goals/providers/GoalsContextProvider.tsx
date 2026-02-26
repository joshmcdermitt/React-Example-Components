import {
  ChangeEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Goals } from '@josh-hr/types';
import { useGetGoals } from '~Goals/hooks/useGetGoals';
import { useGetGoalsCascading } from '~Goals/hooks/useGetGoalsCascading';
import { GOALS_PAGE_SIZE } from '~Goals/const/defaults';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { SelectOption, ViewPerspective } from '~Goals/const/types';
import { useHistory, useLocation } from 'react-router-dom';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import { useEnableCascadingGoals } from '~Goals/hooks/utils/useEnableCascadingGoals';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import { TeamsListScope } from '~People/components/Teams/const/types';
import { useGetTeams } from '~People/components/Teams/hooks/useGetTeams';
import { sortBy, uniqBy } from 'lodash';
import { queryClient } from '~Common/const/queryClient';
import { goalKeys } from '~Goals/const/queryKeys';
import { useGetPeopleByList } from '~Deprecated/hooks/usePeople';
import { useSelectParticipants } from '~Common/hooks/useSelectParticipants';
import { PersonDisplayInformation } from '~Common/const/interfaces';

// REFACTOR: Extract Filters to separate context
interface GoalsContextType {
  allTeamsList: SelectOption[],
  categoryFilter: Goals.GoalCategory[],
  enableCascadingGoals: boolean,
  goals: Goals.GoalV4[] | undefined,
  goalsCascading: Goals.GoalV4Cascading[] | undefined,
  handleResetGoalsQuery: (status: boolean) => void,
  isCascadingFetching: boolean,
  isFetching: boolean,
  isFiltersNotDefault: boolean,
  isLoading: boolean,
  numberOfPages: number,
  numberOfPagesCascading: number,
  onPageChange: (event: ChangeEvent<number>, newPage: number) => void,
  onParticipantChange: (newParticipantValue: string[]) => void,
  onTeamChange: (newTeamValue: string[]) => void,
  page: number,
  participantFilter: string[],
  payload: Goals.Requests.GetGoalsRequestBody,
  priorityFilter: Goals.GoalPriority[],
  recipientList: SelectOption[],
  resetFilters: () => void,
  scopeFilter: Goals.GoalContextType[],
  searchTerms: string[],
  setCategoryFilter: (categoryFilter: Goals.GoalCategory[]) => void,
  setPage: (page: number) => void,
  setParticipantFilter: (participantFilter: string[]) => void,
  setPriorityFilter: (priorityFilter: Goals.GoalPriority[]) => void,
  setScopeFilter: (scopeFilter: Goals.GoalContextType[]) => void,
  setSearchTerms: (searchTerms: string[]) => void,
  setShouldConfirmReset: (shouldConfirmReset: boolean) => void,
  setSortByField: (sortByField: Goals.GetGoalsSortByV4) => void,
  setSortByOrder: (sortByOrder: Goals.GetGoalsSortOrder) => void,
  setStateFilter: (stateFilter: ViewPerspective) => void,
  setStatusFilter: (statusFilter: Goals.GoalStatus[] | Goals.AdditionalGoalStatusFilters[]) => void,
  setTeamFilter: (teamFilter: string[]) => void,
  shouldConfirmReset: boolean,
  sortByField: Goals.GetGoalsSortByV4,
  sortByOrder: Goals.GetGoalsSortOrder,
  stateFilter: ViewPerspective,
  statusFilter: (Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[],
  teamFilter: string[],
  ownersOnly: boolean,
  setOwnersOnly: (ownersOnly: boolean) => void,
}

export const GoalsContext = createContext<GoalsContextType | null>(null);

export const useGoalsContext = (): GoalsContextType => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoalsContext must be used within an GoalsProvider');
  }
  return context;
};

export const GoalsProvider = ({
  children,
}: {
  children: React.ReactNode
}): JSX.Element => {
  /* FILTERS */
  const [categoryFilter, setCategoryFilter] = useQueryParamState<Goals.GoalCategory[]>('goals', 'category', [], true);
  const [priorityFilter, setPriorityFilter] = useQueryParamState<Goals.GoalPriority[]>('goals', 'priority', [], true);
  const [scopeFilter, setScopeFilter] = useQueryParamState<Goals.GoalContextType[]>('goals', 'scope', [], true);
  const [searchTerms, setSearchTerms] = useQueryParamState<string[]>('goals', 'search', [], true);
  const [stateFilter, setStateFilter] = useQueryParamState<ViewPerspective>('goals', 'state', ViewPerspective.Open, false);
  const [statusFilter, setStatusFilter] = useQueryParamState<Goals.GoalStatus[] | Goals.AdditionalGoalStatusFilters[]>('goals', 'status', [], true);
  const [teamFilter, setTeamFilter] = useQueryParamState<string[]>('goals', 'team', [], true);
  const [participantFilter, setParticipantFilter] = useQueryParamState<string[]>('goals', 'participant', [], true);

  const [shouldConfirmReset, setShouldConfirmReset] = useState(false);
  const [ownersOnly, setOwnersOnly] = useState(false);

  const isFiltersNotDefault = useMemo(() => (
    stateFilter !== ViewPerspective.Open
    || priorityFilter.length > 0
    || scopeFilter.length > 0
    || statusFilter.length > 0
    || teamFilter.length > 0
    || categoryFilter.length > 0
    || (participantFilter.length > 0)
  ), [stateFilter, priorityFilter.length, scopeFilter.length, statusFilter.length, teamFilter.length, categoryFilter.length, participantFilter]);

  /* GOAL STATE FROM LOCATION.PATH */
  const location = useLocation();
  const history = useHistory();
  const goalRoutes = useGetGoalRoutes();

  // Initialize state filter based on current route
  const initialStateFilter = useMemo(() => {
    if (goalRoutes && location.pathname === goalRoutes.goalRoutes.ListComplete) {
      return ViewPerspective.Completed;
    }
    return ViewPerspective.Open;
  }, [goalRoutes, location.pathname]);

  // Only set state filter on mount
  useEffect(() => {
    setStateFilter(initialStateFilter);
  }, [initialStateFilter, setStateFilter]);

  /* VIEW/SORT */
  const [sortByField, setSortByField] = useState<Goals.GetGoalsSortByV4>(Goals.GetGoalsSortByV4.DueDate);
  const [sortByOrder, setSortByOrder] = useState<Goals.GetGoalsSortOrder>(Goals.GetGoalsSortOrder.Ascending);

  /* PAGINATION */
  const [page, setPage] = useState(1);

  // If the filters/searchText change, reset the page number so we don't look at page 2 of a 1 page searchText as an example.
  useEffect(() => {
    setPage(1);
  }, [history.location.search, searchTerms]);

  /* ENABLE CASCADING */
  const {
    orgLevelEnableCascadingGoals,
    userLevelEnableCascadingGoals,
  } = useEnableCascadingGoals();

  const enableCascadingGoals = orgLevelEnableCascadingGoals && userLevelEnableCascadingGoals;

  /* PARTICIPANT FILTER */
  const {
    allParticipants,
  } = useSelectParticipants({
    useOrgIds: true,
    allowSelf: false,
    selectedFilters: [],
    filterIds: [],
  }) as { allParticipants: string[], isLoading: boolean };

  const peopleInfo = useGetPeopleByList({
    selectedIds: allParticipants,
  }) as PersonDisplayInformation[];

  const recipientList = useMemo(() => peopleInfo?.map((person) => ({
    label: `${person?.firstName} ${person?.lastName}`,
    value: person?.orgUserId,
    profileImage: person?.profileImageUrl,
    jobTitle: person?.jobTitle,
  })), [peopleInfo]) as SelectOption[];

  const onParticipantChange = useCallback((newParticipantValue: string[]) => {
    setParticipantFilter(newParticipantValue);
  }, [setParticipantFilter]);

  /* TEAM FILTER */
  const {
    isAdmin,
  } = useUserPermissions();
  const listScope = isAdmin ? TeamsListScope.AllTeams : TeamsListScope.MyTeams;

  const { data: teamsData } = useGetTeams({
    // we want to get the first page of teams
    page: 0,
    count: 1000, // TODO: Need to make this NOT a predefined number - Should update this to pull everything or change the select box to be a searchfilter or something
    listScope,
  });
  const allTeamsList: SelectOption[] = useMemo(() => {
    const allTeams = teamsData?.response.teams ?? [];
    const dedupedTeams = uniqBy(allTeams, (team) => team.teamId) ?? [];
    const sortedTeams = sortBy(dedupedTeams, (team) => team.name) ?? [];

    return sortedTeams.map((team) => ({
      label: team.name,
      value: team.teamId,
      profileImage: undefined,
      jobTitle: undefined,
    }));
  }, [teamsData]);

  const onTeamChange = useCallback((newTeamValue: string[]) => {
    setTeamFilter(newTeamValue);
  }, [setTeamFilter]);
  const payload: Goals.Requests.GetGoalsRequestBody = useMemo(() => ({
    isCompleted: stateFilter === ViewPerspective.Completed,
    participantIds: participantFilter.length ? participantFilter : undefined,
    contextId: scopeFilter.includes(Goals.GoalContextType.Team) && teamFilter.length ? teamFilter : undefined,
    contextType: scopeFilter.length ? scopeFilter : undefined,
    status: statusFilter.length ? statusFilter : undefined,
    priority: priorityFilter.length ? priorityFilter : undefined,
    category: categoryFilter.length ? categoryFilter : undefined,
    searchText: searchTerms.length ? searchTerms : undefined,
    sortBy: sortByField,
    sortOrder: sortByOrder,
    skip: (page - 1) * GOALS_PAGE_SIZE,
    role: ownersOnly ? Goals.GoalParticipantRole.Owner : undefined,
    take: GOALS_PAGE_SIZE,
  }), [categoryFilter, ownersOnly, page, participantFilter, priorityFilter, scopeFilter, searchTerms,
    sortByField, sortByOrder, stateFilter, statusFilter, teamFilter]);

  // LLM wrap goal fetching in condition based on enableCascadingGoals
  /* NEW GOALS */
  const {
    data: goalsData,
    isLoading: isGoalsLoading,
    isFetching,
  } = useGetGoals(payload, enableCascadingGoals);

  const goals = useMemo(() => goalsData?.response
    ?.filter((goal: Goals.GoalV4) => goal.permissions?.includes(Goals.GoalPermission.CanViewGoal)) ?? [], [goalsData?.response]);

  const numberOfPages = useMemo(() => Math.ceil((goalsData?.meta?.total ?? 0) / GOALS_PAGE_SIZE), [goalsData?.meta?.total]);

  /* CASCADING GOALS */
  const {
    data: goalsDataCascading,
    isLoading: isGoalsCascadingLoading,
    isFetching: isCascadingFetching,
  } = useGetGoalsCascading(payload, enableCascadingGoals);

  const goalsCascading = useMemo(() => goalsDataCascading?.response
    ?.filter((goal: Goals.GoalV4Cascading) => goal.permissions?.includes(Goals.GoalPermission.CanViewGoal)) ?? [], [goalsDataCascading?.response]);

  const numberOfPagesCascading = useMemo(() => Math.ceil((goalsDataCascading?.meta?.total ?? 0) / GOALS_PAGE_SIZE), [goalsDataCascading?.meta?.total]);

  /* CONTEXT VALUE */
  const value = useMemo(() => {
    const onPageChange = (_event: ChangeEvent<number>, newPage: number): void => {
      setPage(newPage);
    };

    const resetFilters = (): void => {
      setCategoryFilter([]);
      setPriorityFilter([]);
      setScopeFilter([]);
      setSearchTerms([]);
      setStateFilter(ViewPerspective.Open);
      setStatusFilter([]);
      setTeamFilter([]);
      setParticipantFilter([]);
      setOwnersOnly(false);
    };

    const handleResetGoalsQuery = (isCascading: boolean): void => {
      if (isCascading) {
        void queryClient.invalidateQueries({ queryKey: [goalKeys.list(payload), 'cascading'] });
      } else {
        void queryClient.invalidateQueries({ queryKey: [goalKeys.list(payload), 'non-cascading'] });
      }
    };

    const isLoading = isGoalsLoading || isGoalsCascadingLoading;

    return {
      isLoading,
      recipientList,
      participantFilter,
      setParticipantFilter,
      onParticipantChange,
      allTeamsList,
      categoryFilter,
      enableCascadingGoals,
      goals,
      goalsCascading,
      handleResetGoalsQuery,
      isCascadingFetching,
      isFetching,
      numberOfPages,
      numberOfPagesCascading,
      onPageChange,
      onTeamChange,
      page,
      payload,
      priorityFilter,
      resetFilters,
      scopeFilter,
      searchTerms,
      setCategoryFilter,
      setPage,
      setPriorityFilter,
      setScopeFilter,
      setSearchTerms,
      setSortByField,
      setSortByOrder,
      setStateFilter,
      setStatusFilter,
      setTeamFilter,
      sortByField,
      sortByOrder,
      stateFilter,
      statusFilter,
      teamFilter,
      shouldConfirmReset,
      setShouldConfirmReset,
      isFiltersNotDefault,
      ownersOnly,
      setOwnersOnly,
    };
  }, [
    isGoalsLoading,
    isGoalsCascadingLoading,
    recipientList,
    participantFilter,
    setParticipantFilter,
    onParticipantChange,
    onTeamChange,
    allTeamsList,
    categoryFilter,
    enableCascadingGoals,
    goals,
    goalsCascading,
    isCascadingFetching,
    isFetching,
    numberOfPages,
    numberOfPagesCascading,
    page,
    payload,
    priorityFilter,
    scopeFilter,
    searchTerms,
    setCategoryFilter,
    setPriorityFilter,
    setScopeFilter,
    setSearchTerms,
    setStateFilter,
    setStatusFilter,
    setTeamFilter,
    sortByField,
    sortByOrder,
    stateFilter,
    statusFilter,
    teamFilter,
    shouldConfirmReset,
    isFiltersNotDefault,
    ownersOnly,
    setOwnersOnly,
  ]);

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};
