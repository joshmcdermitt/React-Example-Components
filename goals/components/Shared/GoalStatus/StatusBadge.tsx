import { Goals } from '@josh-hr/types';
import { colors, PaletteObject } from '~Common/styles/colors';
import JoshBadge from '~Common/V4/JoshBadge';
import { formatStatusCase } from '~Goals/const/functions';
import GoalStatusIndicatorIcon from './GoalStatusIndicatorIcon';

// FEATURE: Update with new colors and other status types
// See GoalStatusIndicatorIcon
const getGoalStatusColor = (status: Goals.GoalStatus): PaletteObject => {
  switch (status) {
    case Goals.GoalStatus.OnTrack:
    case Goals.GoalStatus.Completed:
      return colors.success;
    case Goals.GoalStatus.Caution:
    case Goals.GoalStatus.NeedsAttention:
    case Goals.GoalStatus.PartiallyCompleted:
      return colors.warning;
    case Goals.GoalStatus.Behind:
    case Goals.GoalStatus.Missed:
    case Goals.GoalStatus.AtRisk:
      return colors.error;
    case Goals.GoalStatus.Canceled:
    case Goals.GoalStatus.OnHold:
    default:
      return colors.gray;
  }
};

interface StatusBadgeProps {
  status: Goals.GoalStatus
  hideIndicatorIcon?: boolean,
}

const StatusBadge = ({
  status,
  hideIndicatorIcon = false,
  ...props
}: StatusBadgeProps): JSX.Element => (
  <JoshBadge color={getGoalStatusColor(status)} {...props}>
    {!hideIndicatorIcon && (
      <GoalStatusIndicatorIcon status={status} size={8} />
    )}
    {formatStatusCase(status)}
  </JoshBadge>
);

export default StatusBadge;
