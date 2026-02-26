/* eslint-disable indent */
import {
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import { Goals } from '@josh-hr/types';
import { HttpCallReturn, JoshURL, postApi } from '~Deprecated/services/HttpService';
import { goalKeys } from '../const/queryKeys';

export type GetGoalsReturnCascading = Goals.Responses.GetCascadingGoalsResponse['data'];

const getGoalsCascading = (payload: Goals.Requests.GetGoalsRequestBody): Promise<HttpCallReturn<GetGoalsReturnCascading>> => {
  const url: JoshURL = {
    version: 4,
    url: '/goals/cascading',
  };

  return postApi<GetGoalsReturnCascading>(url, payload);
};

export const useGetGoalsCascading = (payload: Goals.Requests.GetGoalsRequestBody, enableCascadingGoals: boolean):
  UseQueryResult<HttpCallReturn<GetGoalsReturnCascading>> => useQuery({
    queryKey: [...goalKeys.list(payload), 'cascading'],
    queryFn: () => getGoalsCascading(payload),
    placeholderData: keepPreviousData,
    enabled: enableCascadingGoals,
  });
