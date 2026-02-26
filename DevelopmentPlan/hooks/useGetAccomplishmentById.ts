import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { Accomplishment } from '~DevelopmentPlan/const/types';
import { OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { pdpPlanKeys } from '../const/queryKeys';

interface GetAccomplishmentByIdProps {
  id: string,
}

const getPlanById = ({ id }: GetAccomplishmentByIdProps): Promise<HttpCallReturn<Accomplishment>> => {
  const url = {
    url: `/accomplishments/${id}`,
  };

  return getApi<Accomplishment>(url);
};

interface UseGetAccomplishmentByIdProps<T> extends Omit<UseQueryOptions<HttpCallReturn<Accomplishment>, Error, T>, 'queryKey' | 'queryFn'> {
  id: string,
}

export const useGetAccomplishmentById = <T = HttpCallReturn<Accomplishment>> ({
  id,
  ...options
}: UseGetAccomplishmentByIdProps<T>): UseQueryResult<T, Error> => useQuery({
    queryKey: pdpPlanKeys.detail(id),
    queryFn: () => getPlanById({ id }),
    enabled: !!id && id !== OPTIMISTIC_ID.toString(),
    ...options,
  });
