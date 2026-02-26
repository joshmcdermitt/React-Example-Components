import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { patchApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { Competency } from '~DevelopmentPlan/const/types';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { CreateCompetencyDTO } from '~DevelopmentPlan/schemata/createCompetencySchemata';
import { queryClient } from '~Common/const/queryClient';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { DEFAULT_USER, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { produce } from 'immer';
import { ToastId } from '~Common/types';

export interface UpdateCompetencyProps {
  id: string,
  competency: CreateCompetencyDTO,
  competencyId: number,
}

const updateCompetency = ({ id, competency, competencyId }: UpdateCompetencyProps): Promise<HttpCallReturn<Competency>> => {
  const url = {
    url: `/developmentplans/${id}/competencies/${competencyId.toString()}`,
  };

  return patchApi(url, competency, {});
};

export const useUpdateCompetency = (): UseMutationResult<HttpCallReturn<Competency>, unknown, UpdateCompetencyProps> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: updateCompetency,
    onMutate: async (updatedCompetency: UpdateCompetencyProps) => {
      const pdpId = updatedCompetency.id;
      const { competencyId } = updatedCompetency;
      toastId.current = toast.info('Updating your competency...', { autoClose: false });
      // Cancel any existing outbound queries
      await queryClient.cancelQueries({ queryKey: pdpPlanKeys.competencies(pdpId) });
      const previousReceivedCompetencyList = queryClient.getQueryData<HttpCallReturn<Competency[]>>(pdpPlanKeys.competencies(pdpId));
      // eslint-disable-next-line max-len
      const currentCompetency = previousReceivedCompetencyList?.response?.find((competency: Competency) => competency.id === competencyId);

      const commonCompetencyDetails = {
        id: OPTIMISTIC_ID,
        name: updatedCompetency.competency.name,
        description: updatedCompetency.competency.description,
        createdBy: currentCompetency?.createdBy ?? DEFAULT_USER,
        createdDate: currentCompetency?.createdDate ?? new Date(),
        isDeleted: currentCompetency?.isDeleted ?? false,
        modifiedDate: new Date(),
      };

      const newCreatedCompetency = {
        ...commonCompetencyDetails,
      };

      queryClient.setQueryData<HttpCallReturn<Competency[]>>(pdpPlanKeys.competencies(pdpId), (oldCreatedCompetencyList) => {
        if (oldCreatedCompetencyList) {
          return produce(oldCreatedCompetencyList, (draft) => {
            draft.response = draft.response.map((competency) => {
              if (competency.id === competencyId) {
                return newCreatedCompetency;
              }
              return competency;
            });
          });
        }

        return oldCreatedCompetencyList;
      });
      // Return a context object with the old snapshotted values used below
      return {
        previousReceivedCompetencyList,
      };
    },
    onError: (_, variables, snapshot) => {
      queryClient.setQueryData(pdpPlanKeys.competencies(variables.id), snapshot?.previousReceivedCompetencyList);

      toast.update(toastId.current, {
        render: 'There was an error updating your competency. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: 'Successfully updated your competency.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
    },
    onSettled: (_, __, { id: pdpId }) => {
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.competencies(pdpId) });
    },
  });

  return mutation;
};
