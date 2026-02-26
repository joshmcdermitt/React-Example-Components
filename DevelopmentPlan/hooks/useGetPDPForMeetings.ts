import { useQuery } from '@tanstack/react-query';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { BasicPdp } from '~DevelopmentPlan/const/types';
import { pdpPlanKeys } from '../const/queryKeys';

interface PDPForMeetingsProps {
  id: string,
}

const getPDPForMeetings = ({ id }: PDPForMeetingsProps): Promise<HttpCallReturn<BasicPdp[]>> => {
  const user = {
    otherUserId: id,
  };
  const url = {
    url: '/developmentplans/OneOnOne',
  };

  return postApi<BasicPdp[]>(url, user, {});
};

interface useGetPDPForMeetingsProps {
  id: string,
}

interface useGetPDPForMeetingsReturnProps {
  data: BasicPdp[] | undefined,
  isLoading: boolean,
  isError: boolean,
}

export const useGetPDPForMeetings = ({ id }: useGetPDPForMeetingsProps): useGetPDPForMeetingsReturnProps => {
  const result = useQuery({
    queryKey: pdpPlanKeys.oneOnOneMeetings(id),
    queryFn: () => getPDPForMeetings({ id }),
    enabled: !!id,
  });

  return {
    isLoading: result?.isLoading,
    isError: result?.isError,
    data: result?.data?.response,
  };
};
