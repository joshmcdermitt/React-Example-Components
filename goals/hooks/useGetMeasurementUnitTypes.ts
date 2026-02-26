import { Goals } from '@josh-hr/types';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { goalKeys } from '~Goals/const/queryKeys';

type GetMeasurementUnitTypesReturn = Goals.MeasurementUnit[];

const getMeasurementUnitTypes = async (): Promise<HttpCallReturn<GetMeasurementUnitTypesReturn>> => {
  const url = {
    url: '/goals/unitTypes',
    version: 3,
  };

  return getApi<GetMeasurementUnitTypesReturn>(url);
};

type UseGetMeasurementScaleTypesParams<T> = Omit<UseQueryOptions<HttpCallReturn<GetMeasurementUnitTypesReturn>, Error, T>, 'queryKey' | 'queryFn'>

export const useGetMeasurementUnitTypes = <T = HttpCallReturn<GetMeasurementUnitTypesReturn>>({
  ...options
}: UseGetMeasurementScaleTypesParams<T> = {}): UseQueryResult<T, Error> => useQuery({
    queryKey: goalKeys.unitTypes(),
    queryFn: getMeasurementUnitTypes,
    staleTime: Infinity,
    ...options,
  });
