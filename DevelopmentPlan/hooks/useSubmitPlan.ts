import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import {
  PDP,
} from '~DevelopmentPlan/const/types';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';

interface submitPlanProps {
  id: string,
}

const submitPlan = ({ id } : submitPlanProps): Promise<HttpCallReturn<PDP>> => {
  const serverUrl = {
    url: `/developmentplans/${id}/submit`,
  };

  return postApi<PDP>(serverUrl, { }, {});
};

export const useSubmitPlan = (): UseMutationResult<HttpCallReturn<PDP>, unknown, submitPlanProps> => {
  const toastId = useRef<ToastId>(null);
  const history = useHistory();

  const mutation = useMutation({
    mutationFn: submitPlan,
    onMutate: () => {
      toastId.current = toast.info('Submitting your personal development plan for review...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error submitting your personal development plan. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: async (data) => {
      toast.update(toastId.current, {
        render: 'Successfully submitted your personal development plan for review.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      await queryClient.invalidateQueries({ queryKey: pdpPlanKeys.all });
      history.push(DevelopmentPlanRoutes.ViewById.replace(':pdpId', data.response.id.toString()));
    },
  });

  return mutation;
};
