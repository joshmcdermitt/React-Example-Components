import { getAboveBelowStatus } from '~Goals/const/functions';
// import { CurrentGoalValueType } from '~Goals/const/types';
import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import { memo } from 'react';
import GoalValueFormatted from '~Goals/components/Shared/TargetValue/GoalValueFormattedV4';
import { CurrentGoalValueType } from '~Goals/const/types';

const styles = {
  container: css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
  }),
};

interface AboveBelowStatusProps {
  currentValue: Goals.CondensedStatusUpdate['value'],
  targetValue: Goals.MeasurementScaleMetadataValue['value'],
  measurementScale: Goals.CondensedMeasurementScale,
  statusUpdate: Goals.CondensedStatusUpdate,
  hideUnitLabel?: boolean,
}

const AboveBelowStatus = ({
  currentValue,
  targetValue,
  measurementScale,
  statusUpdate,
  hideUnitLabel,
}: AboveBelowStatusProps): JSX.Element => {
  const aboveBelowStatusText = getAboveBelowStatus(Number(currentValue), Number(targetValue));

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
