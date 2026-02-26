import { css } from '@emotion/react';
import { Checkbox } from '~Common/V3/components/uncontrolled';

import InfoTooltip from './InfoTooltip';

const styles = {
  privateGoalToggle: css({
    display: 'flex',
    alignItems: 'center',

    label: {
      margin: '0 !important',
    },
  }),
  infoTooltip: css({
    display: 'flex',
    marginLeft: '.75rem',
  }),
  logo: css({
    width: '1.25rem',
    height: '1.25rem',
    color: 'red',
  }),
};

interface PrivateGoalToggleProps {
  selectedGoalType: string,
  isPrivate?: boolean,
}

const PrivateGoalToggle = ({
  selectedGoalType,
  isPrivate,
  ...props
}: PrivateGoalToggleProps): JSX.Element => (
  <div
    css={styles.privateGoalToggle}
    {...props}
  >
    <Checkbox
      name="isPrivate"
      label="Make this private"
      defaultChecked={isPrivate}
      size={20}
      data-test-id="goalsCreateGoalPrivateCheckbox"
    />
    <InfoTooltip css={styles.infoTooltip} selectedGoalType={selectedGoalType} />
  </div>
);

export default PrivateGoalToggle;
