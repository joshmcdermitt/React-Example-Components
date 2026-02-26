import { useQuery } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { getOrganizationId } from '~Common/utils/localStorage';
import { Comment } from '~DevelopmentPlan/const/types';
import { pdpPlanKeys } from '../const/queryKeys';

interface GetFinalThoughtsProps {
  id: string,
}

const getFinalThoughts = ({ id }: GetFinalThoughtsProps): Promise<HttpCallReturn<Comment[]>> => {
  const url = {
    url: `/organizations/${getOrganizationId() ?? ''}/developmentplans/${id}/finalThoughts`,
  };

  return getApi<Comment[]>(url);
};

interface useGetFinalThoughtsProps {
  queryKey?: string[],
  id: string,
}

interface useGetFinalThoughtsReturnProps {
  data: Comment[] | undefined,
  isLoading: boolean,
  isError: boolean,
}

export const useGetFinalThoughts = ({ id }: useGetFinalThoughtsProps): useGetFinalThoughtsReturnProps => {
  const result = useQuery({
    queryKey: pdpPlanKeys.finalThoughts(id),
    queryFn: () => getFinalThoughts({ id }),
    enabled: !!id,
  });

  return {
    isLoading: result?.isLoading,
    isError: result?.isError,
    data: result?.data?.response,
  };
};
