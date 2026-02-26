import { Goals } from '@josh-hr/types';
import { TestContext, ValidationError } from 'yup';
import { MeasurementScaleType } from '~Goals/const/types';
import {
  getGoalMeasurementScaleTypeCategory,
  getGoalMeasurementScaleTypeSubCategory,
  GoalMeasurementScaleTypeCategory,
  GoalMeasurementScaleTypeSubCategory,
} from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import validateIncreasingMeasurement from './validateIncreasingMeasurement';
import validateDecreasingMeasurement from './validateDecreasingMeasurement';
import validateAboveBelowMeasurement from './validateAboveBelowMeasurement';

const validateMeasurementScaleMetadata = (
  metadata: Goals.MeasurementScaleMetadataValue[],
  context: TestContext,
): boolean | ValidationError => {
  const initialValue = metadata.find((item) => item.id === Goals.MeasurementScaleMetadataTypeId.InitialValue)?.value as number;
  const targetValue = metadata.find((item) => item.id === Goals.MeasurementScaleMetadataTypeId.TargetValue)?.value as number;
  const { measurementScaleTypeId } = context.parent as { measurementScaleTypeId: Goals.MeasurementScaleType['id'] };

  if (measurementScaleTypeId === MeasurementScaleType.AchievedOrNot) return true; // Skip validation, no metadata

  const goalMeasurementScaleTypeCategory = getGoalMeasurementScaleTypeCategory(measurementScaleTypeId);
  const goalMeasurementScaleTypeSubCategory = getGoalMeasurementScaleTypeSubCategory(measurementScaleTypeId);

  if (goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.IncreaseDecrease) {
    if (!metadata || metadata.length < 2) {
      return true; // Skip validation if there are not enough values
    }

    if (goalMeasurementScaleTypeSubCategory === GoalMeasurementScaleTypeSubCategory.Increase) {
      return validateIncreasingMeasurement({ initialValue, targetValue, context });
    }

    if (goalMeasurementScaleTypeSubCategory === GoalMeasurementScaleTypeSubCategory.Decrease) {
      return validateDecreasingMeasurement({ initialValue, targetValue, context });
    }
  }

  if (goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.AboveBelow) {
    // Only one value is required for the AboveBelow category
    if (!metadata || metadata.length < 1) {
      return true; // Skip validation if there are not enough values
    }

    // These will always be numbers in the AboveBelow category
    return validateAboveBelowMeasurement({ initialValue, targetValue, context });
  }

  return true;
};

export default validateMeasurementScaleMetadata;
