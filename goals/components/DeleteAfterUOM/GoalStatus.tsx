import { css } from '@emotion/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import { ComponentProps } from 'react';
import { Goals } from '@josh-hr/types';
import { GoalStatusColor, getGoalStatusIcon } from '~Goals/const/types';
import { getGoalStatusName } from '~Common/utils/getStatusName/getGoalStatusName';

const styles = {
  status: css({
    alignItems: 'center',
    columnGap: '0.5rem',
    display: 'flex',
  }),
  label: css({
    fontWeight: 400,
  }),
  statusIcon: (color: string) => css({
    color,
    fontSize: '0.75rem',
  }),
};

export interface ViewProps extends ComponentProps<'div'> {
  status: Goals.GoalStatus,
  statusColor: string,
  statusIcon: IconDefinition,
}

const View = ({
  status,
  statusColor,
  statusIcon,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.status}
    {...props}
  >
    <FontAwesomeIcon
      icon={statusIcon}
      css={styles.statusIcon(statusColor)}
    />
    <p css={styles.label}>
      { getGoalStatusName(status) }
    </p>
  </div>
);

export interface GoalStatusDropdownProps extends ComponentProps<'div'> {
  status: Goals.GoalStatus,
}

const GoalStatus = ({
  status,
  ...props
}: GoalStatusDropdownProps): JSX.Element => {
  const statusIcon = getGoalStatusIcon(status);
  const statusColor = GoalStatusColor[status];

  const hookProps = {
    status,
    statusColor,
    statusIcon,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default GoalStatus;
