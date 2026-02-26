import useGetGoalMeasurementScaleEnumData from '~Goals/hooks/utils/useGetGoalMeasurementScaleEnumData';
import NumberInput from './Shared/NumberInput';

type InitialNumberInputProps = {
  required?: boolean;
}

const InitialNumberInput = ({ required = false, ...props }: InitialNumberInputProps): JSX.Element | null => {
  const { contextInitialValueIndex } = useGetGoalMeasurementScaleEnumData();
  return (
    <NumberInput
      label="Initial number"
      dataTestId="goalsInitialNumber"
      name={`measurementScaleMetadata.${contextInitialValueIndex}.value`}
      required={required}
      {...props}
    />
  );
};

export default InitialNumberInput;
