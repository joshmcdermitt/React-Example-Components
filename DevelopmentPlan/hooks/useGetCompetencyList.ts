import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import {
  Competency,
} from '~DevelopmentPlan/const/types';
import { pdpPlanKeys } from '../const/queryKeys';

interface GetCompetencyListProps {
  id: string,
}

const getCompetencyList = ({ id }: GetCompetencyListProps): Promise<HttpCallReturn<Competency[]>> => {
  const url = {
    url: `/developmentplans/${id}/competencies`,
  };

  return getApi<Competency[]>(url);
};

interface useGetCompentencyProps {
  queryKey?: string[],
  id: string,
}

interface useGetCompentencyReturnProps {
  data: HttpCallReturn<Competency[]> | undefined,
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean;
}

export const useGetCompetencyList = ({ id }: useGetCompentencyProps): useGetCompentencyReturnProps => {
  const result = useQuery({
    queryKey: pdpPlanKeys.competencies(id),
    queryFn: () => getCompetencyList({ id }),
    placeholderData: keepPreviousData,

  });

  return {
    isLoading: result?.isLoading,
    isError: result?.isError,
    data: result?.data,
    isFetching: result.isFetching,
  };
};
