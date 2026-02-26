/* eslint-disable indent */
import {
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import { Goals } from '@josh-hr/types';
import { HttpCallReturn, JoshURL, postApi } from '~Deprecated/services/HttpService';
import { goalKeys } from '../const/queryKeys';

export type GetGoalsReturn = Goals.Responses.GetGoalsV4Response['data'];

const getGoals = (payload: Goals.Requests.GetGoalsRequestBody): Promise<HttpCallReturn<GetGoalsReturn>> => {
  const url: JoshURL = {
    version: 4,
    url: '/goals',
  };

  return postApi<GetGoalsReturn>(url, payload);
};

export const useGetGoals = (payload: Goals.Requests.GetGoalsRequestBody, enableCascadingGoals: boolean):
  UseQueryResult<HttpCallReturn<GetGoalsReturn>> => useQuery({
    queryKey: [...goalKeys.list(payload), 'non-cascading'],
    queryFn: () => getGoals(payload),
    placeholderData: keepPreviousData,
    enabled: !enableCascadingGoals,
  });
