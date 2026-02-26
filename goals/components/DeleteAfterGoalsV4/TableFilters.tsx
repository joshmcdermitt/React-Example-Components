/**
 * @deprecated Old UI TableFilters, use packages/josh-frontend/src/goals/components/TableFilters.tsx instead
 */

import { css } from '@emotion/react';
import {
  useCallback,
  useMemo,
} from 'react';
import { Goals } from '@josh-hr/types';

import { useGetPeopleByList } from '~Deprecated/hooks/peoplePicker/useNewPeople';
import { PersonDisplayInformation } from '~Common/const/interfaces';
import { SelectOption, ViewPerspective } from '~Goals/const/types';
import { useSelectParticipants } from '~Common/hooks/useSelectParticipants';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import ClearFiltersButton from '~Common/components/Cards/FilterBarCard/ClearFiltersButton';
import { useGetTeams } from '~People/components/Teams/hooks/useGetTeams';
import { TeamsListScope } from '~People/components/Teams/const/types';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import { sortBy, uniqBy } from 'lodash';
import StatusFilter from './StatusFilter';
import PriorityFilter from './PriorityFilter';
import CategoryFilter from './CategoryFilter';
import AutoCompleteFilters from './AutoCompleteFilters';

const styles = {
  filtersContainer: css({
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    gap: '.5rem',
    marginTop: '.625rem',
    flexWrap: 'wrap',
  }),
};

interface ViewProps {
  activeTab: Goals.GoalContextType,
  allTeamsList: SelectOption[],
  areFiltersActive: boolean,
  clearAllFilters: () => void,
  onOwnerChange: (newOwnerValue: string[]) => void,
  onParticipantChange: (newParticipantValue: string[]) => void,
  onTeamChange: (newParticipantValue: string[]) => void,
  ownerList?: string[],
  participantList?: string[],
  recipientList: SelectOption[],
  teamList?: string[],
  viewPerspective?: ViewPerspective,
}

const View = ({
  activeTab,
  allTeamsList,
  areFiltersActive,
  clearAllFilters,
  onOwnerChange,
  onParticipantChange,
  onTeamChange,
  ownerList,
  participantList,
  recipientList,
  teamList,
  viewPerspective = ViewPerspective.Open,
}: ViewProps): JSX.Element => (
  <div
    css={styles.filtersContainer}
  >
    <AutoCompleteFilters
      activeTab={activeTab}
      allTeamsList={allTeamsList}
      onOwnerChange={onOwnerChange}
      onParticipantChange={onParticipantChange}
      onTeamChange={onTeamChange}
      ownerList={ownerList}
      participantList={participantList}
      recipientList={recipientList}
      teamList={teamList}
    />
    <StatusFilter
      data-test-id="goalsTableStatusFilter"
      viewPerspective={viewPerspective}
    />
    <PriorityFilter
      data-test-id="goalsTablePriorityFilter"
    />
    <CategoryFilter
      data-test-id="goalsTableCategoryFilter"
    />
    <ClearFiltersButton hasFilters={areFiltersActive} onClick={clearAllFilters} />
  </div>
);

type TableFiltersProps = Pick<ViewProps, 'activeTab' | 'areFiltersActive' | 'clearAllFilters' | 'viewPerspective'>

export const TableFilters = ({
  activeTab,
  areFiltersActive,
  clearAllFilters,
  viewPerspective,
}: TableFiltersProps): JSX.Element => {
  const orgUserId = getOrganizationUserId();
  const [ownerList, setOwnerList] = useQueryParamState<string[]>('goals', 'owner', [], true);
  const [participantList, setParticipantList] = useQueryParamState<string[]>('goals', 'participant', orgUserId ? [orgUserId] : [], true);
  const [teamList, setTeamList] = useQueryParamState<string[]>('goals', 'team', [], true);

  const onOwnerChange = useCallback((newOwnerValue: string[]) => {
    setOwnerList(newOwnerValue);
  }, [setOwnerList]);
  const onParticipantChange = useCallback((newParticipantValue: string[]) => {
    setParticipantList(newParticipantValue);
  }, [setParticipantList]);
  const onTeamChange = useCallback((newTeamValue: string[]) => {
    setTeamList(newTeamValue);
  }, [setTeamList]);

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

  const recipientList = useMemo(() => peopleInfo.map((person) => ({
    label: `${person?.firstName} ${person?.lastName}`,
    value: person?.orgUserId,
    profileImage: person?.profileImageUrl,
    jobTitle: person?.jobTitle,
  })), [peopleInfo]) as SelectOption[];

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

  const hookProps = {
    activeTab,
    allTeamsList,
    areFiltersActive,
    clearAllFilters,
    onOwnerChange,
    onParticipantChange,
    onTeamChange,
    ownerList,
    participantList,
    recipientList,
    teamList,
    viewPerspective,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
