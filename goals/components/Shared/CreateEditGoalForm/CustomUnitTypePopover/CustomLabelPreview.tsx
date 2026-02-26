import { Goals } from '@josh-hr/types';
import { NumericFormat } from 'react-number-format';

interface CustomLabelPreviewProps {
  goalTargetValue: Goals.MeasurementScaleMetadataValue['value'];
  currentLabelPositionId: Goals.LabelPositionId;
  currentDisplayLabel: string;
  prefix?: string;
  suffix?: string;
}

const CustomLabelPreview = ({
  goalTargetValue,
  currentLabelPositionId,
  currentDisplayLabel,
  prefix,
  suffix,
}: CustomLabelPreviewProps): JSX.Element => (
  // REFACTOR: Can we combine with GoalTargetValue or extract ?
  <NumericFormat
    key={`${currentLabelPositionId}-${currentDisplayLabel}`} // Force re-render when these change
    className="formattedTargetValue"
    value={goalTargetValue as string}
    thousandSeparator=","
    decimalSeparator="."
    prefix={prefix}
    suffix={suffix}
    displayType="text"
    allowNegative
    allowLeadingZeros={false}
  />
);
export default CustomLabelPreview;
