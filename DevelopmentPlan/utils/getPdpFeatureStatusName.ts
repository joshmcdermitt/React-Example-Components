import { getActionItemStatusName } from '~Common/utils/getStatusName/getActionItemStatusName';
import { getFeedbackStatusName } from '~Common/utils/getStatusName/getFeedbackStatusName';
import { getGoalStatusName } from '~Common/utils/getStatusName/getGoalStatusName';
import { getLearningStatusName } from '~Common/utils/getStatusName/getLearningStatusName';
import { getMeetingStatusName } from '~Common/utils/getStatusName/getMeetingStatusName';
import { CompetencyResourceStatusDescriptionType, ResourceType } from '~DevelopmentPlan/const/types';

interface GetPdpFeatureStatusNameParams {
  resourceType: ResourceType,
  status: CompetencyResourceStatusDescriptionType,
  defaultText?: string,
}

const getPdpFeatureStatusName = ({
  resourceType,
  status,
  defaultText = 'Unknown',
}: GetPdpFeatureStatusNameParams): string => {
  switch (resourceType) {
    case ResourceType.Goal:
      return getGoalStatusName(status, defaultText);
    case ResourceType.Learning:
    case ResourceType.LearningPlaylist:
      return getLearningStatusName(status, defaultText);
    case ResourceType.Feedback:
      return getFeedbackStatusName(status, defaultText);
    case ResourceType.ActionItem:
      return getActionItemStatusName(status, defaultText);
    case ResourceType.Meeting:
      return getMeetingStatusName(status, defaultText);
    // The following are only on the Accomplishments tab and don't have statuses, so we will never need them here
    case ResourceType.Accomplishment:
    case ResourceType.Recognition:
    default: return defaultText;
  }
};

export default getPdpFeatureStatusName;
