import { css } from '@emotion/react';
import LayersTwoIcon from '~Assets/icons/components/LayersTwoIcon';

import { palette } from '~Common/styles/colors';

const styles = {
  childGoalCount: css({
    display: 'flex',
    alignItems: 'center',
    color: palette.neutrals.gray700,
    gap: '0.25rem',
  }),
  icon: css({
    width: '1rem',
    height: '1rem',
    color: palette.neutrals.gray700,
  }),
};

interface ChildGoalCountProps {
  totalChildGoals: number,
}

/**
 * @deprecated Use goals/components/Tables/GoalsTable/ChildGoalCount instead
 */

const ChildGoalCount = ({
  totalChildGoals,
  ...props
}: ChildGoalCountProps): JSX.Element => (
  <div
    css={styles.childGoalCount}
    {...props}
  >
    <span>{totalChildGoals}</span>
    <LayersTwoIcon css={styles.icon} />
  </div>
);

export default ChildGoalCount;
