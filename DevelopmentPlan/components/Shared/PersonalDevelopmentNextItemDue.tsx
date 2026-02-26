import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { palette } from '~Common/styles/colors';
import { withLineClamp } from '~Common/styles/mixins';
import { getPersonalDevelopmentTypeIcon } from '~DevelopmentPlan/const/functions';
import { NextResource } from '~DevelopmentPlan/const/types';

const styles = {
  container: css({
    display: 'flex',
    alignItems: 'center',
  }),
  goalDescription: css({
    fontSize: '.75rem',
  }, withLineClamp(1)),
  icon: css({
    marginRight: '0.5rem',
    verticalAlign: 0,
    color: palette.neutrals.gray700,
  }),
};

interface NewGoalStatusViewProps {
  renderStatusIcon: () => JSX.Element
  contentTitle: string,
}
const View = ({
  renderStatusIcon,
  contentTitle,
}: NewGoalStatusViewProps): JSX.Element => (
  <div css={styles.container}>
    {renderStatusIcon()}

    <div css={styles.goalDescription}>
      {contentTitle}
    </div>
  </div>
);
interface PersonalDevelopmentStatusProps {
  resource: NextResource,
}

const PersonalDevelopmentStatus = ({
  resource,
}: PersonalDevelopmentStatusProps): JSX.Element => {
  const { contentTitle, contentType } = resource;
  const icon = getPersonalDevelopmentTypeIcon(contentType.id);
  const renderStatusIcon = (): JSX.Element => (
    <FontAwesomeIcon
      icon={icon}
      css={styles.icon}
    />
  );

  const hookProps = {
    renderStatusIcon,
    contentTitle,
  };
  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default PersonalDevelopmentStatus;
