import { Goals } from '@josh-hr/types';
import { Theme, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { CompetencyResourceStatusEnum } from '~DevelopmentPlan/const/types';

interface GetGoalStatusColorParams {
  status: Goals.GoalStatus | Goals.AdditionalGoalStatusFilters | CompetencyResourceStatusEnum;
  theme: Theme,
}

export const getGoalStatusColor = ({
  status,
  theme,
}: GetGoalStatusColorParams): string => {
  // normalize status to lowercase string
  const normalized = typeof status === 'number' ? status : String(status).toLowerCase();

  switch (normalized) {
    // success
    case CompetencyResourceStatusEnum.InProgress:
    case CompetencyResourceStatusEnum.NotStarted:
    case String(Goals.GoalStatus.OnTrack).toLowerCase():
    case String(Goals.GoalStatus.Completed).toLowerCase():
      return theme.palette.utility.success500;

    // blue
    case String(Goals.AdditionalGoalStatusFilters?.Exceeded).toLowerCase():
      return theme.palette.utility.blue600;

    // warning
    case CompetencyResourceStatusEnum.PartiallyCompleted:
    case Goals.GoalStatus.PartiallyCompleted.toLowerCase():
    case String(Goals.GoalStatus.Caution).toLowerCase():
    case String(Goals.GoalStatus.NeedsAttention).toLowerCase():
      return theme.palette.utility.warning500;

    // error
    case CompetencyResourceStatusEnum.Behind:
    case CompetencyResourceStatusEnum.Missed:
    case String(Goals.GoalStatus.Behind).toLowerCase():
    case String(Goals.GoalStatus.Missed).toLowerCase():
    case String(Goals.GoalStatus.AtRisk).toLowerCase():
      return theme.palette.utility.error500;

    // gray and default
    case CompetencyResourceStatusEnum.Blocked:
    case CompetencyResourceStatusEnum.Cancelled:
    case String(Goals.GoalStatus.Blocked).toLowerCase():
    case String(Goals.GoalStatus.Canceled).toLowerCase():
    default:
      return theme.palette.utility.gray500;
  }
};

interface UseGetGoalStatusParams {
  status: Goals.GoalStatus,
}

interface UseGetGoalStatusColorReturn {
  goalStatusColor: string,
}

const useGetGoalStatusColor = ({ status }: UseGetGoalStatusParams): UseGetGoalStatusColorReturn => {
  const theme = useTheme();

  const goalStatusColor = useMemo(() => getGoalStatusColor({ status, theme }), [status, theme]);
  return {
    goalStatusColor,
  };
};

export default useGetGoalStatusColor;
