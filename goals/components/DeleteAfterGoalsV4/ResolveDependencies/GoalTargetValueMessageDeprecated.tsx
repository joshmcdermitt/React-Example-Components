import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import GoalValueFormatted from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/GoalValueFormattedDeprecated';
import useGetGoalMeasurementScaleTypeCategory, { GoalMeasurementScaleTypeCategory } from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';

const StyledIncreaseOrDecreaseText = styled('div')<{ $isWrapping: boolean }>(({ theme, $isWrapping }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.primary,
  flexWrap: $isWrapping ? 'wrap' : 'nowrap',
  fontWeight: 400,
}));

interface ViewProps {
  measurementScale: Goals.MeasurementScale,
  typeDescription: string,
  statusUpdate?: Goals.GoalStatusUpdate,
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory,
  isWrapping?: boolean,
}

const View = ({
  measurementScale,
  typeDescription,
  statusUpdate,
  goalMeasurementScaleTypeCategory,
  isWrapping = false,
  ...props
}: ViewProps): JSX.Element => (
  <StyledIncreaseOrDecreaseText
    $isWrapping={isWrapping}
    {...props}
  >
    <div>{typeDescription}</div>
    &nbsp;
    {goalMeasurementScaleTypeCategory !== GoalMeasurementScaleTypeCategory.Achieved && (
      <GoalValueFormatted
        measurementScale={measurementScale}
        statusUpdate={statusUpdate}
        goalValueType={Goals.MeasurementScaleMetadataTypeId.TargetValue}
      />
    )}
  </StyledIncreaseOrDecreaseText>
);

type GoalTargetValueMessageProps = Pick<ViewProps, 'measurementScale' | 'statusUpdate' | 'isWrapping'>

/**
 *
 * @deprecated Use GoalTargetValueMessage from Shared/TargetValue/GoalTargetValueMessage
 */

const GoalTargetValueMessage = ({
  measurementScale,
  statusUpdate,
  isWrapping,
  ...props
}: GoalTargetValueMessageProps): JSX.Element => {
  const { description: typeDescription } = statusUpdate?.snapshotInformation ? statusUpdate.snapshotInformation.type : measurementScale.type;
  const { goalMeasurementScaleTypeCategory } = useGetGoalMeasurementScaleTypeCategory(
    { measurementScaleTypeId: statusUpdate?.snapshotInformation?.type?.id ?? measurementScale.type.id },
  );

  const hookProps = {
    measurementScale,
    typeDescription,
    statusUpdate,
    goalMeasurementScaleTypeCategory,
    isWrapping,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default GoalTargetValueMessage;
