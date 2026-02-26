import { Goals } from '@josh-hr/types';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { buildQueryString } from '~Common/utils';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { goalKeys } from '~Goals/const/queryKeys';

const getLinkableChildGoals = async ({
  goalId,
  queryParameters,
}: Omit<Goals.Requests.GetLinkableChildGoalsRequest, 'organizationId'>): Promise<HttpCallReturn<Goals.LinkedGoal[]>> => {
  const queryParams = buildQueryString(queryParameters ?? {});
  const url = {
    version: 3,
    url: `/goals/${goalId}/linkable/child${queryParams}`,
  };

  return getApi<Goals.LinkedGoal[]>(url);
};

type UseGetLinkableChildGoalsParams<T> = Omit<UseQueryOptions<HttpCallReturn<Goals.LinkedGoal[]>, Error, T>, 'queryKey' | 'queryFn'> &
  Omit<Goals.Requests.GetLinkableChildGoalsRequest, 'organizationId'>

export const useGetLinkableChildGoals = <T = HttpCallReturn<Goals.LinkedGoal[]>>({
  goalId,
  queryParameters,
  ...options
}: UseGetLinkableChildGoalsParams<T>): UseQueryResult<T, Error> => useQuery({
    queryKey: goalKeys.linkableChildGoals(goalId, queryParameters),
    queryFn: () => getLinkableChildGoals({ goalId, queryParameters }),
    ...options,
  });
