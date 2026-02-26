import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { deleteApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { Competency } from '~DevelopmentPlan/const/types';

interface DeleteCompetencyProps {
  id: string,
  competencyId: string,
}

const deleteCompetency = ({ id, competencyId }: DeleteCompetencyProps): Promise<HttpCallReturn<Competency>> => {
  const url = {
    url: `/developmentplans/${id}/competencies/${competencyId}`,
  };

  return deleteApi(url);
};

export const useDeleteCompetency = (): UseMutationResult<HttpCallReturn<Competency>, unknown, DeleteCompetencyProps, void> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: deleteCompetency,
    onMutate: () => {
      toastId.current = toast.info('Deleting your competency...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error deleting your competency. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: (_, variables) => {
      toast.update(toastId.current, {
        render: 'Successfully deleted your competency.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.competencies(variables.id) });
    },
  });

  return mutation;
};
