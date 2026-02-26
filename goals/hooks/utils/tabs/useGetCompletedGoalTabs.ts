import { useMemo } from 'react';
import useGetGoalTabLabels, { UseGetGoalTabsReturn } from './useGetGoalTabLabels';
import useGetGoalRoutes, { GetGoalRoutesReturn } from '../useGetGoalRoutes';

interface GetCompletedGoalTabsParams {
  tabLabels: UseGetGoalTabsReturn['tabLabels'],
  goalRoutes: GetGoalRoutesReturn['goalRoutes'],
}

interface CompletedGoalTab {
  label: string,
  value: string,
  toObject: Partial<Location>,
  'data-test-id': string,
}

const getCompletedGoalTabs = ({ tabLabels, goalRoutes }: GetCompletedGoalTabsParams): CompletedGoalTab[] => ([
  {
    label: tabLabels.Personal.Label,
    value: `${tabLabels.Personal.Value}`,
    toObject: {
      pathname: goalRoutes?.ListComplete,
      search: `?tab=${tabLabels.Personal.Value}`,
    },
    'data-test-id': 'personalGoalsTab',
  },
  {
    label: tabLabels.Team.Label,
    value: `${tabLabels.Team.Value}`,
    toObject: {
      pathname: goalRoutes?.ListComplete,
      search: `?tab=${tabLabels.Team.Value}`,
    },
    'data-test-id': 'teamGoalsTab',
  },
  {
    label: tabLabels.Organization.Label,
    value: `${tabLabels.Organization.Value}`,
    toObject: {
      pathname: goalRoutes?.ListComplete,
      search: `?tab=${tabLabels.Organization.Value}`,
    },
    'data-test-id': 'organizationGoalsTab',
  },
]);

interface UseGetCompletedGoalTabs {
  completedTabs: CompletedGoalTab[],
}

const useGetCompletedGoalTabs = (): UseGetCompletedGoalTabs => {
  const { tabLabels } = useGetGoalTabLabels();
  const { goalRoutes } = useGetGoalRoutes();
  const completedTabs = useMemo(() => getCompletedGoalTabs({ tabLabels, goalRoutes }), [goalRoutes, tabLabels]);

  return {
    completedTabs,
  };
};

export default useGetCompletedGoalTabs;
