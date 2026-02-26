import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import GoalValueFormatted from '~Goals/components/Shared/TargetValue/GoalValueFormattedV4';
import useGetGoalMeasurementScaleTypeCategory, { GoalMeasurementScaleTypeCategory } from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';

const StyledIncreaseOrDecreaseText = styled('div')<{ $isWrapping: boolean }>(({ theme, $isWrapping }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.text.primary,
  flexWrap: $isWrapping ? 'wrap' : 'nowrap',
  fontWeight: 400,
}));

interface ViewProps {
  measurementScale: Goals.CondensedMeasurementScale,
  typeDescription: string,
  statusUpdate: Goals.CondensedStatusUpdate,
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
    <div style={{ whiteSpace: 'pre' }}>{`${typeDescription}`}</div>
    {goalMeasurementScaleTypeCategory !== GoalMeasurementScaleTypeCategory.Achieved && (
      <GoalValueFormatted
        measurementScale={measurementScale}
        statusUpdate={statusUpdate}
        goalValueType={Goals.MeasurementScaleMetadataTypeId.TargetValue}
      />
    )}
  </StyledIncreaseOrDecreaseText>
);

interface GoalTargetValueMessageProps extends Pick<ViewProps, 'isWrapping'> {
  measurementScale: Goals.CondensedMeasurementScale,
  statusUpdate: Goals.CondensedStatusUpdate,
}

const GoalTargetValueMessage = ({
  measurementScale,
  statusUpdate,
  isWrapping,
  ...props
}: GoalTargetValueMessageProps): JSX.Element => {
  const { type: { description: typeDescription, id } } = measurementScale;
  const { goalMeasurementScaleTypeCategory } = useGetGoalMeasurementScaleTypeCategory(
    { measurementScaleTypeId: id },
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
