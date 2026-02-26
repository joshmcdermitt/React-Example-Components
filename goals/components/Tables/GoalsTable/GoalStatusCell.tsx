import { css } from '@emotion/react';
import { GoalProgressV4, RequireSome } from '~Goals/const/types';
import useGetGoalMeasurementScaleTypeCategory, { GoalMeasurementScaleTypeCategory } from '~Goals/hooks/utils/useGetGoalMeasurementScaleTypeCategory';
import { Goals } from '@josh-hr/types';
import GoalMeasurementValue from '~Goals/components/Shared/GoalStatus/GoalMeasurementValue/GoalMeasurementValue';
import { formatStatusCase } from '~Goals/const/functions';

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }),
  textContainer: css({
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5rem',
    justifyContent: 'space-between',
  }),
  achievedNot: ($showSmallText?: boolean) => css({
    fontSize: $showSmallText ? '.6875rem' : '.8125rem',
    whiteSpace: 'nowrap',
    fontWeight: 500,
  }),
};

interface GoalStatusCellProps extends RequireSome<GoalProgressV4,
  'percentage'
  | 'status'
  | 'measurementScale'
  | 'statusUpdate'
> {
  hideProgressCurrentValue?: boolean;
  hideProgressPercentage?: boolean;
}

const GoalStatusCell = ({
  percentage,
  status,
  measurementScale,
  statusUpdate,
  hideProgressCurrentValue = false,
  hideProgressPercentage = false,
}: GoalStatusCellProps): JSX.Element => {
  const { goalMeasurementScaleTypeCategory } = useGetGoalMeasurementScaleTypeCategory({ measurementScaleTypeId: measurementScale.type.id });
  const { isAchieved } = statusUpdate;
  const { measurementUnitType } = measurementScale;
  const visibleUnitIds = [Goals.SystemMeasurementUnitTypeId.Percentage, Goals.SystemMeasurementUnitTypeId.Dollars];
  const isSystemUnit = visibleUnitIds.includes(measurementUnitType.id);

  const textRight: JSX.Element = (
    <div>
      {goalMeasurementScaleTypeCategory === GoalMeasurementScaleTypeCategory.IncreaseDecrease && (
        <div>{`${percentage ?? 0}%`}</div>
      )}
    </div>
  );

  return (
    <>
      <div css={styles.container}>
        <GoalMeasurementValue
          completionPercentage={percentage}
          hideProgressPointer
          hideAboveBelowUnitLabel={!isSystemUnit} // Hide except system units
          hideProgressPercentage={hideProgressPercentage}
          isAchieved={isAchieved}
          isCurrentValueVisible={!hideProgressCurrentValue}
          measurementScale={measurementScale}
          showSmallText={false}
          status={status}
          statusUpdate={statusUpdate}
        />
        <div css={styles.textContainer}>
          <div>{formatStatusCase(status)}</div>
          <div>{textRight}</div>
        </div>
      </div>
    </>
  );
};

export default GoalStatusCell;
