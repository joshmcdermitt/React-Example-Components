import { useQuery } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { Comment } from '~DevelopmentPlan/const/types';
import { pdpPlanKeys } from '../const/queryKeys';

interface GetCommentsProps {
  id: string,
}

const getComments = ({ id }: GetCommentsProps): Promise<HttpCallReturn<Comment[]>> => {
  const url = {
    url: `/developmentplans/${id}/comments`,
  };

  return getApi<Comment[]>(url);
};

interface useGetCommentsProps {
  queryKey?: string[],
  id: string,
}

interface useGetCommentsReturnProps {
  data: Comment[] | undefined,
  isLoading: boolean,
  isError: boolean,
}

export const useGetComments = ({ id }: useGetCommentsProps): useGetCommentsReturnProps => {
  const result = useQuery({
    queryKey: pdpPlanKeys.comments(id),
    queryFn: () => getComments({ id }),
  });

  return {
    isLoading: result?.isLoading,
    isError: result?.isError,
    data: result?.data?.response,
  };
};
