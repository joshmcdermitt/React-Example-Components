import { Goals } from '@josh-hr/types';

interface UseShowStatusUpdateMenuParams {
  goal: Goals.Goal,
  status?: Goals.GoalStatusUpdate,
}

interface UseShowStatusUpdateMenuReturn {
  canEditStatusUpdate: boolean,
  canDeleteStatusUpdate: boolean,
}

export const useStatusUpdateMenu = ({ goal, status }: UseShowStatusUpdateMenuParams): UseShowStatusUpdateMenuReturn => {
  const isFirstStatus = goal.statusUpdates[goal.statusUpdates.length - 1].statusId === status?.statusId;
  const hasEditGoalStatusPermission = goal.permissions.includes(Goals.GoalPermission.CanEditGoalStatus);
  const canEditStatusUpdate = hasEditGoalStatusPermission && !isFirstStatus;
  const canDeleteStatusUpdate = hasEditGoalStatusPermission && !isFirstStatus;

  return {
    canEditStatusUpdate,
    canDeleteStatusUpdate,
  };
};
