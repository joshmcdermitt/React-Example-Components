import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { ProgressBar } from '~DevelopmentPlan/const/types';
import { pdpPlanKeys } from '../const/queryKeys';

interface GetProgressBarProps {
  id: string,
}

const getProgressBar = ({ id }: GetProgressBarProps): Promise<HttpCallReturn<ProgressBar>> => {
  const url = {
    url: `/developmentplans/${id}/progress`,
  };

  return getApi<ProgressBar>(url);
};

interface useGetProgressBarProps {
  queryKey?: string[],
  id: string,
}

interface useGetProgressBarReturnProps {
  data: ProgressBar | undefined,
  isLoading: boolean,
  isFetching: boolean,
  isError: boolean,
}

export const useGetProgressBar = ({ id }: useGetProgressBarProps): useGetProgressBarReturnProps => {
  const result = useQuery({
    queryKey: pdpPlanKeys.progressBar(id),
    queryFn: () => getProgressBar({ id }),
    enabled: !!id,
    placeholderData: keepPreviousData,
  });

  return {
    isLoading: result?.isLoading,
    isFetching: result?.isFetching,
    isError: result?.isError,
    data: result?.data?.response,
  };
};
