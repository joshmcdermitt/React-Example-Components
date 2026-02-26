import { Goals } from '@josh-hr/types';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';

const getFormattedGoalForEditing = (goal: Goals.Goal): CreateEditGoalFormValues => {
  const formattedGoal: CreateEditGoalFormValues = {
    title: goal.title,
    description: goal.description,
    participants: goal.participants.map((participant) => ({ //
      orgUserId: participant.orgUserId,
      role: participant.role,
    })),
    priority: goal.priority,
    context: goal.context,
    category: goal.category,
    externalLink: goal.externalLink,
    isPrivate: goal.isPrivate,
    startTimeInMillis: goal.startTimeInMillis,
    endTimeInMillis: goal.endTimeInMillis,
    measurementScaleTypeId: goal.measurementScale?.type.id,
    measurementUnitTypeId: goal.measurementScale?.measurementUnitType.id,
    measurementScaleMetadata: goal.measurementScale?.metadataValues?.map((metadataValue) => ({
      ...metadataValue,
      value: Number(metadataValue.value),
    })),
  };
  return formattedGoal;
};

export default getFormattedGoalForEditing;
