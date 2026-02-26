import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { deleteApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { Competency } from '~DevelopmentPlan/const/types';

interface DeleteResourceProps {
  id: string,
  resourceId: number,
  competencyId: number,
}

const deleteResource = ({ id, resourceId, competencyId }: DeleteResourceProps): Promise<HttpCallReturn<Competency>> => {
  const url = {
    url: `/developmentplans/${id}/competencies/${competencyId}/competencyResources/${resourceId}`,
  };
  return deleteApi(url, {}, {});
};

export const useDeleteResource = (): UseMutationResult<HttpCallReturn<Competency>, unknown, DeleteResourceProps> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: deleteResource,
    onMutate: () => {
      toastId.current = toast.info('Unlinking your resource...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error unlinking your resource. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: (_, variables) => {
      toast.update(toastId.current, {
        render: 'Successfully unlinked your resource.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.competencyResources(variables.id) });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.competencies(variables.id) });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.progressBar(variables.id) });
    },
  });

  return mutation;
};
