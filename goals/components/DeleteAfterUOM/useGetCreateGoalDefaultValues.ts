import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { getDefaultGoalValues } from '~Goals/components/DeleteAfterUOM/getDefaultGoalValues';
import useGetCreateGoalPermissions from '../../hooks/useGetCreateGoalPermissions';
import { CreateEditGoalFormValues } from './useGetCreateEditGoalFormResolver';

export enum CreateGoalWorkflow {
  New = 'New',
  Clone = 'Clone',
}

interface UseGetCreateGoalDefaultValues {
  createGoalDefaultValues: CreateEditGoalFormValues,
  workflow?: CreateGoalWorkflow,
}

const useGetCreateGoalDefaultValues = (): UseGetCreateGoalDefaultValues => {
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

      const clonedGoalDefaultValues: CreateEditGoalFormValues = {
        ...initialGoal,
        context: {
          ...initialGoal.context,
          contextType: allowedGoalOptionScopes.includes(contextType) ? contextType : Goals.GoalContextType.Personal,
        },
        title: `(Clone) ${initialGoal.title}`,
        participants,
        // We want to use the default start and end times for the new goal, instead of cloning old dates
        startTimeInMillis: defaultGoal.startTimeInMillis,
        endTimeInMillis: defaultGoal.endTimeInMillis,
        measurementScaleTypeId: defaultGoal.measurementScaleTypeId,
        measurementUnitTypeId: defaultGoal.measurementUnitTypeId,
      };

      return clonedGoalDefaultValues;
    }

    return defaultGoal;
  }, [allowedGoalOptionScopes, defaultGoal, goalOwner, initialGoal, orgUserId, workflow]);

  return {
    createGoalDefaultValues,
    workflow,
  };
};

export default useGetCreateGoalDefaultValues;
