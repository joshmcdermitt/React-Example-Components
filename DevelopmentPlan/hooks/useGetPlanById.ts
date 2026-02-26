import { useQuery } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { getOrganizationId } from '~Common/utils/localStorage';
import { PDP } from '~DevelopmentPlan/const/types';
import { pdpPlanKeys } from '../const/queryKeys';

interface GetPlanByIdProps {
  id: string,
}

const getPlanById = ({ id }: GetPlanByIdProps): Promise<HttpCallReturn<PDP>> => {
  const url = {
    url: `/organizations/${getOrganizationId() ?? ''}/developmentplans/${id}`,
  };

  return getApi<PDP>(url);
};

interface useGetPlanByIdProps {
  queryKey?: string[],
  id: string,
}

interface useGetPlanByIdReturnProps {
  data: PDP | undefined,
  isLoading: boolean,
  isError: boolean,
}

export const useGetPlanById = ({ id }: useGetPlanByIdProps): useGetPlanByIdReturnProps => {
  const result = useQuery({
    queryKey: pdpPlanKeys.detail(id),
    queryFn: () => getPlanById({ id }),
    enabled: !!id,
  });

  return {
    isLoading: result?.isLoading,
    isError: result?.isError,
    data: result?.data?.response,
  };
};
