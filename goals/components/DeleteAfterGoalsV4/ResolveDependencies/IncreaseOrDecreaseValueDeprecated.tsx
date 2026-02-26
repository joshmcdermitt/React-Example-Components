import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import { LinearProgress, linearProgressClasses, styled } from '@mui/material';
import { memo, useMemo } from 'react';
import { getGoalStatusColor } from '~Goals/hooks/utils/useGetGoalStatusColor';
import { useCheckPageLocation } from '~Common/hooks/usePageLocation';
import { RouteName } from '~Common/const/routeName';
import { GoalMeasurementScaleTypeCategory } from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import { GoalCurrentMetadata } from '~Goals/const/types';
import { NumericFormat } from 'react-number-format';
import useGetIsDisplayingCurrentValueInput from '~Goals/hooks/utils/useIsDisplayingCurrentValueInput';

const styles = {
  currentValue: (showSmallText: boolean, isViewingHome: boolean) => css({
    whiteSpace: 'nowrap',
    fontSize: isViewingHome ? '.75rem' : '.8125rem',
    flexGrow: 1,
  }, showSmallText && !isViewingHome && {
    fontSize: '.6875rem',
  }),
  container: css({
    gap: '.25rem',

  }),
  linearProgressWrapper: css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    columnGap: '.75rem',
    flexGrow: 1,
  }),
};

const StyledIncreaseOrDecreaseValue = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.large,
  width: '100%',
}));

interface StyledLinearProgressProps {
  status: Goals.GoalStatus,
  showSmallProgressBar: boolean,
}

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'status',
})<StyledLinearProgressProps>(({ status, theme, showSmallProgressBar }) => ({
  height: showSmallProgressBar ? '.375rem' : '.5rem',
  width: '100%',
  borderRadius: '.5rem',
  minWidth: '45px',

  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.background.quaternary,
  },

  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: getGoalStatusColor({ status, theme }),
  },
}));

/* TODO: Refactor isViewingHome, reconsider sizing approach and design. */
const StyledCompletionPercentageText = styled('span')<{ $showSmallText: boolean, $isViewingHome: boolean }>(({ theme, $showSmallText, $isViewingHome }) => {
  let fontSize = '.8125rem';
  if ($isViewingHome) {
    fontSize = '.75rem';
  } else if ($showSmallText && !$isViewingHome) {
    fontSize = '.6875rem';
  }
  return {
    color: theme.palette.text.secondary,
    fontSize,
    lineHeight: theme.lineHeight.small,
    fontWeight: 500,
  };
});

interface ViewProps {
  status: Goals.GoalStatus,
  linearProgressValue: number,
  completionPercentage?: number,
  showSmallText?: boolean,
  isViewingHome: boolean,
  isDisplayingCurrentValue: boolean,
  isGoalDisplayingCurrentValue: boolean,
  currentValueMetadata?: GoalCurrentMetadata,
  hideProgressPercentage?: boolean,
}

const View = ({
  completionPercentage,
  currentValueMetadata,
  hideProgressPercentage,
  isDisplayingCurrentValue,
  isViewingHome,
  linearProgressValue,
  showSmallText = false,
  status,
  ...props
}: ViewProps): JSX.Element => (
  <StyledIncreaseOrDecreaseValue css={styles.container} {...props}>
    <div css={styles.linearProgressWrapper} className="linearProgressWrapper">
      <StyledLinearProgress
        showSmallProgressBar={showSmallText}
        status={status}
        variant="determinate"
        value={linearProgressValue}
      />
      {typeof completionPercentage === 'number'
        && !Number.isNaN(completionPercentage)
        && !hideProgressPercentage
        && (
          <StyledCompletionPercentageText
            $showSmallText={showSmallText}
            $isViewingHome={isViewingHome}
          >
            {`${completionPercentage ?? 0}%`}
          </StyledCompletionPercentageText>
        )}
    </div>
    {isDisplayingCurrentValue // REFACTOR using GoalValueFormatted
      && (
        <div css={styles.currentValue(showSmallText, isViewingHome)}>
          (
          <NumericFormat
            value={String(currentValueMetadata?.currentValue)}
            thousandSeparator=","
            decimalSeparator="."
            prefix={
              currentValueMetadata?.measurementUnitType?.labelPosition?.id === Goals.LabelPositionId.Prefix
                ? currentValueMetadata?.measurementUnitType?.displayLabel
                : undefined
            }
            suffix={
              currentValueMetadata?.measurementUnitType?.labelPosition?.id === Goals.LabelPositionId.Suffix
                ? currentValueMetadata?.measurementUnitType?.displayLabel
                : undefined
            }
            displayType="text"
          />
          )
        </div>
      )}
  </StyledIncreaseOrDecreaseValue>
);

/**
 * @params status
 * @params completionPercentage
 * @params showSmallText
 * @params hideProgressPercentage
 * @params goalMeasurementScaleTypeCategory
 * @params currentValueMetadata
 * @params isCurrentValueVisible Required, dependent on page/component design
 */
interface IncreaseOrDecreaseValueProps extends Pick<ViewProps,
  'status'
  | 'completionPercentage'
  | 'showSmallText'
  | 'hideProgressPercentage'
> {
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory,
  currentValueMetadata?: GoalCurrentMetadata,
  isCurrentValueVisible?: boolean,
}

/**
 * @deprecated  Use IncreaseOrDecreaseValue from Shared/GoalStatus/GoalMeasurementValue/IncreaseOrDecreaseValue
*/

const IncreaseOrDecreaseValue = ({
  completionPercentage,
  showSmallText,
  goalMeasurementScaleTypeCategory,
  currentValueMetadata,
  isCurrentValueVisible = true,
  ...props
}: IncreaseOrDecreaseValueProps): JSX.Element => {
  const isViewingHome: boolean = useCheckPageLocation([RouteName.Home]);

  const linearProgressValue = useMemo(() => {
    if (!completionPercentage || completionPercentage < 0) {
      return 0;
    }
    if (completionPercentage > 100) {
      return 100;
    }
    return completionPercentage;
  }, [completionPercentage]);

  const { isGoalDisplayingCurrentValue } = useGetIsDisplayingCurrentValueInput({
    scaleTypeCategory: goalMeasurementScaleTypeCategory,
    unitTypeId: currentValueMetadata?.measurementUnitType?.id,
  });

  // REFACTOR: Create centralized display logic, higher.
  const isDisplayingCurrentValue = useMemo(
    (): boolean => {
      if (
        currentValueMetadata?.measurementUnitType?.id // unitType (duplicate)
        && isCurrentValueVisible // visibility per page design
        && isGoalDisplayingCurrentValue // increase/decrease type, not percentages
      ) {
        return true;
      }
      return false;
    },
    [
      currentValueMetadata?.measurementUnitType?.id,
      isCurrentValueVisible,
      isGoalDisplayingCurrentValue,
    ],
  );

  const hookProps = {
    linearProgressValue,
    completionPercentage,
    showSmallText,
    isViewingHome,
    isDisplayingCurrentValue,
    isGoalDisplayingCurrentValue,
    currentValueMetadata,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default memo(IncreaseOrDecreaseValue, (prevProps, nextProps) => (
  prevProps.status === nextProps.status
  && prevProps.completionPercentage === nextProps.completionPercentage
));
