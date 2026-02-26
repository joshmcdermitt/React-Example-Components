import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { deleteApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';

interface DeletePlanProps {
  id: string,
}

const createComment = ({ id }: DeletePlanProps): Promise<HttpCallReturn<unknown>> => {
  const url = {
    url: `/developmentplans/${id}`,
  };

  return deleteApi(url);
};

export const useDeletePlan = (): UseMutationResult<HttpCallReturn<unknown>, unknown, DeletePlanProps, void> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: createComment,
    onMutate: () => {
      toastId.current = toast.info('Deleting your plan...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error deleting your plan. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: 'Successfully deleted your plan.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.lists() });
    },
  });

  return mutation;
};
