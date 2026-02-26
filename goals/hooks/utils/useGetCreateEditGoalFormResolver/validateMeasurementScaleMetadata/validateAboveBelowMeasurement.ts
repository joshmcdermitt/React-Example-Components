import { TestContext, ValidationError } from 'yup';

interface ValidateDecreasingMeasurementParams {
  initialValue: number,
  targetValue: number,
  context: TestContext,
}

const validateAboveBelowMeasurement = ({
  initialValue,
  targetValue,
  context,
}: ValidateDecreasingMeasurementParams): boolean | ValidationError => (
  (typeof initialValue === 'number' && typeof targetValue === 'number') || context.createError({
    path: `${context.path}[0].value`,
    message: 'The target must be a valid number.',
  })
);

export default validateAboveBelowMeasurement;
