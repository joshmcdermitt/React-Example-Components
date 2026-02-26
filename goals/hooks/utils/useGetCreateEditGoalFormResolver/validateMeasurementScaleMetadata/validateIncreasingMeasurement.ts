import { TestContext, ValidationError } from 'yup';

interface ValidateIncreasingMeasurementParams {
  initialValue: number,
  targetValue: number,
  context: TestContext,
}

const validateIncreasingMeasurement = ({
  initialValue,
  targetValue,
  context,
}: ValidateIncreasingMeasurementParams): boolean | ValidationError => (
  initialValue < targetValue || context.createError({
    path: `${context.path}[0].value`,
    message: 'The initial number must be less than the target number.',
  })
);

export default validateIncreasingMeasurement;
