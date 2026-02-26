import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { CurrentGoalValueType } from '~Goals/const/types';
import { getIsGoalValueCurrency } from '~Goals/utils';
import { useMeasurementScaleTypes } from '~Goals/hooks/utils/useGetGoalMeasurementScaleEnumData';

export interface UseGoalDisplayValueProps {
  measurementScale: Goals.CondensedMeasurementScale,
  statusUpdate: Goals.CondensedStatusUpdate,
  goalValueType: CurrentGoalValueType | Goals.MeasurementScaleMetadataTypeId,
}

export interface GoalTargetValueResult {
  goalValue: number,
  displayLabel: string,
  labelPositionId: number,
  isCurrency: boolean,
  // shortValue?: string,
}

type RawValueType = Goals.GoalStatusUpdate['value']
  | Goals.MeasurementScale['currentValue']
  | Goals.MeasurementScaleMetadataValue['value'];

export const useGoalDisplayValue = ({
  measurementScale,
  statusUpdate,
  goalValueType,
}: UseGoalDisplayValueProps): GoalTargetValueResult => {
  const measurementScaleTypes = useMeasurementScaleTypes();

  return useMemo<GoalTargetValueResult>(() => {
    const contextInitialValueIndex = measurementScaleTypes.findIndex((type) => type === Goals.MeasurementScaleMetadataTypeId.InitialValue);
    const contextTargetValueIndex = measurementScaleTypes.findIndex((type) => type === Goals.MeasurementScaleMetadataTypeId.TargetValue);

    const { measurementUnitType: { displayLabel, labelPosition }, metadataValues } = measurementScale;
    const { value } = statusUpdate;
    const initialValue = contextInitialValueIndex >= 0 ? metadataValues?.[contextInitialValueIndex]?.value as RawValueType : undefined;
    const targetValue = contextTargetValueIndex >= 0 ? metadataValues?.[contextTargetValueIndex]?.value as RawValueType : undefined;

    const isCurrency = getIsGoalValueCurrency({ displayLabel, labelPositionId: labelPosition.id });

    const rawValue = (): RawValueType | undefined => {
      switch (goalValueType) {
        case CurrentGoalValueType.CurrentValue:
          return value;
        case Goals.MeasurementScaleMetadataTypeId.InitialValue:
          return initialValue;
        case Goals.MeasurementScaleMetadataTypeId.TargetValue:
          return targetValue;
        default:
          return metadataValues?.find((metadata) => metadata.id === goalValueType)?.value as RawValueType;
      }
    };

    const rawVal = rawValue();
    if (rawVal === undefined || rawVal === null) {
      throw new Error('Target value is required.');
    }

    const goalValue = Number(Number(rawVal).toFixed(4));
    if (Number.isNaN(goalValue)) {
      throw new Error('Target value must be a number.');
    }

    return {
      displayLabel,
      labelPositionId: labelPosition.id,
      goalValue,
      isCurrency,
    };
  }, [goalValueType, measurementScale, statusUpdate, measurementScaleTypes]);
};
