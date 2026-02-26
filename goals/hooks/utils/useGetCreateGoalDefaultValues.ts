import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { getDefaultGoalValues } from '~Goals/utils/getDefaultGoalValues';
import getFormattedGoalForEditing from '~Goals/utils/getFormattedGoalForEditing';
import { CLONE_PREFIX, CLONE_PREFIX_LENGTH } from '~Goals/const';
import useGetCreateGoalPermissions from '../useGetCreateGoalPermissions';
import { CreateEditGoalFormValues } from './useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';

export enum CreateGoalWorkflow {
  New = 'New',
  Clone = 'Clone',
}

interface UseGetCreateGoalDefaultValues {
  createGoalDefaultValues: CreateEditGoalFormValues,
  workflow?: CreateGoalWorkflow,
}

const useGetCreateGoalDefaultValues = (
  teamId?: string,
  preselectedCategory?: Goals.GoalCategory,
): UseGetCreateGoalDefaultValues => {
  const { state: locationState } = useLocation<{ initialGoal: Goals.Goal, workflow: CreateGoalWorkflow }>();
  const { initialGoal, workflow } = locationState ?? {};
  const { allowedGoalOptionScopes } = useGetCreateGoalPermissions();
  const defaultGoal = getDefaultGoalValues();

  const orgUserId = getOrganizationUserId() ?? '';
  const goalOwner = useMemo(() => ({
    orgUserId,
    role: Goals.GoalParticipantRole.Owner,
  }), [orgUserId]);

  const createGoalDefaultValues = useMemo(() => {
    if (initialGoal && workflow === CreateGoalWorkflow.Clone) {
      const participants = initialGoal.participants.reduce((acc, participant) => {
        if (participant.role !== Goals.GoalParticipantRole.Owner && participant.orgUserId !== orgUserId) {
          acc.push({
            orgUserId: participant.orgUserId,
            role: participant.role,
          });
        }
        return acc;
      }, [] as { orgUserId: string; role: Goals.GoalParticipantRole }[]);
      participants.push(goalOwner);
      const { contextType } = initialGoal.context;
      const formattedInitialGoal = getFormattedGoalForEditing(initialGoal);

      const clonedGoalDefaultValues: CreateEditGoalFormValues = {
        ...formattedInitialGoal,
        context: {
          ...formattedInitialGoal.context,
          contextType: allowedGoalOptionScopes.includes(contextType) ? contextType : Goals.GoalContextType.Personal,
        },
        participants,
        // Ensure title stays within 70 char limit when adding clone prefix
        title: `${CLONE_PREFIX}${formattedInitialGoal.title.slice(0, Math.max(0, 70 - CLONE_PREFIX_LENGTH))}`,
        // We want to use the default start and end times for the new goal, instead of cloning old dates
        startTimeInMillis: defaultGoal.startTimeInMillis,
        endTimeInMillis: defaultGoal.endTimeInMillis,
      };

      return clonedGoalDefaultValues;
    }
    if (teamId) {
      return {
        ...defaultGoal,
        context: {
          contextId: teamId,
          contextType: Goals.GoalContextType.Team,
        },
        ...(preselectedCategory && { category: preselectedCategory }),
      };
    }
    if (preselectedCategory) {
      return {
        ...defaultGoal,
        category: preselectedCategory,
      };
    }
    return defaultGoal;
  }, [allowedGoalOptionScopes, defaultGoal, goalOwner, initialGoal, orgUserId, preselectedCategory, teamId, workflow]);

  return {
    createGoalDefaultValues,
    workflow,
  };
};

export default useGetCreateGoalDefaultValues;
