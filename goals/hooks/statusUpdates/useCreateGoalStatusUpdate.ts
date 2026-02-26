import { Goals } from '@josh-hr/types';
import {
  useMutation, UseMutationOptions, UseMutationResult,
} from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { getOrganizationId } from '~Common/utils/localStorage';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { homeQueryKeys } from '~Home/hooks/queryKeys';
import { useDraft } from '~Common/hooks/useDraft';
import { goalKeys } from '~Goals/const/queryKeys';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { ToastId } from '~Common/types';

interface CreateStatusUpdateProps {
  goalId: string,
  statusUpdate: Goals.Requests.CreateGoalStatusUpdateRequestPayload,
}

const createStatusUpdate = ({
  goalId,
  statusUpdate,
}: CreateStatusUpdateProps): Promise<HttpCallReturn<string>> => {
  const serverUrl = {
    version: 3,
    url: `/goals/${goalId}/status`,
  };

  return postApi<string>(serverUrl, statusUpdate);
};

interface UseCreateStatusUpdateParams extends Omit<UseMutationOptions<HttpCallReturn<string>, Error, CreateStatusUpdateProps>, 'mutationFn'> {
  draftKey?: string[],
}

export const useCreateGoalStatusUpdate = ({
  draftKey,
  ...options
}: UseCreateStatusUpdateParams): UseMutationResult<HttpCallReturn<string>, Error, CreateStatusUpdateProps> => {
  const toastId = useRef<ToastId>(null);
  const { removeDraft } = useDraft(draftKey);
  const { featureNamesText } = useGetFeatureNamesText();

  return useMutation({
    mutationFn: createStatusUpdate,
    onMutate: () => {
      toastId.current = toast.info(`Updating your ${featureNamesText.goals.singular.toLowerCase()} status...`, { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error creating your status update. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: async (_, { goalId }) => {
      toast.update(toastId.current, {
        render: 'Successfully updated status.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      removeDraft();
      await queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId), refetchType: 'active' });
      void queryClient.invalidateQueries({ queryKey: goalKeys.all, refetchType: 'active' });
      void queryClient.invalidateQueries({
        queryKey: goalKeys.lists(),
        refetchType: 'all',
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.all, refetchType: 'active' });
      void queryClient.invalidateQueries({ queryKey: homeQueryKeys.homeGoals(getOrganizationId() ?? ''), refetchType: 'none' });
      void queryClient.invalidateQueries({ queryKey: goalKeys.performanceSnapshots(), refetchType: 'active' });
    },
    ...options,
  });
};
