import { useMemo } from 'react';
import useGetGoalRoutes, { GetGoalRoutesReturn } from '../useGetGoalRoutes';
import useGetGoalTabLabels, { UseGetGoalTabsReturn } from './useGetGoalTabLabels';

interface GetOpenGoalTabsParams {
  tabLabels: UseGetGoalTabsReturn['tabLabels'],
  goalRoutes: GetGoalRoutesReturn['goalRoutes']
}

interface OpenGoalTab {
  label: string,
  value: string,
  toObject: Partial<Location>,
  'data-test-id': string,
}

const getOpenGoalTabs = ({ tabLabels, goalRoutes }: GetOpenGoalTabsParams): OpenGoalTab[] => ([
  {
    label: tabLabels.Personal.Label,
    value: `${tabLabels.Personal.Value}`,
    toObject: {
      pathname: goalRoutes?.ListOpen,
      search: `?tab=${tabLabels.Personal.Value}`,
    },
    'data-test-id': 'personalGoalsTab',
  },
  {
    label: tabLabels.Team.Label,
    value: `${tabLabels.Team.Value}`,
    toObject: {
      pathname: goalRoutes?.ListOpen,
      search: `?tab=${tabLabels.Team.Value}`,
    },
    'data-test-id': 'teamGoalsTab',
  },
  {
    label: tabLabels.Organization.Label,
    value: `${tabLabels.Organization.Value}`,
    toObject: {
      pathname: goalRoutes?.ListOpen,
      search: `?tab=${tabLabels.Organization.Value}`,
    },
    'data-test-id': 'organizationGoalsTab',
  },
]);

interface UseGetOpenGoalTabs {
  openTabs: OpenGoalTab[],
}

const useGetOpenGoalTabs = (): UseGetOpenGoalTabs => {
  const { tabLabels } = useGetGoalTabLabels();
  const { goalRoutes } = useGetGoalRoutes();
  const openTabs = useMemo(() => getOpenGoalTabs({ tabLabels, goalRoutes }), [goalRoutes, tabLabels]);

  return {
    openTabs,
  };
};

export default useGetOpenGoalTabs;
