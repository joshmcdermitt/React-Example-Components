import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { CurrentGoalValueType } from '~Goals/const/types';
import { getIsGoalValueCurrency } from '~Goals/utils';

export interface UseGoalTargetValueProps {
  measurementScale: Goals.MeasurementScale,
  statusUpdate?: Goals.GoalStatusUpdate,
  goalValueType?: CurrentGoalValueType | Goals.MeasurementScaleMetadataTypeId,
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
}: UseGoalTargetValueProps): GoalTargetValueResult => useMemo(() => {
  const source = statusUpdate?.snapshotInformation || measurementScale;
  const { displayLabel, labelPosition } = source.measurementUnitType;
  const isCurrency = getIsGoalValueCurrency({ displayLabel, labelPositionId: labelPosition.id });

  const getRawValue = (): RawValueType | undefined => {
    if (goalValueType === CurrentGoalValueType.CurrentValue) {
      // For current value, first try statusUpdate.value, then measurementScale.currentValue
      if (statusUpdate?.value !== undefined && statusUpdate.value !== null) {
        return statusUpdate.value;
      }
      if (measurementScale.currentValue !== undefined && measurementScale.currentValue !== null) {
        return measurementScale.currentValue;
      }
      return undefined;
    }

    // For metadata values, find the matching value by goalValueType
    const metadataValue = source.metadataValues?.find(
      (metadata: Goals.MeasurementScaleMetadataValue) => metadata.id === goalValueType,
    );
    return metadataValue?.value;
  };

  const value = getRawValue();
  const goalValue = value === undefined || value === null ? 0 : Number(value);

  // const shortValue: string = source.metadataValues?.find((metadataValues) => metadataValues.id === goalValueType)?.shortLabel ?? '';

  return {
    displayLabel,
    labelPositionId: labelPosition.id,
    goalValue,
    // shortValue,
    isCurrency,
  };
}, [goalValueType, measurementScale, statusUpdate?.snapshotInformation, statusUpdate?.value]);
