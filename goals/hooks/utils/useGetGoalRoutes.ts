import { useMemo } from 'react';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

export type GoalRoutes = {
  Base: string,
  Dashboard: string,
  Create: string,
  ListOpen: string,
  ListComplete: string,
  ViewById: string,
  GoalStatus: string,
  GoalStatusById: string,
  EditById: string,
  PermissionsDenied: string,
};

interface GetGoalRoutesParams {
  featureNamesText: FeatureNamesText,
}

const getGoalBaseRoute = ({ featureNamesText }: GetGoalRoutesParams): string => `/${featureNamesText.goals.plural.toLowerCase()}/`;

const getGoalRoutes = ({ featureNamesText }: GetGoalRoutesParams): GoalRoutes => ({
  Base: getGoalBaseRoute({ featureNamesText }),
  Dashboard: `${getGoalBaseRoute({ featureNamesText })}`,
  Create: `${getGoalBaseRoute({ featureNamesText })}new`,
  ListOpen: `${getGoalBaseRoute({ featureNamesText })}open`,
  ListComplete: `${getGoalBaseRoute({ featureNamesText })}complete`,
  ViewById: `${getGoalBaseRoute({ featureNamesText })}:goalId`,
  GoalStatus: `${getGoalBaseRoute({ featureNamesText })}:goalId/statuses`,
  GoalStatusById: `${getGoalBaseRoute({ featureNamesText })}:goalId/statuses/:statusId`,
  EditById: `${getGoalBaseRoute({ featureNamesText })}:goalId/edit`,
  PermissionsDenied: `${getGoalBaseRoute({ featureNamesText })}denied`,
});

export interface GetGoalRoutesReturn {
  goalRoutes: GoalRoutes,
}

const useGetGoalRoutes = (): GetGoalRoutesReturn => {
  const { featureNamesText } = useGetFeatureNamesText();

  const goalRoutes = useMemo(() => getGoalRoutes({ featureNamesText }), [featureNamesText]);

  return {
    goalRoutes,
  };
};

export default useGetGoalRoutes;
