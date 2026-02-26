import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { Competency } from '~DevelopmentPlan/const/types';

interface CompletePlanProps {
  id: string,
}

const completePlan = ({ id }: CompletePlanProps): Promise<HttpCallReturn<Competency>> => {
  const url = {
    url: `/developmentplans/${id}/complete`,
  };

  return postApi(url, {});
};

export const useCompletePlan = (): UseMutationResult<HttpCallReturn<Competency>, unknown, CompletePlanProps, void> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: completePlan,
    onMutate: () => {
      toastId.current = toast.info('Completing the plan...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error completing the plan. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: (_, variables) => {
      toast.update(toastId.current, {
        render: 'Successfully completed the plan.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.detail(variables.id) });
    },
  });

  return mutation;
};
