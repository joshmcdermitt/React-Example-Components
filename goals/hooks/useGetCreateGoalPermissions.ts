import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import { TeamsListScope } from '~People/components/Teams/const/types';
import { useGetTeams } from '~People/components/Teams/hooks/useGetTeams';

interface UseCreateGoalPermissionsReturn {
  allowedGoalOptionScopes: Goals.GoalContextType[],
  isLoading: boolean,
}

const useGetCreateGoalPermissions = (): UseCreateGoalPermissionsReturn => {
  const {
    isAdmin,
    isExecutive,
    isLoading: areUserPermissonsLoading,
  } = useUserPermissions();
  const isAdminOrExecutive = isAdmin || isExecutive;
  const teamsListScope = isAdmin ? TeamsListScope.AllTeams : TeamsListScope.MyTeams;
  const { data: teamsData, isLoading: areTeamsLoading } = useGetTeams({
    page: 0,
    count: 1000, // TODO: Need to make this NOT a predefined number - Should update this to pull everything or change the select box to be a searchfilter or something
    listScope: teamsListScope,
  });

  const teams = teamsData?.response.teams ?? [];
  const hasTeams = teams.length > 0;

  const allowedGoalOptionScopes = useMemo(() => {
    const allowedTypes = [Goals.GoalContextType.Personal];

    if (hasTeams) {
      allowedTypes.push(Goals.GoalContextType.Team);
    }

    if (isAdminOrExecutive) {
      allowedTypes.push(Goals.GoalContextType.Organization);
    }

    return allowedTypes;
  }, [hasTeams, isAdminOrExecutive]);

  return {
    allowedGoalOptionScopes,
    isLoading: areTeamsLoading || areUserPermissonsLoading,
  };
};

export default useGetCreateGoalPermissions;
