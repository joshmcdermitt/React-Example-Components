import { useMemo } from 'react';
import { Goals } from '@josh-hr/types';

export interface ReturnTargetDataReturn {
  typeId: Goals.MeasurementScaleTypeId | number | undefined;
  displayLabel: string;
  targetValue: number | undefined;
  measurementUnitType: Goals.MeasurementUnit;
  shortLabel?: string;
  connectingText: string;
}

// REFACTOR: Utilize this function in other components
export const getTargetData = (
  measurementScale: Goals.CondensedMeasurementScale,
): Goals.MeasurementScaleMetadataValue | undefined => {
  const { type: { id } } = measurementScale;
  switch (id) {
    case Goals.MeasurementScaleTypeId.IncreaseTo:
    case Goals.MeasurementScaleTypeId.DecreaseTo:
    case Goals.MeasurementScaleTypeId.KeepAbove:
    case Goals.MeasurementScaleTypeId.KeepBelow:
      return measurementScale.metadataValues
        ?.find((metadataValues: Goals.MeasurementScaleMetadataValue) => metadataValues.id === Goals.MeasurementScaleMetadataTypeId.TargetValue);
    case Goals.MeasurementScaleTypeId.AchievedOrNot:
    default:
      return undefined;
  }
};

const getConnectingText = (
  typeId: Goals.MeasurementScaleTypeId | number | undefined,
): string => {
  switch (typeId) {
    case Goals.MeasurementScaleTypeId.IncreaseTo:
    case Goals.MeasurementScaleTypeId.DecreaseTo:
      return 'to';
    case Goals.MeasurementScaleTypeId.KeepAbove:
      return 'above';
    case Goals.MeasurementScaleTypeId.KeepBelow:
      return 'below';
    case Goals.MeasurementScaleTypeId.AchievedOrNot:
      return 'Achieved / not';
    default:
      return '';
  }
};

export const useReturnTargetData = (measurementScale: Goals.CondensedMeasurementScale): ReturnTargetDataReturn => useMemo(() => {
  const { measurementUnitType: { displayLabel }, type: { id } } = measurementScale;
  const typeId = measurementScale.type.id as Goals.MeasurementScaleTypeId ?? undefined;

  const connectingText = getConnectingText(typeId);
  const targetData = getTargetData(measurementScale);
  const { measurementUnitType } = measurementScale;

  return {
    typeId: id,
    connectingText,
    displayLabel,
    targetValue: targetData?.value as number || undefined,
    measurementUnitType,
    shortLabel: targetData?.shortLabel,
  };
}, [measurementScale]);
