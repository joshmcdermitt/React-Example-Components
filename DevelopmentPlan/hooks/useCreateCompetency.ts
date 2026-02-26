import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { DEFAULT_USER, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { Competency } from '~DevelopmentPlan/const/types';
import { CreateCompetencyDTO } from '~DevelopmentPlan/schemata/createCompetencySchemata';

interface createCompetencyProps {
  pdpId: string,
  competency: CreateCompetencyDTO,
}

const createCompetency = ({ pdpId, competency }: createCompetencyProps): Promise<HttpCallReturn<Competency>> => {
  const url = {
    url: `/developmentplans/${pdpId}/competencies`,
  };

  return postApi(url, competency, {});
};

export const useCreateCompetency = (): UseMutationResult<HttpCallReturn<Competency>, unknown, createCompetencyProps, {
  previousReceivedCompetencyList: unknown;
}> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: createCompetency,
    onMutate: async ({ pdpId, competency }) => {
      toastId.current = toast.info('Creating your competency...', { autoClose: false });
      // Cancel any existing outbound queries
      await queryClient.cancelQueries({ queryKey: pdpPlanKeys.competencies(pdpId) });
      const previousReceivedCompetencyList = queryClient.getQueryData<HttpCallReturn<Competency[]>>(pdpPlanKeys.competencies(pdpId));

      const commonCompetencyDetails = {
        id: OPTIMISTIC_ID,
        name: competency.name,
        description: competency.description,
        createdBy: DEFAULT_USER,
        createdDate: new Date(),
        isDeleted: false,
        modifiedDate: new Date(),
      };

      const newCreatedCompetency = {
        ...commonCompetencyDetails,
      };

      queryClient.setQueryData<HttpCallReturn<Competency[]>>(pdpPlanKeys.competencies(pdpId), (oldCreatedCompetencyList) => {
        if (oldCreatedCompetencyList && oldCreatedCompetencyList.response?.length) {
          const newData = cloneDeep(oldCreatedCompetencyList);
          newData?.response.push(newCreatedCompetency);
          return newData;
        }

        return oldCreatedCompetencyList;
      });
      // Return a context object with the old snapshotted values used below
      return {
        previousReceivedCompetencyList,
      };
    },
    onError: (_, { pdpId }, snapshot) => {
      queryClient.setQueryData(pdpPlanKeys.competencies(pdpId), snapshot?.previousReceivedCompetencyList);
      toast.update(toastId.current, {
        render: 'There was an error creating your competency. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: 'Successfully created your competency.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
    },
    onSettled: (_, __, { pdpId }) => {
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.competencies(pdpId) });
    },
  });

  return mutation;
};
