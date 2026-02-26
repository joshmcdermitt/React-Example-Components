import { css } from '@emotion/react';
import ProgressBar, { labelType } from '~Common/V4/components/ProgressBar';
import { GoalProgressV4, RequireSome } from '~Goals/const/types';
import { getGoalStatusColor } from '~Goals/hooks/utils/useGetGoalStatusColor';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';

const styles = {
  container: css({
    display: 'block',
  }),
  textContainer: css({
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5rem',
    justifyContent: 'space-between',
  }),
};

interface GoalProgressBarProps extends RequireSome<GoalProgressV4,
  'percentage'
  | 'status'
> {
  isTextHidden?: boolean;
  isIconHidden?: boolean;
  isSmallText?: boolean;
  labelDisplayType?: labelType;
}

const GoalProgressBar = ({
  isIconHidden = false,
  isTextHidden = false,
  isSmallText = false,
  labelDisplayType,
  percentage,
  status,
}: GoalProgressBarProps): JSX.Element => {
  const theme = useTheme();
  const linearProgressValue = useMemo(() => {
    if (!percentage) return 0;
    if (percentage < 0) {
      return 0;
    }
    if (percentage > 100) {
      return 100;
    }
    return percentage;
  }, [percentage]);

  const barColor = getGoalStatusColor({ status, theme });

  return (
    <div css={styles.container}>
      <ProgressBar
        percentage={linearProgressValue}
        barColor={barColor}
        isSmallText={isSmallText}
        isTextHidden={isTextHidden}
        labelType={labelDisplayType}
        isIconHidden={isIconHidden}
      />
    </div>
  );
};

export default GoalProgressBar;
