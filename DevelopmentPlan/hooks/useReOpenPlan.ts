import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { PDP } from '~DevelopmentPlan/const/types';

interface ReOpenPlanProps {
  id: string,
}

const reOpenPlan = ({ id }: ReOpenPlanProps): Promise<HttpCallReturn<PDP>> => {
  const url = {
    url: `/developmentplans/${id}/reOpen`,
  };

  return postApi(url, {}, {});
};

export const useReOpenPlan = (): UseMutationResult<HttpCallReturn<unknown>, unknown, ReOpenPlanProps, void> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: reOpenPlan,
    onMutate: () => {
      toastId.current = toast.info('Reopening the plan...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error Reopening the plan. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: (_, variables) => {
      toast.update(toastId.current, {
        render: 'Successfully Reopened the plan.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.detail(variables.id) });
    },
  });

  return mutation;
};
