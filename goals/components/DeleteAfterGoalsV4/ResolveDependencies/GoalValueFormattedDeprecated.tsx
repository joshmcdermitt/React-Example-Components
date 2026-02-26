import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { useGoalDisplayValue } from '~Goals/hooks/useGoalDisplayValue';
import { CurrentGoalValueType } from '~Goals/const/types';

const StyledGoalTargetValue = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '& .formattedTargetValue': {
    whiteSpace: 'nowrap',
  },
});

interface ViewProps {
  goalValue: number,
  displayLabel: Goals.MeasurementUnit['displayLabel'],
  labelPositionId: Goals.MeasurementUnitPosition['id'],
  hideUnitLabel?: boolean,
  isCurrency?: boolean,
  isAddSpaceSeparator: boolean,
}

const View = ({
  goalValue,
  displayLabel,
  labelPositionId,
  hideUnitLabel = false,
  isCurrency,
  isAddSpaceSeparator,
  ...props
}: ViewProps): JSX.Element => {
  // Pre-compute prefix and suffix to ensure stable references
  const prefix = labelPositionId === Goals.LabelPositionId.Prefix && displayLabel ? `${displayLabel}${isAddSpaceSeparator ? ' ' : ''}` : '';
  const suffix = labelPositionId === Goals.LabelPositionId.Suffix && displayLabel ? `${isAddSpaceSeparator ? ' ' : ''}${displayLabel}` : '';

  return (
    <StyledGoalTargetValue {...props}>
      <NumericFormat
        key={`${labelPositionId}-${displayLabel}`} // Force re-render when these change
        className="formattedTargetValue"
        value={goalValue}
        thousandSeparator=","
        decimalSeparator="."
        prefix={hideUnitLabel ? '' : prefix}
        suffix={hideUnitLabel ? '' : suffix}
        displayType="text"
        allowNegative
        allowLeadingZeros={false}
        decimalScale={isCurrency ? 2 : undefined}
        fixedDecimalScale={isCurrency}
      />
    </StyledGoalTargetValue>
  );
};

interface GoalTargetValueProps extends Pick<ViewProps, 'hideUnitLabel'> {
  measurementScale: Goals.MeasurementScale,
  statusUpdate?: Goals.GoalStatusUpdate,
  goalValueType: CurrentGoalValueType | Goals.MeasurementScaleMetadataTypeId,
}

/**
 * @deprecated Use goals/components/Shared/GoalValueFormatted instead
 */

const GoalValueFormatted = ({
  measurementScale,
  statusUpdate,
  goalValueType,
  ...props
}: GoalTargetValueProps): JSX.Element => {
  const {
    goalValue,
    displayLabel,
    labelPositionId,
    isCurrency,
  } = useGoalDisplayValue({
    measurementScale,
    statusUpdate,
    goalValueType,
  });

  const isAddSpaceSeparator = displayLabel.length > 1 && !isCurrency;

  const hookProps = {
    goalValue,
    displayLabel,
    labelPositionId,
    isCurrency,
    isAddSpaceSeparator,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default GoalValueFormatted;
