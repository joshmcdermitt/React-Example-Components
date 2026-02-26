import { Goals } from '@josh-hr/types';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { goalKeys } from '~Goals/const/queryKeys';

type GetMeasurementScaleTypesReturn = Goals.MeasurementScaleType[];

const getMeasurementScaleTypes = async (): Promise<HttpCallReturn<GetMeasurementScaleTypesReturn>> => {
  const url = {
    url: '/goals/scaleTypes',
    version: 3,
  };

  return getApi<GetMeasurementScaleTypesReturn>(url);
};

type UseGetMeasurementScaleTypesParams<T> = Omit<UseQueryOptions<HttpCallReturn<GetMeasurementScaleTypesReturn>, Error, T>, 'queryKey' | 'queryFn'>

export const useGetMeasurementScaleTypes = <T = HttpCallReturn<GetMeasurementScaleTypesReturn>>({
  ...options
}: UseGetMeasurementScaleTypesParams<T> = {}): UseQueryResult<T, Error> => useQuery({
    queryKey: goalKeys.scaleTypes(),
    queryFn: getMeasurementScaleTypes,
    staleTime: Infinity,
    ...options,
  });
