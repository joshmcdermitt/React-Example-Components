import useGetGoalMeasurementScaleEnumData from '~Goals/hooks/utils/useGetGoalMeasurementScaleEnumData';
import NumberInput from './Shared/NumberInput';

type TargetNumberInputProps = {
  required?: boolean;
}

const TargetNumberInput = ({ required = false, ...props }: TargetNumberInputProps): JSX.Element => {
  const { contextTargetValueIndex } = useGetGoalMeasurementScaleEnumData();

  return (
    <NumberInput
      label="Target number"
      dataTestId="goalsTargetNumber"
      name={`measurementScaleMetadata.${contextTargetValueIndex}.value`}
      required={required}
      {...props}
    />
  );
};

export default TargetNumberInput;
