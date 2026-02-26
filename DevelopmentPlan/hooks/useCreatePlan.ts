import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { PDP } from '~DevelopmentPlan/const/types';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { CreatePlanDTO } from '~DevelopmentPlan/schemata/createPlanSchemata';

interface createPlanProps {
  plan: CreatePlanDTO,
}

const createPlan = ({ plan }: createPlanProps): Promise<HttpCallReturn<PDP>> => {
  const serverUrl = {
    url: '/developmentplans',
  };

  return postApi<PDP>(serverUrl, plan, {});
};

export const useCreatePlan = (): UseMutationResult<HttpCallReturn<PDP>, unknown, createPlanProps, void> => {
  const toastId = useRef<ToastId>(null);
  const history = useHistory();

  const mutation = useMutation({
    mutationFn: createPlan,
    onMutate: () => {
      toastId.current = toast.info('Creating your personal development plan...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error creating your personal development plan. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: async (data) => {
      toast.update(toastId.current, {
        render: 'Successfully created your personal development plan.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      const pdpId = data.response.id.toString();
      // Wanted to add a check here to stop a potentioal error if the id is not returned
      if (pdpId) {
        const continueToCreateURL = DevelopmentPlanRoutes.ContinueToCreate.replace(':pdpId', pdpId);
        history.push(continueToCreateURL);
      } else {
        toast.update(toastId.current, {
          render: 'There seemed to be a problem recieving your PDP information. Please use the dashboard to access your PDP to continue.',
          type: toast.TYPE.ERROR,
          autoClose: 5000,
        });
        history.push(DevelopmentPlanRoutes.MyPlans);
      }
      await queryClient.invalidateQueries({ queryKey: pdpPlanKeys.all });
    },
  });

  return mutation;
};
