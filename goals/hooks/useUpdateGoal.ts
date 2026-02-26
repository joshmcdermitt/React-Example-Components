import { useRef } from 'react';
import { Goals } from '@josh-hr/types';
import { toast } from '~Common/components/Toasts';
import { noop } from '~Deprecated/utils';
import { UpdateGoalPayloads } from '~Goals/const/functions';
import { queryClient } from '~Common/const/queryClient';
import { goalKeys } from '~Goals/const/queryKeys';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { homeQueryKeys } from '~Home/hooks/queryKeys';
import { getOrganizationId } from '~Common/utils/localStorage';
import { useEditGoalParticipants } from './useEditGoalParticipants';
import { useEditGoal } from './useEditGoal';

interface UpdateAdminSettingsParams extends UpdateGoalPayloads {
  goalId: string,
}

interface UseUpdateGoalReturn {
  updateGoal: (params: UpdateAdminSettingsParams) => Promise<void>,
  isUpdatingGoal: boolean,
  isUpdatingGoalParticipants: boolean,
}

const useUpdateGoal = (): UseUpdateGoalReturn => {
  const toastId = useRef<string | number | null>(null);

  const { mutateAsync: editGoalDetailsMutation, isPending: isUpdatingGoal } = useEditGoal({
    // Overriding these so that the toast messages are handled here
    onMutate: () => noop,
    onError: () => noop,
    onSuccess: () => noop,
  });
  const { mutateAsync: editGoalParticipantsMutation, isPending: isUpdatingGoalParticipants } = useEditGoalParticipants({
    // Overriding these so that the toast messages are handled here
    onMutate: () => noop,
    onError: () => noop,
    onSuccess: () => noop,
  });

  const updateGoal = async ({
    participantsPayload,
    goalPayload,
    goalId,
  }: UpdateAdminSettingsParams): Promise<void> => {
    // Check if we're adding a team to the goal
    const isAddingTeam = goalPayload?.context?.contextType === Goals.GoalContextType.Team && goalPayload?.context?.contextId;

    toastId.current = toast.info('Editing your goal...', { autoClose: false });
    const mutations = [];

    mutations.push(editGoalDetailsMutation({ goalId, payload: goalPayload }));

    if (participantsPayload.participants.length > 0) {
      mutations.push(editGoalParticipantsMutation({ payload: participantsPayload, goalId }));
    }
    await Promise.all(mutations).then(async () => {
      const successMessage = isAddingTeam
        ? 'The objective is now linked to the team.'
        : 'Successfully edited your goal!';

      toast.update(toastId.current, {
        render: successMessage,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      await queryClient.invalidateQueries({ queryKey: goalKeys.all });
      void queryClient.invalidateQueries({ queryKey: goalKeys.performanceSnapshots(), refetchType: 'active' });
      void queryClient.invalidateQueries({
        queryKey: goalKeys.lists(),
        refetchType: 'all',
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.all });
      void queryClient.invalidateQueries({ queryKey: homeQueryKeys.homeGoals(getOrganizationId() ?? '') });
    }).catch(() => {
      toast.update(toastId.current, {
        render: 'There was an error editing your goal. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    });
  };

  return {
    updateGoal,
    isUpdatingGoal,
    isUpdatingGoalParticipants,
  };
};

export default useUpdateGoal;
