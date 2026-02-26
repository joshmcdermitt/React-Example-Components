import { getAboveBelowStatus } from '~Goals/const/functions';
import { CurrentGoalValueType } from '~Goals/const/types';
import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import { memo } from 'react';
import GoalValueFormatted from './GoalValueFormattedDeprecated';

const styles = {
  container: css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
  }),
};

interface AboveBelowStatusProps {
  currentValue: Goals.GoalStatusUpdate['value'] | Goals.MeasurementScale['currentValue'],
  targetValue: Goals.MeasurementScaleMetadataValue['value'],
  measurementScale: Goals.MeasurementScale,
  statusUpdate?: Goals.GoalStatusUpdate,
  hideUnitLabel?: boolean,
}

const AboveBelowStatus = ({
  currentValue,
  targetValue,
  measurementScale,
  statusUpdate,
  hideUnitLabel,
}: AboveBelowStatusProps): JSX.Element => {
  // Only show comparison if both values are valid numbers
  const currentNum = Number(currentValue);
  const targetNum = Number(targetValue);
  const hasValidValues = !Number.isNaN(currentNum) && !Number.isNaN(targetNum);

  if (!hasValidValues) {
    return (
      <div css={styles.container}>
        <GoalValueFormatted
          measurementScale={measurementScale}
          statusUpdate={statusUpdate}
          goalValueType={CurrentGoalValueType.CurrentValue}
          hideUnitLabel={hideUnitLabel}
        />
      </div>
    );
  }

  const aboveBelowStatusText = getAboveBelowStatus(currentNum, targetNum);

  return (
    <div css={styles.container}>
      {`${aboveBelowStatusText as string} (`}
      <GoalValueFormatted
        measurementScale={measurementScale}
        statusUpdate={statusUpdate}
        goalValueType={CurrentGoalValueType.CurrentValue}
        hideUnitLabel={hideUnitLabel}
      />
      )
    </div>
  );
};

export default memo(AboveBelowStatus, (prevProps, nextProps) => (
  prevProps.currentValue === nextProps.currentValue
  && prevProps.targetValue === nextProps.targetValue
  && prevProps.measurementScale === nextProps.measurementScale
  && prevProps.statusUpdate === nextProps.statusUpdate
  && prevProps.hideUnitLabel === nextProps.hideUnitLabel
));
