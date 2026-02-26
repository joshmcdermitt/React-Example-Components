import { css } from '@emotion/react';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPDPStatusName } from '~Common/utils/getStatusName/getPDPStatusName';
import { pdpStatusColor, personalDevelopmentStatusColor } from '~DevelopmentPlan/const/defaults';
import {
  getPersonalDevelopmentStatusIcon, getResourceStatusIcon,
} from '~DevelopmentPlan/const/functions';
import {
  CompetencyResourceStatus, CompetencyResourceStatusDescriptionType, PDPStatus,
  PDPStatusEnum,
  ResourceType,
} from '~DevelopmentPlan/const/types';
import getPdpFeatureStatusName from '~DevelopmentPlan/utils/getPdpFeatureStatusName';
import { formatStatusCaseCapitalize } from '~Goals/const/functions';

const styles = {
  container: css({
    display: 'flex',
    alignItems: 'center',
  }),
  goalDescription: css({
    fontSize: '.75rem',
  }),
  icon: (color: string) => css({
    marginRight: '0.5rem',
    verticalAlign: 0,
    color,
  }),
};

interface NewGoalStatusViewProps {
  icon: IconDefinition,
  statusColor: string,
  statusName: string,
}
const View = ({
  icon,
  statusColor,
  statusName,
}: NewGoalStatusViewProps): JSX.Element => (
  <div css={styles.container}>
    <FontAwesomeIcon
      icon={icon}
      css={styles.icon(statusColor)}
    />
    <div css={styles.goalDescription}>
      {statusName}
    </div>
  </div>
);
interface PersonalDevelopmentStatusProps {
  status: CompetencyResourceStatus | PDPStatus,
  resourceType?: ResourceType,
  isResource?: boolean,
}

const PersonalDevelopmentStatus = ({
  status,
  isResource,
  resourceType,
}: PersonalDevelopmentStatusProps): JSX.Element => {
  let statusName: string;
  if (isResource) {
    // If its a resource then it has a resource type and the id is CompetencyResourceStatusEnum
    statusName = getPdpFeatureStatusName({
      status: status.description as CompetencyResourceStatusDescriptionType,
      resourceType: resourceType!,
      defaultText: status.description,
    });
  } else {
    // If its not a resource then its the PDP
    statusName = getPDPStatusName(status.id as PDPStatusEnum);
  }
  // normalize the casing of the status description for proper mapping
  const formattedStatusDescription = formatStatusCaseCapitalize(status.description);
  const icon = getPersonalDevelopmentStatusIcon(status.id);
  const resourceIcon = getResourceStatusIcon(formattedStatusDescription as CompetencyResourceStatusDescriptionType);
  let hookProps = {} as NewGoalStatusViewProps;
  if (isResource) {
    hookProps = {
      icon: resourceIcon,
      statusColor: personalDevelopmentStatusColor[formattedStatusDescription], // Expects formatting - 'To Do', 'In Progress', etc
      statusName,
    };
  } else {
    hookProps = {
      icon,
      statusColor: pdpStatusColor[status.id],
      statusName,
    };
  }
  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default PersonalDevelopmentStatus;
