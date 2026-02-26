import { Goals } from '@josh-hr/types';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { getOrganizationId } from '~Common/utils/localStorage';
import { HttpCallReturn, deleteApi } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { goalKeys } from '~Goals/const/queryKeys';
import { homeQueryKeys } from '~Home/hooks/queryKeys';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { GetGoalByIdReturn } from '../useGetGoalById';

type DeleteGoalStatusUpdateParams = Omit<Goals.Requests.DeleteGoalStatusRequest, 'organizationId'>;

type DeleteGoalStatusUpdateReturn = Goals.Responses.DeleteGoalStatusResponse;

const deleteGoalStatusUpdate = async ({
  goalId,
  statusId,
}: DeleteGoalStatusUpdateParams): Promise<HttpCallReturn<DeleteGoalStatusUpdateReturn>> => {
  const serverUrl = {
    version: 3,
    url: `/goals/${goalId}/status/${statusId}`,
  };

  return deleteApi<DeleteGoalStatusUpdateReturn>(serverUrl);
};

interface useDeleteGoalStatusUpdateParams extends Omit<
  UseMutationOptions<HttpCallReturn<DeleteGoalStatusUpdateReturn>, Error, DeleteGoalStatusUpdateParams>, 'mutationFn'
> {
  onSuccessCallback?: (updatedGoalData: HttpCallReturn<GetGoalByIdReturn>) => void;
}

export const useDeleteGoalStatusUpdate = ({
  onSuccessCallback,
  ...options
}: useDeleteGoalStatusUpdateParams = {}): UseMutationResult<HttpCallReturn<DeleteGoalStatusUpdateReturn>, Error, DeleteGoalStatusUpdateParams> => {
  const toastId = useRef<string | number | null>(null);
  const { featureNamesText } = useGetFeatureNamesText();

  return useMutation({
    mutationFn: deleteGoalStatusUpdate,
    onMutate: () => {
      toastId.current = toast.info(`Deleting your ${featureNamesText.goals.singular.toLowerCase()} status...`, { autoClose: false });
    },
    onSuccess: async (_, { goalId }) => {
      toast.update(toastId.current, {
        render: `Successfully deleted your ${featureNamesText.goals.singular.toLowerCase()} status.`,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      await queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId), refetchType: 'active' });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.all, refetchType: 'none' });
      void queryClient.invalidateQueries({ queryKey: homeQueryKeys.homeGoals(getOrganizationId() ?? ''), refetchType: 'none' });
      void queryClient.invalidateQueries({ queryKey: goalKeys.performanceSnapshots(), refetchType: 'active' });
      if (onSuccessCallback) {
        const updatedGoalData = queryClient.getQueryData<HttpCallReturn<GetGoalByIdReturn>>(goalKeys.detail(goalId));
        if (updatedGoalData) {
          onSuccessCallback?.(updatedGoalData);
        }
      }
    },
    onError: () => {
      toast.update(toastId.current, {
        render: `There was an error deleting your ${featureNamesText.goals.singular.toLowerCase()} status. Please try again.`,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    ...options,
  });
};
