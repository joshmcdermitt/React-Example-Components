import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import useGetGoalMeasurementScaleTypeCategory, {
  GoalMeasurementScaleTypeCategory,
  GoalMeasurementScaleTypeSubCategory,
} from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import { memo } from 'react';
import { AchievedNotToggle, AchievedNotToggleType, GoalCurrentMetadata } from '~Goals/const/types';
import useGetGoalMeasurementScaleEnumData from '~Goals/hooks/utils/useGetGoalMeasurementScaleEnumData';
import { css } from '@emotion/react';
import IncreaseOrDecreaseValue from './IncreaseOrDecreaseValue';
import GoalStatusIndicatorIcon from '../GoalStatusIndicatorIcon';
import AboveBelowStatus from './AboveBelowStatus';

const styles = {
  container: css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: '8px',
    width: '100%',
  }),
  progressBarContainer: css({
    width: '100%',
  }),
};

const StyledTextWrapper = styled('div')<{ $showSmallText?: boolean }>(({ $showSmallText }) => ({
  fontSize: $showSmallText ? '.6875rem' : '.875rem',
  whiteSpace: 'nowrap',
  fontWeight: 500,
}));

interface ViewProps {
  status: Goals.GoalStatus,
  completionPercentage: number,
  measurementScale: Goals.CondensedMeasurementScale,
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory,
  isAchieved: AchievedNotToggleType | null,
  isShowingStatusIndicator?: boolean,
  showSmallText?: boolean,
  statusUpdate: Goals.CondensedStatusUpdate,
  goalMetadata: GoalCurrentMetadata,
  isCurrentValueVisible?: boolean,
  hideAboveBelowUnitLabel?: boolean,
  hideProgressPercentage?: boolean,
  hideProgressPointer?: boolean,
}

const View = ({
  completionPercentage,
  goalMeasurementScaleTypeCategory,
  goalMetadata,
  hideAboveBelowUnitLabel = false,
  hideProgressPercentage = false,
  isAchieved,
  isCurrentValueVisible,
  isShowingStatusIndicator = true,
  measurementScale,
  showSmallText = false,
  status,
  statusUpdate,
  hideProgressPointer,
  ...props
}: ViewProps): JSX.Element => (
  <>
    {(goalMeasurementScaleTypeCategory !== GoalMeasurementScaleTypeCategory.IncreaseDecrease)
      && (
        <div css={styles.container}>
          {isShowingStatusIndicator && (
            <GoalStatusIndicatorIcon
              size={showSmallText ? 6 : 8}
              status={status}
            />
          )}
          {goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.Achieved && (
            <StyledTextWrapper
              $showSmallText={showSmallText}
              className="measurementValueText"
            >
              {isAchieved === AchievedNotToggle.Achieved
                ? GoalMeasurementScaleTypeSubCategory.Achieved
                : GoalMeasurementScaleTypeSubCategory.NotAchieved}
            </StyledTextWrapper>
          )}
          {goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.AboveBelow
            && (
              <StyledTextWrapper
                $showSmallText={showSmallText}
                className="measurementValueText"
              >
                <AboveBelowStatus
                  currentValue={statusUpdate.value}
                  targetValue={measurementScale?.metadataValues?.find((value) => value.id === Goals.MeasurementScaleMetadataTypeId.TargetValue)?.value}
                  measurementScale={measurementScale}
                  hideUnitLabel={hideAboveBelowUnitLabel}
                  statusUpdate={statusUpdate}
                />
              </StyledTextWrapper>
            )}
        </div>
      )}
    {(goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.IncreaseDecrease)
      && (
        <div css={styles.progressBarContainer}>
          <IncreaseOrDecreaseValue
            status={status}
            completionPercentage={completionPercentage}
            showSmallText={showSmallText}
            currentValueMetadata={goalMetadata}
            isCurrentValueVisible={isCurrentValueVisible}
            hideProgressPercentage={hideProgressPercentage}
            hideProgressPointer={hideProgressPointer}
            measurementScale={measurementScale}
            statusUpdate={statusUpdate}
            {...props}
          />
        </div>
      )}
  </>
);

/**
 * @param status
 * @param completionPercentage
 * @param measurementScale
 * @param goalMeasurementScaleTypeCategory
 * @param isAchieved
 * @param isShowingStatusIndicator Optional, default true.
 * @param showSmallText Optional, default false.
 * @param statusUpdate
 * @param goalMetadata
 * @param isCurrentValueVisible Optional, default true. Implemented in IncreaseOrDecreaseValue, only when Unit is not percentage
 * @param hideAboveBelowUnitLabel implemented in AboveBelowStatus. True on select pages, if CustomUnit and not >1 character
 * @param hideProgressPercentage: implemented in IncreaseOrDecreaseValue. True GoalsLandingPage
 *
 */

type GoalMeasurementValueProps = Pick<ViewProps,
  'status'
  | 'completionPercentage'
  | 'showSmallText'
  | 'measurementScale'
  | 'statusUpdate'
  | 'isShowingStatusIndicator'
  | 'isAchieved'
  | 'isCurrentValueVisible'
  | 'hideAboveBelowUnitLabel'
  | 'hideProgressPercentage'
  | 'hideProgressPointer'
>

const GoalMeasurementValue = ({
  statusUpdate,
  measurementScale,
  ...props
}: GoalMeasurementValueProps): JSX.Element => {
  const { contextTargetValueIndex } = useGetGoalMeasurementScaleEnumData();
  const { type, measurementUnitType, metadataValues } = measurementScale;
  const { value: currentValue } = statusUpdate;

  const targetValue = metadataValues?.[contextTargetValueIndex].value;
  const measurementScaleTypeId = type.id;
  const { goalMeasurementScaleTypeCategory } = useGetGoalMeasurementScaleTypeCategory({ measurementScaleTypeId });

  const hookProps = {
    goalMeasurementScaleTypeCategory,
    measurementScale,
    goalMetadata: {
      currentValue,
      targetValue,
      measurementUnitType,
    },
    statusUpdate,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default memo(GoalMeasurementValue, (prevProps, nextProps) => {
  const { statusUpdate, measurementScale, isCurrentValueVisible } = prevProps;
  const { statusUpdate: nextStatusUpdate, measurementScale: nextMeasurementScale, isCurrentValueVisible: nextIsCurrentValueVisible } = nextProps;
  const currentOwnership = measurementScale.measurementUnitType?.ownership as { id: number };
  const nextOwnership = nextMeasurementScale.measurementUnitType?.ownership as { id: number };

  return statusUpdate.status === nextStatusUpdate.status
    && statusUpdate.completionPercentage === nextStatusUpdate.completionPercentage
    && statusUpdate.value === nextStatusUpdate.value
    && measurementScale.measurementUnitType.displayLabel === nextMeasurementScale.measurementUnitType.displayLabel
    && measurementScale.measurementUnitType.labelPosition?.id === nextMeasurementScale.measurementUnitType.labelPosition?.id
    && currentOwnership?.id === nextOwnership?.id
    && isCurrentValueVisible === nextIsCurrentValueVisible;
});
