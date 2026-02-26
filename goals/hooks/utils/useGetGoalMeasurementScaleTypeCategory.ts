import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { MeasurementScaleType } from '~Goals/const/types';

export enum GoalMeasurementScaleTypeCategory {
  IncreaseDecrease = 'IncreaseDecrease',
  Achieved = 'Achieved',
  AboveBelow = 'AboveBelow',
  Unknown = 'Unknown',
}

export enum GoalMeasurementScaleTypeSubCategory {
  Increase = 'Increase',
  Decrease = 'Decrease',
  Achieved = 'Achieved',
  NotAchieved = 'Not Achieved',
  Above = 'Above',
  Below = 'Below',
  Unknown = 'Unknown',
}

export const getGoalMeasurementScaleTypeCategory = (scaleType: Goals.MeasurementScaleType['id']): GoalMeasurementScaleTypeCategory => {
  switch (scaleType) {
    case MeasurementScaleType.IncreaseTo:
    case MeasurementScaleType.DecreaseTo:
      return GoalMeasurementScaleTypeCategory.IncreaseDecrease;
    case MeasurementScaleType.AchievedOrNot:
      return GoalMeasurementScaleTypeCategory.Achieved;
    case MeasurementScaleType.KeepAbove:
    case MeasurementScaleType.KeepBelow:
      return GoalMeasurementScaleTypeCategory.AboveBelow;
    default:
      return GoalMeasurementScaleTypeCategory.Unknown;
  }
};

export const getGoalMeasurementScaleTypeSubCategory = (scaleType: Goals.MeasurementUnit['id']): GoalMeasurementScaleTypeSubCategory => {
  switch (scaleType) {
    case MeasurementScaleType.IncreaseTo:
      return GoalMeasurementScaleTypeSubCategory.Increase;
    case MeasurementScaleType.DecreaseTo:
      return GoalMeasurementScaleTypeSubCategory.Decrease;
    case MeasurementScaleType.AchievedOrNot:
      return GoalMeasurementScaleTypeSubCategory.Achieved;
    case MeasurementScaleType.KeepAbove:
      return GoalMeasurementScaleTypeSubCategory.Above;
    case MeasurementScaleType.KeepBelow:
      return GoalMeasurementScaleTypeSubCategory.Below;
    default:
      return GoalMeasurementScaleTypeSubCategory.Unknown;
  }
};

interface UserGetGoalMeasurementScaleTypeCategory {
  measurementScaleTypeId: Goals.MeasurementScaleType['id'],
}

interface UserGetGoalMeasurementMetadataTypeCategoryReturn {
  goalMeasurementScaleTypeCategory: GoalMeasurementScaleTypeCategory,
  goalMeasurementScaleTypeSubCategory: GoalMeasurementScaleTypeSubCategory,
}

const useGetGoalMeasurementScaleTypeCategory = ({
  measurementScaleTypeId,
}: UserGetGoalMeasurementScaleTypeCategory): UserGetGoalMeasurementMetadataTypeCategoryReturn => {
  const goalMeasurementScaleTypeCategory = useMemo(() => getGoalMeasurementScaleTypeCategory(measurementScaleTypeId), [measurementScaleTypeId]);
  const goalMeasurementScaleTypeSubCategory = useMemo(() => getGoalMeasurementScaleTypeSubCategory(measurementScaleTypeId), [measurementScaleTypeId]);

  return {
    goalMeasurementScaleTypeCategory,
    goalMeasurementScaleTypeSubCategory,
  };
};

export default useGetGoalMeasurementScaleTypeCategory;
