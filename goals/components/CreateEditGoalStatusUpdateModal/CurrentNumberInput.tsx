import NumberInput from '~Goals/components/Shared/GoalStatus/NumberInput';

interface CurrentNumberInputProps {
  required: boolean;
  isLabelHidden?: boolean;
}

const CurrentNumberInput = ({ required = false, ...props }: CurrentNumberInputProps): JSX.Element => (
  <NumberInput
    label="New Value"
    dataTestId="goalsCurrentNumber"
    name="value"
    required={required}
    {...props}
  />
);

export default CurrentNumberInput;
