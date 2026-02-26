import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import BuildingIcon from '~Assets/icons/components/BuildingIcon';
import UserIcon from '~Assets/icons/components/UserIcon';
import UsersIcon from '~Assets/icons/components/UsersIcon';

export const GoalContextTypeTextMap = {
  [Goals.GoalContextType.Personal]: 'Personal',
  [Goals.GoalContextType.Team]: 'Team',
  [Goals.GoalContextType.Organization]: 'Organization',
};

export interface GoalOptionScopeItem {
  value: Goals.GoalContextType,
  text: string,
  ['data-test-id']: string,
  icon: JSX.Element,
}

const getGoalOptionScopeItems = (): GoalOptionScopeItem[] => ([
  {
    value: Goals.GoalContextType.Personal,
    text: GoalContextTypeTextMap[Goals.GoalContextType.Personal],
    'data-test-id': 'goalContextTypePersonal',
    icon: <UserIcon />,
  },
  {
    value: Goals.GoalContextType.Team,
    text: GoalContextTypeTextMap[Goals.GoalContextType.Team],
    'data-test-id': 'goalContextTypeTeam',
    icon: <UsersIcon />,
  },
  {
    value: Goals.GoalContextType.Organization,
    text: GoalContextTypeTextMap[Goals.GoalContextType.Organization],
    'data-test-id': 'goalContextTypeOrganization',
    icon: <BuildingIcon />,
  },
]);

interface UseGetGoalOptionScopeItemsReturn {
  optionScopeItems: GoalOptionScopeItem[],
}

const useGetGoalOptionScopeItems = (): UseGetGoalOptionScopeItemsReturn => {
  const optionScopeItems = useMemo(() => getGoalOptionScopeItems(), []);

  return {
    optionScopeItems,
  };
};

export default useGetGoalOptionScopeItems;
