import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { Goals } from '@josh-hr/types';
import { goalKeys } from '~Goals/const/queryKeys';

type GetLinkedGoalsByIdResponse = Goals.Responses.GetLinkedGoalsResponse['data'];

interface GetLinkedGoalsByIdParams {
  goalId: string,
}

const getLinkedGoalsById = async ({ goalId }: GetLinkedGoalsByIdParams): Promise<HttpCallReturn<GetLinkedGoalsByIdResponse>> => {
  const serverUrl = {
    version: 3,
    url: `/goals/${goalId}/link`,
  };

  return getApi<GetLinkedGoalsByIdResponse>(serverUrl);
};

interface UseGetLinkedGoalsByIdParams<T> extends Omit<
  UseQueryOptions<HttpCallReturn<GetLinkedGoalsByIdResponse>, Error, T>, 'queryKey' | 'queryFn'
> {
  goalId: string,
}

export const useGetLinkedGoalsById = <T = HttpCallReturn<GetLinkedGoalsByIdResponse>>({
  goalId,
  ...options
}: UseGetLinkedGoalsByIdParams<T>): UseQueryResult<T, Error> => useQuery({
    ...getLinkedGoalsByIdParams({ goalId }),
    enabled: !!goalId,
    ...options,
  });

interface GetLinkedGoalsByIdParams {
  goalId: string,
}

interface QueryOptionsReturn {
  queryKey: readonly string[];
  queryFn: () => Promise<HttpCallReturn<GetLinkedGoalsByIdResponse>>;
}

export const getLinkedGoalsByIdParams = ({
  goalId,
}: GetLinkedGoalsByIdParams): QueryOptionsReturn => ({
  queryKey: goalKeys.linkedGoals(goalId),
  queryFn: () => getLinkedGoalsById({ goalId }),
});
