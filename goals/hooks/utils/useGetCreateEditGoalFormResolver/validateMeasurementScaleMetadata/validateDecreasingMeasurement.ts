import { TestContext, ValidationError } from 'yup';

interface ValidateDecreasingMeasurementParams {
  initialValue: number,
  targetValue: number,
  context: TestContext,
}

const validateDecreasingMeasurement = ({
  initialValue,
  targetValue,
  context,
}: ValidateDecreasingMeasurementParams): boolean | ValidationError => (
  initialValue > targetValue || context.createError({
    path: `${context.path}[0].value`,
    message: 'The initial number must be greater than the target number.',
  })
);

export default validateDecreasingMeasurement;
