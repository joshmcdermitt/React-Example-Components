import { Goals } from '@josh-hr/types';

export interface FlattenedGoal extends Goals.GoalWithCascading {
  path: string[],
}

export interface FlattenedChildGoal extends Goals.LinkedGoal {
  path: string[],
}

/**
 * @deprecated Use flattenLinkedGoals from ~Goals/hooks/utils/flattenLinkedGoals
 */

function flattenGoals(goals: Goals.GoalWithCascading[]): FlattenedGoal[] {
  const flattened: FlattenedGoal[] = [];

  function recurse(goal: Goals.GoalWithCascading, path: string[]): void {
    const currentPath = [...path, goal.goalId];
    flattened.push({ ...goal, path: currentPath });

    if (goal.childGoals) {
      goal.childGoals.forEach((child) => recurse(child as unknown as Goals.GoalWithCascading, currentPath));
    }
  }

  goals.forEach((goal) => recurse(goal, []));

  return flattened;
}

export default flattenGoals;
