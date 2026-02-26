import { Goals } from '@josh-hr/types';

export interface FlattenedGoal extends Goals.GoalV4Cascading {
  path: string[],
}

export interface FlattenedChildGoal extends Goals.GoalV4Cascading {
  path: string[],
}

function flattenGoals(goals: Goals.GoalV4Cascading[]): FlattenedGoal[] {
  const flattened: FlattenedGoal[] = [];
  const usedPaths = new Set<string>();

  function getUniquePathId(goalId: string, parentPath: string[]): string {
    // Try the original goalId first
    let candidatePath = [...parentPath, goalId];
    let pathString = candidatePath.join('|');

    // If this exact path already exists, append a counter
    let counter = 1;
    while (usedPaths.has(pathString)) {
      candidatePath = [...parentPath, `${goalId}_${counter}`];
      pathString = candidatePath.join('|');
      counter += 1;
    }

    // Mark this path as used
    usedPaths.add(pathString);

    // Return just the unique ID (last element of the path)
    return candidatePath[candidatePath.length - 1];
  }

  function recurse(goal: Goals.GoalV4Cascading, path: string[]): void {
    const uniqueId = getUniquePathId(goal.goalId, path);
    const currentPath = [...path, uniqueId];
    flattened.push({ ...goal, path: currentPath });

    if (goal.childGoals) {
      goal.childGoals.forEach((child) => recurse(child as unknown as Goals.GoalV4Cascading, currentPath));
    }
  }

  goals.forEach((goal) => recurse(goal, []));

  return flattened;
}

export default flattenGoals;
