// REFACTOR: to use useGetMeasurementScaleTypes and rename as getting context names
import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';

export function getEnumValues<T extends string | number>(props: { type: 'string' | 'number', enum: Record<string, unknown> }): T[] {
  return Object.values(props.enum)
    .filter((key): key is T => typeof key === props.type);
}

type GetGoalMeasurementScaleDataReturn = {
  measurementScaleTypes: number[],
  metadataScaleTypes: number[]
  contextInitialValueIndex: number,
  contextTargetValueIndex: number,
  systemMeasurementUnitTypes: number[],
}

// Regular function to get measurement scale types - use this if you don't need reactivity
export function getMeasurementScaleTypes(): number[] {
  return getEnumValues<number>({ type: 'number', enum: Goals.MeasurementScaleTypeId });
}

// React hook version - use this in components if you need the values in the React lifecycle
export function useMeasurementScaleTypes(): number[] {
  return useMemo(() => getMeasurementScaleTypes(), []);
}

function useGetGoalMeasurementScaleEnumData(): GetGoalMeasurementScaleDataReturn {
  // Increase, Decrease, Achieve/Not, Above/Below
  const measurementScaleTypes = getMeasurementScaleTypes();

  const metadataScaleTypes = getEnumValues<number>({
    type: 'number',
    enum: Goals.MeasurementScaleMetadataTypeId,
  });
  const contextInitialValueIndex = metadataScaleTypes.indexOf(Goals.MeasurementScaleMetadataTypeId.InitialValue);
  const contextTargetValueIndex = metadataScaleTypes.indexOf(Goals.MeasurementScaleMetadataTypeId.TargetValue);

  // Percentage, Dollars
  const systemMeasurementUnitTypes = getEnumValues<number>({ type: 'number', enum: Goals.SystemMeasurementUnitTypeId });

  return {
    measurementScaleTypes,
    metadataScaleTypes,
    contextInitialValueIndex,
    contextTargetValueIndex,
    systemMeasurementUnitTypes,
  };
}

export default useGetGoalMeasurementScaleEnumData;
