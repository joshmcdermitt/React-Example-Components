import {
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import { Goals } from '@josh-hr/types';
import { postApi } from '~Common/utils/http';
import { goalKeys } from '../const/queryKeys';

interface GetPerformanceSnapshotResponse {
  data: Goals.PerformanceSnapshotItem[];
}

const getPerformanceSnapshot = async (
  payload: Goals.Requests.GetPerformanceSnapshotRequestBody,
): Promise<Goals.PerformanceSnapshotItem[]> => {
  const serverUrl = {
    version: 4,
    url: '/goals/performanceSnapshot',
  };

  const response = await postApi<GetPerformanceSnapshotResponse>(serverUrl, payload);

  if (!response.ok) {
    throw response.error;
  }

  return response.value.data;
};

export const useGetPerformanceSnapshot = (
  payload: Goals.Requests.GetGoalsRequestBody,
  enableCascadingGoals: boolean,
): UseQueryResult<Goals.PerformanceSnapshotItem[]> => {
  // Transform payload to match GetPerformanceSnapshotRequestBody
  const snapshotPayload: Goals.Requests.GetPerformanceSnapshotRequestBody = {
    ...payload,
    cascading: !!enableCascadingGoals,
  };

  return useQuery({
    queryKey: [...goalKeys.performanceSnapshot(snapshotPayload)] as const,
    queryFn: () => getPerformanceSnapshot(snapshotPayload),
    placeholderData: keepPreviousData,
    enabled: !!payload,
  });
};
