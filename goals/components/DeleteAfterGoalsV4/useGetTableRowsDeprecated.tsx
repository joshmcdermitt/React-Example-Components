import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { DEFAULT_OWNER } from '~Goals/const/defaults';
import { AchievedNotToggleType, CascadingGoalRow, GoalRow } from '~Goals/const/types';
import flattenGoals, { FlattenedChildGoal, FlattenedGoal } from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/flattenLinkedGoalsDeprecated';
import { GOAL_CATEGORY_TYPE_MAP } from '../../hooks/utils/categoryTypes/useGetGoalCategoryTypes';

interface UseGetTableRows {
  enableCascadingGoals: boolean,
  data: Goals.Goal[] | Goals.GoalWithCascading[],
}

/**
 * @deprecated Use goals/hooks/utils/useGetTableRows instead
 */

const useGetTableRows = ({ enableCascadingGoals, data }: UseGetTableRows): CascadingGoalRow[] | GoalRow[] => {
  const tableRows = useMemo(() => {
    if (enableCascadingGoals) {
      return getCascadingTableRows(data as Goals.GoalWithCascading[]);
    }

    return getFlatTableRows(data as Goals.Goal[]);
  }, [data, enableCascadingGoals]);

  return tableRows;
};

// TODO: Commonalize the logic between this and childGoalInfo
const topLevelGoalInfo = (goal: FlattenedGoal): CascadingGoalRow => {
  const loggedInUserIsParticipant = goal.participants.find((item) => item.orgUserId === getOrganizationUserId());
  const myRole = loggedInUserIsParticipant?.role ?? 'Viewer';
  const owner = goal?.participants?.find((participant) => participant.role === Goals.GoalParticipantRole.Owner && participant.firstName !== undefined);
  const ownerToUse = owner ?? DEFAULT_OWNER;
  const name = ownerToUse?.firstName ? `${ownerToUse?.firstName} ${ownerToUse?.lastName}` : '';
  const goalStatusUpdates = goal?.statusUpdates ?? [];
  const finalGoalStatus = goalStatusUpdates[goalStatusUpdates.length - 1];
  const priority = Goals.GoalPriority[goal?.priority ?? Goals.GoalPriority.Medium];

  return {
    id: goal.goalId,
    path: goal.path,
    title: goal.title,
    subText: GOAL_CATEGORY_TYPE_MAP[goal.category!], // FIXME
    isPrivate: goal.isPrivate,
    progress: {
      percentage: finalGoalStatus?.completionPercentage ?? 0,
      status: finalGoalStatus?.status ?? '',
      measurementScale: goal.measurementScale,
      isAchieved: finalGoalStatus?.isAchieved as AchievedNotToggleType | null,
    },
    priority,
    startDate: goal.startTimeInMillis,
    endDate: goal.endTimeInMillis,
    role: myRole,
    category: goal.category,
    owner: {
      orgUserId: ownerToUse?.orgUserId ?? '',
      imgUrl: ownerToUse?.profileImageUrl ?? '',
      name,
    },
    totalChildGoals: goal.totalChildGoals,
    contextType: goal.context.contextType,
    contextName: goal.context.contextName,
  };
};

const childGoalInfo = (goal: FlattenedChildGoal): CascadingGoalRow => {
  const loggedInUserIsParticipant = goal.participants.find((item) => item.orgUserId === getOrganizationUserId());
  const myRole = loggedInUserIsParticipant?.role ?? 'Viewer';
  const owner = goal?.participants?.find((participant) => participant.role === Goals.GoalParticipantRole.Owner && participant.firstName !== undefined);
  const ownerToUse = owner ?? DEFAULT_OWNER;
  const name = ownerToUse?.firstName ? `${ownerToUse?.firstName} ${ownerToUse?.lastName}` : '';
  const { completionPercentage, status } = goal.currentStatusUpdate;
  const priority = Goals.GoalPriority[goal?.priority ?? Goals.GoalPriority.Medium];

  return {
    id: goal.goalId,
    path: goal.path,
    title: goal.title,
    subText: goal.category,
    isPrivate: goal.isPrivate,
    progress: {
      percentage: completionPercentage ?? 0,
      status: status ?? '',
      measurementScale: goal.measurementScale,
      isAchieved: goal.currentStatusUpdate.isAchieved as AchievedNotToggleType | null,

    },
    priority,
    startDate: goal.startTimeInMillis,
    endDate: goal.endTimeInMillis,
    role: myRole,
    category: goal.category,
    owner: {
      imgUrl: ownerToUse?.profileImageUrl ?? '',
      name,
      orgUserId: ownerToUse?.orgUserId ?? '',
    },
    totalChildGoals: goal.totalChildGoals,
    contextType: goal.context.contextType,
    contextName: goal.context.contextName,
  };
};

function isFlattenedGoal(goal: FlattenedGoal | FlattenedChildGoal): goal is FlattenedGoal {
  return (goal as FlattenedGoal).statusUpdates !== undefined;
}

const getCascadingTableRows = (data: Goals.GoalWithCascading[]): CascadingGoalRow[] => {
  const flattenedGoals = flattenGoals(data);

  const tableRows: CascadingGoalRow[] = flattenedGoals.map((goal) => {
    const formattedGoal = isFlattenedGoal(goal) ? topLevelGoalInfo(goal) : childGoalInfo(goal);
    return formattedGoal;
  }) ?? [];

  return tableRows;
};

const getFlatTableRows = (data: Goals.Goal[]): GoalRow[] => {
  const tableRows: GoalRow[] = data.map((goal) => {
    const loggedInUserIsParticipant = goal.participants.find((item) => item.orgUserId === getOrganizationUserId());
    const myRole = loggedInUserIsParticipant?.role ?? 'Viewer';
    const owner = goal?.participants?.find((participant) => participant.role === Goals.GoalParticipantRole.Owner && participant.firstName !== undefined);
    const ownerToUse = owner ?? DEFAULT_OWNER;
    const name = ownerToUse?.firstName ? `${ownerToUse?.firstName} ${ownerToUse?.lastName}` : '';
    const goalStatusUpdates = goal?.statusUpdates ?? [];
    const finalGoalStatus = goalStatusUpdates[goalStatusUpdates.length - 1];
    const priority = Goals.GoalPriority[goal?.priority ?? Goals.GoalPriority.Medium];

    return {
      id: goal.goalId,
      title: goal.title,
      subText: GOAL_CATEGORY_TYPE_MAP[goal.category!], // FIXME
      isPrivate: goal.isPrivate,
      progress: {
        percentage: finalGoalStatus?.completionPercentage ?? 0,
        status: finalGoalStatus?.status ?? '',
        measurementScale: goal.measurementScale,
        isAchieved: finalGoalStatus?.isAchieved as AchievedNotToggleType | null,
        value: finalGoalStatus?.value as Goals.GoalStatusUpdate['value'] | Goals.MeasurementScale['currentValue'] ?? null,
      },
      priority,
      startDate: goal.startTimeInMillis,
      endDate: goal.endTimeInMillis,
      role: myRole,
      category: goal.category,
      owner: {
        imgUrl: ownerToUse?.profileImageUrl ?? '',
        name,
        orgUserId: ownerToUse?.orgUserId ?? '',
      },
      contextType: goal.context.contextType,
      contextName: goal.context.contextName,
    };
  }) ?? [];

  return tableRows;
};

export default useGetTableRows;
