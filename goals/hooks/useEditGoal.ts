import { Goals } from '@josh-hr/types';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, patchApi } from '~Deprecated/services/HttpService';
import { goalKeys } from '~Goals/const/queryKeys';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';

export interface EditGoalParams {
  payload: Goals.Requests.UpdateGoalRequestPayload,
  goalId: string,
}

const createGoal = ({ payload, goalId }: EditGoalParams): Promise<HttpCallReturn<string>> => {
  const serverUrl = {
    version: 3,
    url: `/goals/${goalId}`,
  };

  return patchApi<string>(serverUrl, { ...payload }, {});
};

type UseEditGoalParams = Omit<
  UseMutationOptions<HttpCallReturn<string>, Error, EditGoalParams>, 'mutationFn'
>;

export const useEditGoal = ({
  ...options
}: UseEditGoalParams = {}): UseMutationResult<HttpCallReturn<string>, unknown, EditGoalParams> => {
  const toastId = useRef<ToastId>(null);
  const { featureNamesText } = useGetFeatureNamesText();

  return useMutation({
    mutationFn: createGoal,
    onMutate: () => {
      toastId.current = toast.info(`Editing your ${featureNamesText.goals.singular.toLowerCase()}...`, { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: `There was an error editing your ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: `Successfully edited your ${featureNamesText.goals.singular.toLowerCase()}.`,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: goalKeys.performanceSnapshots(), refetchType: 'active' });
    },
    ...options,
  });
};
