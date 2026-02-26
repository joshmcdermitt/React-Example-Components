import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import {
  AchievedNotToggleType, CascadingGoalRowV4, GoalRowV4,
} from '~Goals/const/types';
import flattenGoals, { FlattenedChildGoal, FlattenedGoal } from '~Goals/utils/flattenLinkedGoals';
import { GOAL_CATEGORY_TYPE_MAP } from './categoryTypes/useGetGoalCategoryTypes';

interface UseGetTableRows {
  enableCascadingGoals: boolean,
  data?: Goals.GoalV4[] | Goals.GoalV4Cascading[],
}

const useGetTableRows = ({ enableCascadingGoals, data }: UseGetTableRows): CascadingGoalRowV4[] | GoalRowV4[] => {
  const tableRows = useMemo(() => {
    if (!data) {
      return [];
    }

    if (enableCascadingGoals) {
      return getCascadingTableRows(data as Goals.GoalV4Cascading[]);
    }

    return getFlatTableRows(data as Goals.GoalV4[]);
  }, [data, enableCascadingGoals]);

  return tableRows;
};

// TODO: Commonalize the logic between this and childGoalInfo
const topLevelGoalInfo = (goal: FlattenedGoal): CascadingGoalRowV4 => {
  const {
    path,
    title,
    category,
    isPrivate,
    currentStatusUpdate,
    measurementScale,
    isCompleted,
    role,
    priority,
    endTimeInMillis,
    owner,
    totalChildGoals,
    context,
    permissions,
  } = goal;

  const {
    isAchieved, completionPercentage, status, value,
  } = currentStatusUpdate;

  return {
    id: path[path.length - 1],
    path,
    title,
    subText: GOAL_CATEGORY_TYPE_MAP[goal.category!], // FIXME
    isPrivate,
    progress: {
      isAchieved: isAchieved as AchievedNotToggleType | null,
      measurementScale,
      percentage: completionPercentage ?? 0,
      status: status ?? '',
      value,
      statusUpdate: currentStatusUpdate,
      isComplete: isCompleted,
    },
    priority: priority as Record<Goals.GoalPriority, string>,
    endDate: endTimeInMillis,
    role,
    category,
    owner: {
      orgUserId: owner?.orgUserId ?? null,
      imgUrl: owner.profileImageUrl ?? '',
      name: owner.fullName ?? '',
    },
    totalChildGoals,
    contextType: context.contextType,
    contextName: context.contextName,
    goal,
    permissions,
  };
};

const childGoalInfo = (goal: FlattenedChildGoal): CascadingGoalRowV4 => {
  const {
    path,
    title,
    category,
    isPrivate,
    currentStatusUpdate,
    measurementScale,
    isCompleted,
    role,
    priority,
    endTimeInMillis,
    owner,
    totalChildGoals,
    context,
    permissions,
  } = goal;

  const {
    isAchieved, completionPercentage, status, value,
  } = currentStatusUpdate;

  return {
    id: path[path.length - 1],
    path,
    title,
    subText: GOAL_CATEGORY_TYPE_MAP[goal.category!], // FIXME
    isPrivate,
    progress: {
      isAchieved: isAchieved as AchievedNotToggleType | null,
      measurementScale,
      percentage: completionPercentage ?? 0,
      status: status ?? '',
      value,
      statusUpdate: currentStatusUpdate,
      isComplete: isCompleted,
    },
    priority: priority as Record<Goals.GoalPriority, string>,
    endDate: endTimeInMillis,
    role,
    category,
    owner: {
      orgUserId: owner?.orgUserId ?? null,
      imgUrl: owner.profileImageUrl ?? '',
      name: owner.fullName ?? '',
    },
    totalChildGoals,
    contextType: context.contextType,
    contextName: context.contextName,
    goal,
    permissions,
  };
};

function isFlattenedGoal(goal: FlattenedGoal | FlattenedChildGoal): goal is FlattenedGoal {
  return (goal as FlattenedGoal).currentStatusUpdate !== undefined;
}

const getCascadingTableRows = (data: Goals.GoalV4Cascading[]): CascadingGoalRowV4[] => {
  const flattenedGoals = flattenGoals(data);

  const tableRows: CascadingGoalRowV4[] = flattenedGoals.map((goal, index) => {
    const formattedGoal = isFlattenedGoal(goal) ? topLevelGoalInfo(goal) : childGoalInfo(goal);

    // Append row index to the ID to ensure absolute uniqueness
    return {
      ...formattedGoal,
      id: `${formattedGoal.id}_${index}`,
    };
  }) ?? [];

  return tableRows;
};

const getFlatTableRows = (data: Goals.GoalV4[]): GoalRowV4[] => {
  const tableRows: GoalRowV4[] = data.map((goal: Goals.GoalV4) => {
    const {
      goalId,
      title,
      category,
      isPrivate,
      currentStatusUpdate,
      measurementScale,
      isCompleted,
      role,
      priority,
      endTimeInMillis,
      owner,
      context,
      permissions,
    } = goal;

    const {
      isAchieved, completionPercentage, status, value,
    } = currentStatusUpdate;

    return {
      id: goalId,
      title,
      subText: GOAL_CATEGORY_TYPE_MAP[goal.category!], // FIXME
      isPrivate,
      progress: {
        isAchieved: isAchieved as AchievedNotToggleType | null,
        measurementScale,
        percentage: completionPercentage ?? 0,
        status: status ?? '',
        value,
        statusUpdate: currentStatusUpdate,
        isComplete: isCompleted,
      },
      priority: priority as Record<Goals.GoalPriority, string>,
      endDate: endTimeInMillis,
      role,
      category,
      owner: {
        orgUserId: owner?.orgUserId ?? null,
        imgUrl: owner.profileImageUrl ?? '',
        name: owner.fullName ?? '',
      },
      contextType: context.contextType,
      contextName: context.contextName,
      goal,
      permissions,
    };
  }) ?? [];

  return tableRows;
};

export default useGetTableRows;
