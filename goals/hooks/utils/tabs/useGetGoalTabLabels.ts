import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

interface GetGoalTabsParams {
  featureNamesText: FeatureNamesText,
}

interface GoalTabLabels {
  Personal: {
    Label: string,
    Value: Goals.GoalContextType,
  },
  Team: {
    Label: string,
    Value: Goals.GoalContextType,
  },
  Organization: {
    Label: string,
    Value: Goals.GoalContextType,
  },
}

const getGoalTabLabels = ({ featureNamesText }: GetGoalTabsParams): GoalTabLabels => ({
  Personal: {
    Label: `Personal ${featureNamesText.goals.plural}`,
    Value: Goals.GoalContextType.Personal,
  },
  Team: {
    Label: `Team ${featureNamesText.goals.plural}`,
    Value: Goals.GoalContextType.Team,
  },
  Organization: {
    Label: `Organization ${featureNamesText.goals.plural}`,
    Value: Goals.GoalContextType.Organization,
  },
});

export interface UseGetGoalTabsReturn {
  tabLabels: GoalTabLabels,
}

const useGetGoalTabLabels = (): UseGetGoalTabsReturn => {
  const { featureNamesText } = useGetFeatureNamesText();

  const tabLabels = useMemo(() => getGoalTabLabels({ featureNamesText }), [featureNamesText]);

  return {
    tabLabels,
  };
};

export default useGetGoalTabLabels;
