import { Goals } from '@josh-hr/types';
import ProgressIconStatusOnly from '~Common/V4/components/ProgressBar/ProgressIconStatusOnly';
import { AchievedNotToggleType, AchievedNotToggle } from '~Goals/const/types';
import { GoalMeasurementScaleTypeSubCategory } from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';

interface AchievedNotStatusProps {
  isAchieved: AchievedNotToggleType | null,
  status: Goals.GoalStatus,
  showSmallText: boolean,
}

const AchievedNotStatus = ({ status, showSmallText, isAchieved }: AchievedNotStatusProps): JSX.Element => (
  <ProgressIconStatusOnly status={status} showSmallText={showSmallText}>
    {isAchieved === AchievedNotToggle.Achieved
      ? GoalMeasurementScaleTypeSubCategory.Achieved
      : GoalMeasurementScaleTypeSubCategory.NotAchieved}
  </ProgressIconStatusOnly>
);

export default AchievedNotStatus;
