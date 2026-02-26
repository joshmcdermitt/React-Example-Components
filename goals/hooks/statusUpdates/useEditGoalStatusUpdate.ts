import { Goals } from '@josh-hr/types';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { useDraft } from '~Common/hooks/useDraft';
import { getOrganizationId } from '~Common/utils/localStorage';
import { HttpCallReturn, patchApi } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { goalKeys } from '~Goals/const/queryKeys';
import { homeQueryKeys } from '~Home/hooks/queryKeys';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';

type EditGoalStatusUpdateParams = Omit<Goals.Requests.UpdateGoalStatusRequest, 'organizationId'>;

type EditGoalStatusUpdateReturn = Goals.Responses.UpdateGoalStatusResponse;

const editGoalStatusUpdate = async ({
  goalId,
  statusId,
  payload,
}: EditGoalStatusUpdateParams): Promise<HttpCallReturn<EditGoalStatusUpdateReturn>> => {
  const serverUrl = {
    version: 3,
    url: `/goals/${goalId}/status/${statusId}`,
  };

  return patchApi<EditGoalStatusUpdateReturn>(serverUrl, payload);
};

interface useEditGoalStatusUpdateParams extends Omit<
  UseMutationOptions<HttpCallReturn<EditGoalStatusUpdateReturn>, Error, EditGoalStatusUpdateParams>, 'mutationFn'
> {
  draftKey?: string[],
}

export const useEditGoalStatusUpdate = ({
  draftKey,
  ...options
}: useEditGoalStatusUpdateParams): UseMutationResult<HttpCallReturn<EditGoalStatusUpdateReturn>, Error, EditGoalStatusUpdateParams> => {
  const toastId = useRef<string | number | null>(null);
  const { removeDraft } = useDraft(draftKey);
  const { featureNamesText } = useGetFeatureNamesText();

  return useMutation({
    mutationFn: editGoalStatusUpdate,
    onMutate: () => {
      toastId.current = toast.info(`Editing your ${featureNamesText.goals.singular.toLowerCase()} status...`, { autoClose: false });
    },
    onSuccess: async (_, { goalId }) => {
      toast.update(toastId.current, {
        render: `Successfully updated your ${featureNamesText.goals.singular.toLowerCase()} status.`,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      removeDraft();
      await queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId), refetchType: 'active' });
      void queryClient.invalidateQueries({
        queryKey: goalKeys.lists(),
        refetchType: 'all',
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.all, refetchType: 'none' });
      void queryClient.invalidateQueries({ queryKey: homeQueryKeys.homeGoals(getOrganizationId() ?? ''), refetchType: 'none' });
      void queryClient.invalidateQueries({ queryKey: goalKeys.performanceSnapshots(), refetchType: 'active' });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: `There was an error editing your ${featureNamesText.goals.singular.toLowerCase()} status. Please try again.`,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    ...options,
  });
};
