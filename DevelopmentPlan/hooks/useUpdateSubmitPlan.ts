import { useRef } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HttpCallReturn, patchApi } from '~Deprecated/services/HttpService';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { PDP } from '~DevelopmentPlan/const/types';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { useHistory } from 'react-router-dom';
import { ToastId } from '~Common/types';

interface updatePlanProps {
  id: string,
}

const updatePlan = ({ id } : updatePlanProps): Promise<HttpCallReturn<PDP>> => {
  const serverUrl = {
    url: `/developmentplans/${id}/submit`,
  };

  return patchApi<PDP>(serverUrl, {}, {});
};

export const useUpdateSubmitPlan = (): UseMutationResult<HttpCallReturn<PDP>, unknown, updatePlanProps, void> => {
  const toastId = useRef<ToastId>(null);
  const history = useHistory();

  const mutation = useMutation({
    mutationFn: updatePlan,
    onMutate: () => {
      toastId.current = toast.info('Updating your personal development plan for review...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error updating your personal development plan. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: async (data) => {
      toast.update(toastId.current, {
        render: 'Successfully updated your personal development plan for review.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      await queryClient.invalidateQueries({ queryKey: pdpPlanKeys.all });
      history.push(DevelopmentPlanRoutes.ViewById.replace(':pdpId', data.response.id.toString()));
    },
  });

  return mutation;
};
