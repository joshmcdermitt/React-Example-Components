import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { GoalMeasurementScaleTypeCategory } from './useGetGoalMeasurementScaleTypeCategory';

const idsDisplayingCurrentValue = {
  unitTypes: [2] as Goals.MeasurementUnit['id'][], // Units: $
  scaleTypeCategories: [GoalMeasurementScaleTypeCategory.IncreaseDecrease], // Types:IncreaseDecrease
};

// Will display if IncreaseDecrease type AND $ system unit type
// eslint-disable-next-line max-len
const getIsScaleTypeDisplayingCurrentValue = (scaleTypeCategory: GoalMeasurementScaleTypeCategory): boolean => (
  idsDisplayingCurrentValue.scaleTypeCategories.includes(scaleTypeCategory)
);

const getIsUnitTypeDisplayingCurrentValue = (unitTypeId?: Goals.MeasurementUnit['id']): boolean => (
  unitTypeId !== undefined && idsDisplayingCurrentValue.unitTypes.includes(unitTypeId)
);

interface UseGetIsDisplayingCurrentValueInputProps {
  scaleTypeCategory: GoalMeasurementScaleTypeCategory;
  unitTypeId?: Goals.MeasurementUnit['id'];
}

interface UseGetIsDisplayingCurrentValueInputReturn {
  isUnitTypeDisplayingCurrentValue: boolean;
  isScaleTypeDisplayingCurrentValue: boolean;
  isGoalDisplayingCurrentValue: boolean;
}

const useGetIsDisplayingCurrentValueInput = ({
  scaleTypeCategory,
  unitTypeId,
}: UseGetIsDisplayingCurrentValueInputProps): UseGetIsDisplayingCurrentValueInputReturn => {
  const isUnitTypeDisplayingCurrentValue = useMemo((): boolean => getIsUnitTypeDisplayingCurrentValue(unitTypeId), [unitTypeId]);
  const isScaleTypeDisplayingCurrentValue = useMemo((): boolean => getIsScaleTypeDisplayingCurrentValue(scaleTypeCategory), [scaleTypeCategory]);

  const isGoalDisplayingCurrentValue = useMemo((): boolean => (
    isUnitTypeDisplayingCurrentValue && isScaleTypeDisplayingCurrentValue
  ), [isUnitTypeDisplayingCurrentValue, isScaleTypeDisplayingCurrentValue]);

  return {
    isUnitTypeDisplayingCurrentValue,
    isScaleTypeDisplayingCurrentValue,
    isGoalDisplayingCurrentValue,
  };
};

export default useGetIsDisplayingCurrentValueInput;
