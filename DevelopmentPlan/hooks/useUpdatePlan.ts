import { useRef } from 'react';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { HttpCallReturn, patchApi } from '~Deprecated/services/HttpService';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { PDP } from '~DevelopmentPlan/const/types';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { CreatePlanDTO } from '~DevelopmentPlan/schemata/createPlanSchemata';
import { ToastId } from '~Common/types';

interface updatePlanProps {
  plan: CreatePlanDTO,
  id: string,
}

const updatePlan = ({ plan, id }: updatePlanProps): Promise<HttpCallReturn<PDP>> => {
  const serverUrl = {
    url: `/developmentplans/${id}`,
  };

  return patchApi<PDP>(serverUrl, { ...plan }, {});
};

export const useUpdatePlan = (): UseMutationResult<HttpCallReturn<PDP>, unknown, updatePlanProps, void> => {
  const toastId = useRef<ToastId>(null);

  const mutation = useMutation({
    mutationFn: updatePlan,
    onMutate: () => {
      toastId.current = toast.info('Updating the plan....', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'The updates to the plan failed.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: async (_, variables) => {
      toast.update(toastId.current, {
        render: 'The plan was successfully updated.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      await queryClient.invalidateQueries({ queryKey: pdpPlanKeys.detail(variables.id) });
    },
  });

  return mutation;
};
