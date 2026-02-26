import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { getOrganizationId } from '~Common/utils/localStorage';
import { CompetencyResource, GetCompetencyResourceSearchParams } from '~DevelopmentPlan/const/types';
import { buildQueryString } from '~Common/utils';
import { pdpPlanKeys } from '../const/queryKeys';

interface GetCmpetencyResourcesProps {
  id: string,
  params: GetCompetencyResourceSearchParams,
}

const getCompetencyResources = ({ id, params }: GetCmpetencyResourcesProps): Promise<HttpCallReturn<CompetencyResource[]>> => {
  const queryString = buildQueryString(params);
  const url = {
    url: `/organizations/${getOrganizationId() ?? ''}/developmentplans/${id}/competencyresources${queryString ?? ''}`,
  };

  return getApi<CompetencyResource[]>(url);
};

interface useGetCompentencyResourcesProps {
  queryKey?: string[],
  id: string,
  params: GetCompetencyResourceSearchParams,
}

interface useGetCompentencyResourcesReturnProps {
  data: HttpCallReturn<CompetencyResource[]> | undefined,
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean;
}

export const useGetCompetencyResources = ({ id, params }: useGetCompentencyResourcesProps): useGetCompentencyResourcesReturnProps => {
  const result = useQuery({
    queryKey: pdpPlanKeys.competencyResources(id, params),
    queryFn: () => getCompetencyResources({ id, params }),
    placeholderData: keepPreviousData,
  });

  return {
    isLoading: result?.isLoading,
    isError: result?.isError,
    data: result?.data,
    isFetching: result.isFetching,
  };
};
