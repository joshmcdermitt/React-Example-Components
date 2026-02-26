import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import useIsTableGroupOrg from '~Common/hooks/useIsTableGroupOrg';
import { GoalTypeOption } from '~Goals/const/types';

export const GOAL_CATEGORY_TYPE_MAP = {
  [Goals.GoalCategory.Objective]: 'Objective',
  [Goals.GoalCategory.KeyResult]: 'Key Result',
  [Goals.GoalCategory.DefiningObjectives]: 'Defining Objective',
  [Goals.GoalCategory.StandardOperatingObjectives]: 'Standard Operating Objective',
};

interface GetGoalCategoryTypesParams {
  isTableGroupOrg: boolean,
}

type GetGoalCategoryTypesReturn = GoalTypeOption<Goals.GoalCategory>[];

const getGoalCategoryTypes = ({ isTableGroupOrg }: GetGoalCategoryTypesParams): GetGoalCategoryTypesReturn => {
  const goalCategoryTypes = [
    {
      value: Goals.GoalCategory.Objective,
      text: GOAL_CATEGORY_TYPE_MAP[Goals.GoalCategory.Objective],
    },
    {
      value: Goals.GoalCategory.KeyResult,
      text: GOAL_CATEGORY_TYPE_MAP[Goals.GoalCategory.KeyResult],
    },
  ];

  if (isTableGroupOrg) {
    goalCategoryTypes.push(...[
      {
        value: Goals.GoalCategory.DefiningObjectives,
        text: GOAL_CATEGORY_TYPE_MAP[Goals.GoalCategory.DefiningObjectives],
      },
      {
        value: Goals.GoalCategory.StandardOperatingObjectives,
        text: GOAL_CATEGORY_TYPE_MAP[Goals.GoalCategory.StandardOperatingObjectives],
      },
    ]);
  }

  return goalCategoryTypes;
};

export interface GoalCategoryTypes {
  goalCategoryTypes: GetGoalCategoryTypesReturn,
}

const useGetGoalCategoryTypes = (): GoalCategoryTypes => {
  const { isTableGroupOrg } = useIsTableGroupOrg();

  const goalCategoryTypes = useMemo(() => getGoalCategoryTypes({ isTableGroupOrg }), [isTableGroupOrg]);

  return {
    goalCategoryTypes,
  };
};

export default useGetGoalCategoryTypes;
