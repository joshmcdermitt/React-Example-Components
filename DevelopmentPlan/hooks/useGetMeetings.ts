import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { GetMeetingsParams, Meeting } from '~DevelopmentPlan/const/types';
import { buildQueryString } from '~Common/utils';
import { pdpPlanKeys } from '../const/queryKeys';

interface GetCmpetencyResourcesProps {
  params: GetMeetingsParams,
}

const getMeetings = ({ params }: GetCmpetencyResourcesProps): Promise<HttpCallReturn<Meeting[]>> => {
  const queryString = buildQueryString(params);

  const serverUrl = {
    version: 2,
    url: `/huddles/inDateRange${queryString ?? ''}`,
  };

  return getApi<Meeting[]>(serverUrl);
};

interface useGetMeetingsProps {
  queryKey?: string[],
  id: string,
  params: GetMeetingsParams,
}

interface useGetMeetingsReturnProps {
  data: HttpCallReturn<Meeting[]> | undefined,
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean;
}

export const useGetMeetings = ({ id, params }: useGetMeetingsProps): useGetMeetingsReturnProps => {
  const result = useQuery({
    queryKey: pdpPlanKeys.meetings(id, params),
    queryFn: () => getMeetings({ params }),
    placeholderData: keepPreviousData,
  });

  return {
    isLoading: result?.isLoading,
    isError: result?.isError,
    data: result?.data,
    isFetching: result.isFetching,
  };
};
