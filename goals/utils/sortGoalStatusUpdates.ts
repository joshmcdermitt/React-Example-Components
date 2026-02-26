import { GetGoalByIdReturn } from '~Goals/hooks/useGetGoalById';

export const sortGoalStatusUpdates = (goal: GetGoalByIdReturn): GetGoalByIdReturn => ({
  ...goal,
  statusUpdates: [...goal.statusUpdates].sort(
    (statusUpdateA, statusUpdateB) => statusUpdateB.createdInMillis - statusUpdateA.createdInMillis,
  ),
});
