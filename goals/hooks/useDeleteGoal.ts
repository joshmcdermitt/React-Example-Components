import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { getOrganizationId } from '~Common/utils/localStorage';
import { deleteApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { homeQueryKeys } from '~Home/hooks/queryKeys';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { goalKeys } from '../const/queryKeys';

interface DeleteGoalProps {
  goalId: string,
}

const deleteGoal = ({ goalId }: DeleteGoalProps): Promise<HttpCallReturn<string>> => {
  const serverUrl = {
    version: 3,
    url: `/goals/${goalId}`,
  };

  return deleteApi<string>(serverUrl);
};

type UseDeleteGoalParams = Omit<
  UseMutationOptions<HttpCallReturn<string>, Error, DeleteGoalProps>, 'mutationFn'
>;

export const useDeleteGoal = ({
  ...options
}: UseDeleteGoalParams = {}): UseMutationResult<HttpCallReturn<string>, Error, DeleteGoalProps> => {
  const { featureNamesText } = useGetFeatureNamesText();
  const toastId = useRef<ToastId>(null);

  return useMutation({
    mutationFn: deleteGoal,
    onMutate: () => {
      toastId.current = toast.info(`Deleting your ${featureNamesText.goals.singular.toLowerCase()}...`, { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: `There was an error deleting your ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: `Successfully deleted your ${featureNamesText.goals.singular.toLowerCase()}.`,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      void queryClient.invalidateQueries({ queryKey: goalKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.all });
      void queryClient.invalidateQueries({ queryKey: homeQueryKeys.homeGoals(getOrganizationId() ?? '') });
      void queryClient.invalidateQueries({ queryKey: goalKeys.performanceSnapshots(), refetchType: 'active' });
    },
    ...options,
  });
};
