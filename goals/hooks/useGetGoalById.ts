import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { Goals } from '@josh-hr/types';
import { goalKeys } from '../const/queryKeys';

type GetGoalByIdParams = Omit<Goals.Requests.GetGoalByIdRequest, 'organizationId'>;
export type GetGoalByIdReturn = Goals.Responses.GetGoalByIdResponse['data'];

export const getGoalById = ({ goalId }: GetGoalByIdParams): Promise<HttpCallReturn<GetGoalByIdReturn>> => {
  const serverUrl = {
    version: 3,
    url: `/goals/${goalId}`,
  };
  return getApi<GetGoalByIdReturn>(serverUrl, {});
};

export interface UseGetGoalByIdParams<T> extends Omit<UseQueryOptions<HttpCallReturn<GetGoalByIdReturn>, Error, T>, 'queryKey' | 'queryFn'> {
  goalId: string,
}

export type UseGetGoalByIdReturn<T = HttpCallReturn<GetGoalByIdReturn>> = UseQueryResult<T, Error>;

export const useGetGoalById = <T = HttpCallReturn<GetGoalByIdReturn>>({
  goalId,
  ...options
}: UseGetGoalByIdParams<T>): UseQueryResult<T, Error> => useQuery({
    queryKey: goalKeys.detail(goalId),
    queryFn: () => getGoalById({ goalId }),
    ...options,
  });
