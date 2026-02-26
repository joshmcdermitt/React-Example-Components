import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { palette } from '~Common/styles/colorsRedesign';

interface UseGetGoalTargetStatusColorParams {
  targetValue?: number;
  currentValue?: number | boolean;
  measurementScaleTypeId: Goals.MeasurementScaleTypeId;
}

interface GetGoalTargetStatusColorParams {
  targetValue?: number;
  currentValue?: number | boolean;
  measurementScaleTypeId: Goals.MeasurementScaleTypeId;
}

export interface UseGetGoalTargetStatusColorReturn {
  goalStatusColor: string;
  goalStatusType: statusType;
}

export type statusType = 'positive' | 'negative' | 'neutral';

const getStatusType = ({
  targetValue, currentValue, measurementScaleTypeId,
}: GetGoalTargetStatusColorParams): statusType => {
  if (
    !targetValue
    || measurementScaleTypeId === Goals.MeasurementScaleTypeId.AchievedOrNot
    || typeof currentValue !== 'number'
  ) return 'neutral';

  switch (measurementScaleTypeId) {
    case Goals.MeasurementScaleTypeId.IncreaseTo:
      return currentValue >= targetValue ? 'positive' : 'negative';
    case Goals.MeasurementScaleTypeId.DecreaseTo:
      return currentValue <= targetValue ? 'positive' : 'negative';
    case Goals.MeasurementScaleTypeId.KeepAbove:
      return currentValue >= targetValue ? 'positive' : 'negative';
    case Goals.MeasurementScaleTypeId.KeepBelow:
      return currentValue <= targetValue ? 'positive' : 'negative';
    default:
      return 'neutral';
  }
};

const getStatusColor = (statusType: statusType): string => {
  return palette.foreground.disabled.default;

  // FUTURE: Remove above return when we want to enable colors
  switch (statusType) {
    case 'positive':
      return palette.utility.success[600];
    case 'negative':
      return palette.foreground.errorPrimary;
    case 'neutral':
    default:
      return palette.foreground.disabled.default;
  }
};

const formatTargetValue = (targetValue: string | number | undefined): number | undefined => {
  if (typeof targetValue === 'string') return parseFloat(targetValue);
  if (typeof targetValue === 'number') return targetValue;
  return targetValue;
};

const formatCurrentValue = (currentValue: number | boolean | undefined): number | boolean | undefined => {
  if (typeof currentValue === 'undefined') return 0;
  return currentValue;
};

const useGetGoalTargetStatusColor = ({
  targetValue, currentValue, measurementScaleTypeId,
}: UseGetGoalTargetStatusColorParams): UseGetGoalTargetStatusColorReturn => {
  const formattedTargetValue: number | undefined = formatTargetValue(targetValue);
  const formattedCurrentValue: number | boolean | undefined = formatCurrentValue(currentValue);

  const goalStatusType: statusType = useMemo(() => getStatusType({
    targetValue: formattedTargetValue, currentValue: formattedCurrentValue, measurementScaleTypeId,
  }), [formattedTargetValue, formattedCurrentValue, measurementScaleTypeId]);

  const goalStatusColor: string = useMemo(() => getStatusColor(goalStatusType), [goalStatusType]);

  return {
    goalStatusColor,
    goalStatusType,
  };
};

export default useGetGoalTargetStatusColor;
