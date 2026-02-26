import { Goals } from '@josh-hr/types';
import { CreateEditGoalFormValues } from '~Goals/components/DeleteAfterUOM/useGetCreateEditGoalFormResolver';

export function conformToDto(data: CreateEditGoalFormValues): Goals.Requests.CreateGoalRequestPayload {
  const {
    title = '',
    description,
    priority,
    externalLink,
    isPrivate = false,
    startTimeInMillis = 0,
    endTimeInMillis = 0,
    participants = [],
    context,
    category,
  } = data;

  const formattedParticipants = participants.map((participant) => ({
    role: participant.role,
    orgUserId: participant.orgUserId,
  }));

  const result: Goals.Requests.CreateGoalRequestPayload = {
    title,
    description,
    context: {
      contextType: context.contextType,
      ...(context.contextType === Goals.GoalContextType.Team && { contextId: context.contextId }),
    },
    isPrivate,
    startTimeInMillis,
    endTimeInMillis,
    externalLink,
    participants: formattedParticipants,
    measurementScaleTypeId: 1,
    measurementUnitTypeId: 1,
  };

  if (description && description !== '') {
    result.description = description;
  }

  if (priority !== undefined) {
    result.priority = priority;
  }

  result.category = category as Goals.GoalCategory;

  return result;
}
