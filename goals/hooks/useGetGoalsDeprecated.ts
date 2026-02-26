/* eslint-disable indent */
import {
  UseQueryOptions,
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { buildQueryString } from '~Common/utils';
import { Goals } from '@josh-hr/types';
import { goalKeys } from '../const/queryKeys';

type GetGoalsReturn = Goals.Responses.GetGoalsResponse['data'];

interface GetGoalsProps {
  params: Goals.Requests.GetGoalsRequestQueryParameters,
}
const getGoals = async ({
  params,
}: GetGoalsProps): Promise<HttpCallReturn<GetGoalsReturn>> => {
  const queryString = buildQueryString(params);
  const url = {
    version: 3,
    url: `/goals${queryString ?? ''}`,
  };

  return getApi<GetGoalsReturn>(url);
};

interface UseGetGoalsProps<T> extends Omit<UseQueryOptions<HttpCallReturn<GetGoalsReturn>, Error, T>, 'queryKey' | 'queryFn'> {
  params: Goals.Requests.GetGoalsRequestQueryParameters,
}

export const useGetGoals = <T = HttpCallReturn<GetGoalsReturn>>({
  params,
  enabled = true,
  ...options
}: UseGetGoalsProps<T>): UseQueryResult<T, Error> => useQuery({
  queryKey: goalKeys.list(params),
  queryFn: () => getGoals({ params }),
  enabled,
  placeholderData: keepPreviousData,
  ...options,
});
