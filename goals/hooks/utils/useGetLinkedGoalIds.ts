import { LinkedGoalType } from '~Goals/const/types';
import { useMemo } from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import { Goals } from '@josh-hr/types';
import { useGetLinkedGoalsById } from '../linkGoals/useGetLinkedGoalsById';

interface UseGetLinkedGoalIdsParams {
  goalId: string,
  linkedGoalType: LinkedGoalType,
}

interface UseGetLinkedGoalIdsReturn extends Omit<UseQueryResult<HttpCallReturn<Goals.Responses.GetLinkedGoalsResponse['data']>, Error>, 'data'> {
  linkedGoalIds: string[],
}

export const useGetLinkedGoalIds = ({ goalId, linkedGoalType }: UseGetLinkedGoalIdsParams): UseGetLinkedGoalIdsReturn => {
  const { data, ...rest } = useGetLinkedGoalsById({ goalId });

  const linkedGoalIds = useMemo(() => {
    if (linkedGoalType === LinkedGoalType.Parent) {
      const parentGoalId = data?.response.parentGoal?.goalId;
      return parentGoalId ? [parentGoalId] : [];
    }

    return data?.response.childGoals?.map((goal) => goal.goalId) || [];
  }, [data?.response.childGoals, data?.response.parentGoal?.goalId, linkedGoalType]);

  return {
    linkedGoalIds,
    ...rest,
  };
};
