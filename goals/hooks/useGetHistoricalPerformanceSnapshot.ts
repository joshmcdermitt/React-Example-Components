import {
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import { Goals } from '@josh-hr/types';
import { HttpCallReturn, JoshURL, postApi } from '~Deprecated/services/HttpService';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import { goalKeys } from '../const/queryKeys';

const getHistoricalPerformanceSnapshot = (
  payload: Goals.Requests.GetPerformanceSnapshotRequestBody,
): Promise<HttpCallReturn<Goals.PerformanceSnapshotItem[]>> => {
  const url: JoshURL = {
    version: 4,
    url: '/goals/historicalPerformanceSnapshot',
  };

  return postApi<Goals.PerformanceSnapshotItem[]>(url, payload);
};

export const useGetHistoricalPerformanceSnapshot = (
  payload: Goals.Requests.GetGoalsRequestBody,
  enableCascadingGoals: boolean,
): UseQueryResult<HttpCallReturn<Goals.PerformanceSnapshotItem[]>> => {
  const enableObjectivesPerformanceSnapshotHistory = useFeatureFlag('enableObjectivesPerformanceSnapshotHistory');

  // Transform payload to match GetPerformanceSnapshotRequestBody
  const snapshotPayload: Goals.Requests.GetPerformanceSnapshotRequestBody = {
    ...payload,
    cascading: !!enableCascadingGoals,
  };

  return useQuery({
    queryKey: [...goalKeys.historicalPerformanceSnapshot(snapshotPayload)] as const,
    queryFn: () => getHistoricalPerformanceSnapshot(snapshotPayload),
    placeholderData: keepPreviousData,
    enabled: !!payload && enableObjectivesPerformanceSnapshotHistory,
  });
};
