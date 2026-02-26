import { Goals } from '@josh-hr/types';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { queryClient } from '~Common/const/queryClient';
import { getOrganizationId } from '~Common/utils/localStorage';
import { patchApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { goalKeys } from '~Goals/const/queryKeys';
import { homeQueryKeys } from '~Home/hooks/queryKeys';

interface PatchLinkGoalParams extends Goals.Requests.UpdateLinkedGoalsRequestPayload {
  goalId: string,
}

const patchLinkGoal = async ({
  goalId,
  parentGoalId,
  childGoalIds,
}: PatchLinkGoalParams): Promise<HttpCallReturn<Goals.Responses.UpdateLinkedGoalsResponse>> => {
  const serverUrl = {
    version: 3,
    url: `/goals/${goalId}/link`,
  };

  return patchApi<Goals.Responses.UpdateLinkedGoalsResponse>(serverUrl, { parentGoalId, childGoalIds });
};

export type UseLinkGoalParams = Omit<
  UseMutationOptions<HttpCallReturn<Goals.Responses.UpdateLinkedGoalsResponse>, Error, PatchLinkGoalParams>, 'mutationFn'
>;

export type UseLinkGoalsReturn = UseMutationResult<HttpCallReturn<Goals.Responses.UpdateLinkedGoalsResponse>, Error, PatchLinkGoalParams>;

export const useLinkGoal = ({
  ...options
}: UseLinkGoalParams = {}): UseLinkGoalsReturn => useMutation({
  mutationFn: patchLinkGoal,
  onSuccess: async () => {
    void queryClient.invalidateQueries({ queryKey: homeQueryKeys.homeGoals(getOrganizationId() ?? '') });
    await queryClient.invalidateQueries({ queryKey: goalKeys.all });
  },
  ...options,
});
