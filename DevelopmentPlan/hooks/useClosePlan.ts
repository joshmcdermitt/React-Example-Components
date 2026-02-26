import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { Competency } from '~DevelopmentPlan/const/types';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';

interface ClosePlanProps {
  id: string,
}

const closePlan = ({ id }: ClosePlanProps): Promise<HttpCallReturn<Competency>> => {
  const url = {
    url: `/developmentplans/${id}/close`,
  };

  return postApi(url, {});
};

export const useClosePlan = (): UseMutationResult<HttpCallReturn<Competency>, unknown, ClosePlanProps, void> => {
  const toastId = useRef<ToastId>(null);
  const history = useHistory();
  const mutation = useMutation({
    mutationFn: closePlan,
    onMutate: () => {
      toastId.current = toast.info('Closing your plan...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error closing your plan. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: (_, variables) => {
      toast.update(toastId.current, {
        render: 'Successfully closed your plan.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.detail(variables.id) });
      history.push(DevelopmentPlanRoutes.Dashboard);
    },
  });

  return mutation;
};
