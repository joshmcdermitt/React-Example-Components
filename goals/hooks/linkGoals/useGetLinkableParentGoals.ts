import { Goals } from '@josh-hr/types';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { buildQueryString } from '~Common/utils';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { goalKeys } from '~Goals/const/queryKeys';

const getLinkableParentGoals = async ({
  goalId,
  queryParameters,
}: Omit<Goals.Requests.GetLinkableParentGoalsRequest, 'organizationId'>): Promise<HttpCallReturn<Goals.LinkedGoal[]>> => {
  const queryParams = buildQueryString(queryParameters ?? {});
  const url = {
    version: 3,
    url: `/goals/${goalId}/linkable/parent${queryParams}`,
  };

  return getApi<Goals.LinkedGoal[]>(url);
};

type UseGetLinkableParentGoalsParams<T> = Omit<UseQueryOptions<HttpCallReturn<Goals.LinkedGoal[]>, Error, T>, 'queryKey' | 'queryFn'> &
  Omit<Goals.Requests.GetLinkableParentGoalsRequest, 'organizationId'>

export const useGetLinkableParentGoals = <T = HttpCallReturn<Goals.LinkedGoal[]>>({
  goalId,
  queryParameters,
  ...options
}: UseGetLinkableParentGoalsParams<T>): UseQueryResult<T, Error> => useQuery({
    queryKey: goalKeys.linkableParentGoals(goalId, queryParameters),
    queryFn: () => getLinkableParentGoals({ goalId, queryParameters }),
    ...options,
  });
