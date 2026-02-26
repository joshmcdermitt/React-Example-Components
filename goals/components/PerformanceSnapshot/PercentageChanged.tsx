import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import TrendDownIcon from '~Assets/icons/components/V4/TrendDown';
import TrendUpIcon from '~Assets/icons/components/V4/TrendUp';
import { colors, palette as paletteRedesign } from '~Common/styles/colorsRedesign';
import { Theme, useTheme } from '@mui/material';
import Tooltip from '~Common/components/Tooltip';

const styles = {
  percentageChanged: (color: string, theme: Theme) => css({
    fontWeight: '500',
    marginBottom: 0,
    marginTop: 0,
    color,
    display: 'flex',
    flexDirection: 'row',
    gap: '.25rem',
    alignItems: 'center',
    fontSize: theme.typography.textMd.fontSize,
    lineHeight: 1,
  }),
  tooltip: css({
    borderRadius: '.5rem',
    fontSize: '.75rem',
    fontWeight: 600,
  }),
};

interface PercentageChangedProps {
  percentChanged?: number;
  status?: Goals.GoalStatus;
}

const PercentageChanged = ({
  percentChanged,
  status,
}: PercentageChangedProps): JSX.Element => {
  const theme = useTheme();

  // Handle undefined, null, and number cases (including 0)
  const roundedPercentChanged = percentChanged !== undefined ? parseFloat(percentChanged.toFixed(1)) : undefined;

  const isPositiveIndicator = (percent: number, goalStatus?: Goals.GoalStatus): boolean => {
    // For these statuses, a positive percentage change is considered good
    if (
      (goalStatus === Goals.GoalStatus.Completed
        || goalStatus === Goals.GoalStatus.OnTrack)
      && percent >= 0
    ) {
      return true;
    }

    // For these statuses, a negative percentage change is considered good
    if (
      (status === Goals.GoalStatus.NeedsAttention
        || status === Goals.GoalStatus.AtRisk
        || status === Goals.GoalStatus.OnHold
        || status === Goals.GoalStatus.Missed
        || status === Goals.GoalStatus.PartiallyCompleted
        || status === Goals.GoalStatus.Partial
        || status === Goals.GoalStatus.Canceled)
      && percent <= 0
    ) {
      return true;
    }

    // All other combinations are considered not positive
    return false;
  };

  const color = isPositiveIndicator(percentChanged ?? 0, status) ? colors.primary.success[500] : colors.primary.error[500];

  if (roundedPercentChanged === undefined) {
    return (
      <div css={styles.percentageChanged(paletteRedesign.text.placeholder.default, theme)}>
        &#8722; No Historical Data
      </div>
    );
  }

  return (
    <Tooltip content="Compared to 7 days ago." css={styles.tooltip}>
      <div css={styles.percentageChanged(color, theme)}>
        {percentChanged && percentChanged > 0 ? <TrendUpIcon fontSize="inherit" /> : <TrendDownIcon fontSize="inherit" />}
        {roundedPercentChanged}
        %
      </div>
    </Tooltip>
  );
};

export default PercentageChanged;
