import {
  UseQueryOptions, UseQueryResult, useQuery,
} from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { Goals } from '@josh-hr/types';
import { getOrganizationId } from '~Common/utils/localStorage';
import { buildQueryString } from '~Common/utils';
import { goalKeys } from '../const/queryKeys';

type GetGoalsForCoachingReturn = Goals.Responses.GetGoalsForOneOnOneMeetingResponse['data'];

const getGoalsForCoaching = async ({
  meetingFactoryId,
  queryParameters,
}: Goals.Requests.GetGoalsForOneOnOneMeetingRequest): Promise<HttpCallReturn<GetGoalsForCoachingReturn>> => {
  const queryParams = buildQueryString(queryParameters ?? {});

  const url = {
    version: 3,
    url: `/goals/coachings/${meetingFactoryId}${queryParams}`,
  };

  return getApi<GetGoalsForCoachingReturn>(url);
};

type UseGetGoalsForCoachingProps<T> = Omit<UseQueryOptions<HttpCallReturn<GetGoalsForCoachingReturn>, Error, T>, 'queryKey' | 'queryFn'> &
  Omit<Goals.Requests.GetGoalsForOneOnOneMeetingRequest, 'organizationId'>;

export const useGetGoalsForCoaching = <T = HttpCallReturn<GetGoalsForCoachingReturn>>({
  meetingFactoryId,
  queryParameters,
  ...options
}: UseGetGoalsForCoachingProps<T>): UseQueryResult<T, Error> => {
  const organizationId = getOrganizationId() ?? '';

  return useQuery({
    queryKey: goalKeys.forCoaching(meetingFactoryId, queryParameters),
    queryFn: () => getGoalsForCoaching({ meetingFactoryId, organizationId, queryParameters }),
    enabled: !!meetingFactoryId,
    ...options,
  });
};
