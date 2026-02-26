import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { buildQueryString } from '~Common/utils';
import { getOrganizationId } from '~Common/utils/localStorage';
import { GetPDPSearchParams, PDPList } from '~DevelopmentPlan/const/types';
import { pdpPlanKeys } from '../const/queryKeys';

interface GetPlansProps {
  params: GetPDPSearchParams,
}
const getPdpPlans = async ({
  params,
}: GetPlansProps): Promise<HttpCallReturn<PDPList[]>> => {
  const queryString = buildQueryString(params);
  const url = {
    url: `/organizations/${getOrganizationId() ?? ''}/developmentplans/owned${queryString ?? ''}`,
  };

  return getApi<PDPList[]>(url);
};

interface UseGetGoalsProps {
  params: GetPDPSearchParams,
  enabled?: boolean,
}

interface useGetPlansReturnProps {
  isLoading: boolean;
  isError: boolean;
  data: HttpCallReturn<PDPList[]> | undefined;
  isFetching: boolean;
}

export const useGetMyPlans = ({
  params,
  enabled = true,
}: UseGetGoalsProps): useGetPlansReturnProps => {
  const result = useQuery({
    queryKey: pdpPlanKeys.list(params),
    queryFn: () => getPdpPlans({ params }),
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    isLoading: result?.isLoading,
    isError: result?.isError,
    data: result.data,
    isFetching: result.isFetching,
  };
};
