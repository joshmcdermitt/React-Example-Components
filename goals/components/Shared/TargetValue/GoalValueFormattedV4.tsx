import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { useGoalDisplayValue } from '~Goals/hooks/useGoalDisplayValueV4';
import { CurrentGoalValueType } from '~Goals/const/types';

const StyledGoalTargetValue = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '& .formattedTargetValue': {
    whiteSpace: 'nowrap',
  },
});

interface ViewProps {
  goalValue: Goals.MeasurementScaleMetadataValue['value'] | Goals.MeasurementScale['currentValue'],
  displayLabel: Goals.MeasurementUnit['displayLabel'],
  labelPositionId: Goals.MeasurementUnitPosition['id'],
  hideUnitLabel?: boolean,
  isCurrency?: boolean,
  isAddSpaceSeparator: boolean,
  prefix: string,
  suffix: string,
  showSmallText?: boolean,
}

const View = ({
  goalValue,
  displayLabel,
  labelPositionId,
  hideUnitLabel = false,
  isCurrency,
  prefix,
  suffix,
  ...props
}: ViewProps): JSX.Element => (
  <StyledGoalTargetValue {...props}>
    <NumericFormat
      key={`${labelPositionId}-${displayLabel}`} // Force re-render when these change
      className="formattedTargetValue"
      value={goalValue as string}
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

interface GoalTargetValueProps extends Pick<ViewProps, 'hideUnitLabel'> {
  measurementScale: Goals.CondensedMeasurementScale,
  statusUpdate: Goals.CondensedStatusUpdate,
  goalValueType: CurrentGoalValueType | Goals.MeasurementScaleMetadataTypeId,
  hideUnitLabel?: boolean,
}

const GoalValueFormatted = ({
  measurementScale,
  statusUpdate,
  goalValueType,
  hideUnitLabel,
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

  // Pre-compute prefix and suffix to ensure stable references
  const prefix = labelPositionId === Goals.LabelPositionId.Prefix ? `${displayLabel}${isAddSpaceSeparator ? ' ' : ''}` : '';
  const suffix = labelPositionId === Goals.LabelPositionId.Suffix ? `${isAddSpaceSeparator ? ' ' : ''}${displayLabel}` : '';

  const hookProps = {
    displayLabel,
    goalValue,
    isAddSpaceSeparator,
    isCurrency,
    labelPositionId,
    prefix,
    suffix,
    hideUnitLabel,
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
