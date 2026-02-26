import { useReturnTargetData } from '~Goals/hooks/utils/useReturnTargetData';
import Button, { MuiButtonProps } from '~Common/V4/components/Buttons/Button';
import { Goals } from '@josh-hr/types';
import CheckSquareIcon from '~Assets/icons/components/CheckSquareIcon';
import LineChartDownIcon from '~Assets/icons/components/V4/LineChartDownIcon';
import LineChartUpIcon from '~Assets/icons/components/V4/LineChartUpIcon';
import StayAboveIcon from '~Assets/icons/components/StayAboveIcon';
import StayBelowIcon from '~Assets/icons/components/StayBelowIcon';
import { GoalProgressV4 } from '~Goals/const/types';
import { forwardRef, useMemo, useRef } from 'react';
import { getIsGoalValueCurrency } from '~Goals/utils';
import { palette, colors } from '~Common/styles/colorsRedesign';
import { SxProps, Theme, useTheme } from '@mui/material';
import { useHoverState } from '~Common/hooks/useHoverState';
import JoshDueDate from '~Common/V3/components/JoshDueDate';
import { css } from '@emotion/react';
import { getGoalStatusColor } from '~Goals/hooks/utils/useGetGoalStatusColor';
import Tooltip from '~Common/components/Tooltip';
import GoalTargetValueMessage from '../GoalTargetValueMessage';

const getButtonStyles = (iconColor: string, theme: Theme): SxProps<Theme> => ({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  color: palette.text.secondary.default,
  border: `1px solid ${palette.border.primary}`,
  borderRadius: '.375rem',
  padding: '.125rem .375rem .125rem .25rem',
  height: '1.375rem',
  minWidth: '4.9375rem',
  '.MuiButton-root, .MuiButtonBase-root': {
    minWidth: '4.9375rem',
  },
  boxShadow: theme.palette.shadow.extraSmall,
  '.MuiSvgIcon-root': {
    color: iconColor,
  },
  '.MuiButton-startIcon, .MuiSvgIcon-root': {
    fontSize: '.75rem',
    margin: 0,
  },
  ':hover': {
    border: `1px solid ${palette.border.primary}`,
    backgroundColor: 'transparent',
  },
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

const styles = {
  targetValueMessage: css({
    color: 'white',
    whiteSpace: 'normal',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '.25rem',
    fontSize: '.75rem',
    fontWeight: '600',
  }),
  tooltipDueDate: css({
    fontSize: '.75rem',
    fontWeight: '600',
    flexWrap: 'nowrap',
    display: 'flex',
    gap: '.25rem',
  }),
  dueDate: css({
    color: colors.primary.grayLight[300],
  }),
  tooltipContainer: css({
    whiteSpace: 'normal',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '.25rem',
    minWidth: 'max-content', // preventing long string wrapping. causing strange extra blank space at the end of the tooltip
  }),
  tooltip: css({
    fontSize: '.75rem',
    fontWeight: '600',
    borderRadius: '.5rem',
    whiteSpace: 'nowrap',
  }),
  icon: (color: string) => css({
    color: `${color} !important`,
    transition: 'color 0.2s ease-in-out',
  }),
  button: css({
    whiteSpace: 'normal',
    lineHeight: '1rem',
    height: 'auto',
  }),
  goalIcon: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '.25rem',
  }),
};

const getIcon = (typeId: Goals.MeasurementScaleTypeId | number | undefined, color: string): JSX.Element => {
  switch (typeId) {
    case Goals.MeasurementScaleTypeId.IncreaseTo:
      return <LineChartUpIcon css={styles.icon(color)} />;
    case Goals.MeasurementScaleTypeId.DecreaseTo:
      return <LineChartDownIcon css={styles.icon(color)} />;
    case Goals.MeasurementScaleTypeId.AchievedOrNot:
      return <CheckSquareIcon css={styles.icon(color)} />;
    case Goals.MeasurementScaleTypeId.KeepAbove:
      return <StayAboveIcon css={styles.icon(color)} />;
    case Goals.MeasurementScaleTypeId.KeepBelow:
      return <StayBelowIcon css={styles.icon(color)} />;
    default:
      return <></>;
  }
};

interface GoalTargetBadgeProps extends MuiButtonProps {
  progress: GoalProgressV4;
  targetDate: number;
}

const GoalTargetBadge = forwardRef(({ progress, targetDate }: GoalTargetBadgeProps): JSX.Element => {
  const theme = useTheme();
  const scrollRef = useRef<HTMLButtonElement>(null);
  const { handleMouseEnter, handleMouseLeave } = useHoverState({ disableMobile: true });
  const { measurementScale, status } = progress;

  const goalStatusColor = getGoalStatusColor({ status, theme });

  const {
    typeId, displayLabel, connectingText, targetValue, measurementUnitType,
    shortLabel,
  } = useReturnTargetData(measurementScale);

  const isCurrency = getIsGoalValueCurrency({ displayLabel, labelPositionId: measurementUnitType.labelPosition.id });
  const isAddSpaceSeparator = displayLabel.length > 1 && !isCurrency;

  const prefix = measurementUnitType.labelPosition.id === Goals.LabelPositionId.Prefix ? `${displayLabel}${isAddSpaceSeparator ? ' ' : ''}` : '';
  const suffix = measurementUnitType.labelPosition.id === Goals.LabelPositionId.Suffix ? `${isAddSpaceSeparator ? ' ' : ''}${displayLabel}` : '';

  const displayedValue = useMemo((): string | JSX.Element => {
    if (shortLabel) {
      return `${prefix}${shortLabel}${suffix}`;
    }
    if (targetValue) {
      return `${prefix}${targetValue}${suffix}`;
    }
    return '';
  }, [shortLabel, prefix, suffix, targetValue]);

  const tooltipContent = (): JSX.Element => (
    <div css={styles.tooltipContainer}>
      <GoalTargetValueMessage
        css={styles.targetValueMessage}
        statusUpdate={progress.statusUpdate}
        measurementScale={progress.measurementScale}
      />
      {targetDate && (
        <div css={[styles.tooltipDueDate, styles.dueDate]}>
          by
          <JoshDueDate
            css={styles.dueDate}
            dueDate={targetDate}
            showIcon={false}
            applyColorIndicator={false}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      <Tooltip content={tooltipContent()} css={styles.tooltip}>
        <div>
          <Button
            ref={scrollRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            dataTestId="goalTableTargetBadge"
            disableElevation
            name="goalTableTargetBadge"
            startIcon={<div css={styles.goalIcon}>{getIcon(typeId, goalStatusColor)}</div>}
            variant="outlined"
            size="small"
            sx={getButtonStyles(goalStatusColor, theme)}
            css={styles.button}
          >
            {connectingText}
            {' '}
            {displayedValue}
          </Button>
        </div>
      </Tooltip>
    </>
  );
});

export default GoalTargetBadge;
