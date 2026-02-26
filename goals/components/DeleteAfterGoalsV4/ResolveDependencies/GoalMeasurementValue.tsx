import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import useGetGoalMeasurementScaleTypeCategory, {
  GoalMeasurementScaleTypeCategory,
  GoalMeasurementScaleTypeSubCategory,
} from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import { memo } from 'react';
import { AchievedNotToggle, AchievedNotToggleType, GoalCurrentMetadata } from '~Goals/const/types';
import IncreaseOrDecreaseValue from './IncreaseOrDecreaseValueDeprecated';
import GoalStatusIndicatorIcon from '../../Shared/GoalStatus/GoalStatusIndicatorIcon';
import AboveBelowStatus from './AboveBelowStatus';

const StyledContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'nowrap',
  gap: '8px',
  width: '100%',
}));

const StyledTextWrapper = styled('div')<{ $showSmallText?: boolean }>(({ $showSmallText }) => ({
  fontSize: $showSmallText ? '.6875rem' : '.8125rem',
  whiteSpace: 'nowrap',
  fontWeight: 500,
}));

interface ViewProps {
  completionPercentage: number,
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory,
  goalMetadata: GoalCurrentMetadata,
  hideAboveBelowUnitLabel?: boolean,
  isAchieved: AchievedNotToggleType | null,
  isCurrentValueVisible?: boolean,
  isShowingStatusIndicator?: boolean,
  measurementScale: Goals.MeasurementScale,
  showSmallText?: boolean,
  status: Goals.GoalStatus,
  statusUpdate?: Goals.GoalStatusUpdate,
}

const View = ({
  completionPercentage,
  goalMeasurementScaleTypeCategory,
  goalMetadata,
  hideAboveBelowUnitLabel,
  isAchieved,
  isCurrentValueVisible,
  isShowingStatusIndicator = true,
  measurementScale,
  showSmallText = false,
  status,
  statusUpdate,
  ...props
}: ViewProps): JSX.Element => (
  <StyledContainer {...props}>
    <>
      {isShowingStatusIndicator && goalMeasurementScaleTypeCategory !== GoalMeasurementScaleTypeCategory.IncreaseDecrease && (
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
              currentValue={Number(goalMetadata.currentValue)}
              targetValue={Number(goalMetadata.targetValue)}
              measurementScale={measurementScale}
              statusUpdate={statusUpdate}
              hideUnitLabel={hideAboveBelowUnitLabel}
            />
          </StyledTextWrapper>
        )}
      {(goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.IncreaseDecrease)
        && (
          <IncreaseOrDecreaseValue
            status={status}
            completionPercentage={completionPercentage}
            showSmallText={showSmallText}
            goalMeasurementScaleTypeCategory={goalMeasurementScaleTypeCategory}
            currentValueMetadata={goalMetadata}
            isCurrentValueVisible={isCurrentValueVisible}
            {...props}
          />
        )}
    </>
  </StyledContainer>
);

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
>

const GoalMeasurementValue = ({
  statusUpdate,
  measurementScale,
  ...props
}: GoalMeasurementValueProps): JSX.Element => {
  const source = statusUpdate?.snapshotInformation ?? measurementScale;
  const currentValue = statusUpdate?.value ?? measurementScale.currentValue;
  const measurementScaleTypeId = source.type.id;
  const targetValue = source.metadataValues?.find((metadata: Goals.MeasurementScaleMetadataValue) => (
    metadata.id === Goals.MeasurementScaleMetadataTypeId.TargetValue as number))?.value as unknown as Goals.MeasurementScaleMetadataValue['value'];
  const measurementUnitType = statusUpdate?.snapshotInformation?.measurementUnitType || measurementScale.measurementUnitType;
  const { goalMeasurementScaleTypeCategory } = useGetGoalMeasurementScaleTypeCategory({ measurementScaleTypeId });

  const hookProps = {
    goalMeasurementScaleTypeCategory,
    measurementScale,
    targetValue,
    currentValue,
    measurementUnitType,
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
  const prevSource = prevProps.statusUpdate?.snapshotInformation ?? prevProps.measurementScale;
  const nextSource = nextProps.statusUpdate?.snapshotInformation ?? nextProps.measurementScale;
  const prevCurrentValue = prevProps.statusUpdate?.value ?? prevProps.measurementScale.currentValue;
  const nextCurrentValue = nextProps.statusUpdate?.value ?? nextProps.measurementScale.currentValue;

  return prevProps.status === nextProps.status
    && prevProps.completionPercentage === nextProps.completionPercentage
    && prevCurrentValue === nextCurrentValue
    && prevSource.measurementUnitType.displayLabel === nextSource.measurementUnitType.displayLabel
    && prevSource.measurementUnitType.labelPosition?.id === nextSource.measurementUnitType.labelPosition?.id
    && prevSource.measurementUnitType.ownership?.id === nextSource.measurementUnitType.ownership?.id;
});
