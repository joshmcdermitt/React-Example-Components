import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import { styled } from '@mui/material';
import { memo, useMemo } from 'react';
import { useCheckPageLocation } from '~Common/hooks/usePageLocation';
import { RouteName } from '~Common/const/routeName';
import { GoalCurrentMetadata } from '~Goals/const/types';
import Tooltip from '~Common/components/Tooltip';
import GoalProgressBar from '../../GoalProgressBar';
import GoalValueFormatted from '../../TargetValue/GoalValueFormattedV4';

const styles = {
  currentValue: css({
    display: 'flex',
    whiteSpace: 'nowrap',
    fontSize: '.875rem',
    flexGrow: 1,
    flexWrap: 'nowrap',
  }),
  container: css({
    gap: '.25rem',

  }),
  linearProgressWrapper: css({
    display: 'block',
    width: '100%',
  }),
  tooltip: css({
    fontSize: '.75rem',
    fontWeight: '600',
    borderRadius: '.5rem',
    whiteSpace: 'nowrap',
  }),
};

const StyledIncreaseOrDecreaseValue = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacings.large,
  width: '100%',
}));

interface ViewProps {
  status: Goals.GoalStatus,
  completionPercentage?: number,
  showSmallText?: boolean,
  isViewingHome: boolean,
  isCurrentValueVisible: boolean,
  currentValueMetadata?: GoalCurrentMetadata,
  hideProgressPercentage?: boolean,
  hideProgressPointer?: boolean,
  measurementScale: Goals.CondensedMeasurementScale,
  statusUpdate: Goals.CondensedStatusUpdate,
  tooltipContent: () => JSX.Element,
}

const View = ({
  completionPercentage,
  currentValueMetadata,
  hideProgressPercentage,
  isCurrentValueVisible,
  measurementScale,
  statusUpdate,
  showSmallText = false,
  status,
  hideProgressPointer,
  tooltipContent,
  ...props
}: ViewProps): JSX.Element => (
  <StyledIncreaseOrDecreaseValue css={styles.container} {...props}>
    <Tooltip content={tooltipContent()} css={styles.tooltip}>
      <div css={styles.linearProgressWrapper} className="linearProgressWrapper">
        <GoalProgressBar
          percentage={completionPercentage ?? 0}
          status={status}
          isSmallText={showSmallText}
          isTextHidden={hideProgressPercentage}
          labelDisplayType="right"
          isIconHidden={hideProgressPointer}
        />
      </div>
    </Tooltip>
    {isCurrentValueVisible
      && (
        <div css={styles.currentValue}>
          {typeof currentValueMetadata?.currentValue === 'number' && (
            <>
              (
              <GoalValueFormatted
                measurementScale={measurementScale}
                statusUpdate={statusUpdate}
                goalValueType={Goals.MeasurementScaleMetadataTypeId.TargetValue}
              />
              )
            </>
          )}
        </div>
      )}
  </StyledIncreaseOrDecreaseValue>
);

/**
 * @params status
 * @params completionPercentage
 * @params showSmallText
 * @params hideProgressPercentage
 * @params goalMeasurementScaleTypeCategory
 * @params currentValueMetadata
 * @params isCurrentValueVisible Required, dependent on page/component design
 */
interface IncreaseOrDecreaseValueProps extends Pick<ViewProps,
  'status'
  | 'completionPercentage'
  | 'showSmallText'
  | 'hideProgressPercentage'
  | 'hideProgressPointer'
  | 'measurementScale'
  | 'statusUpdate'
> {
  currentValueMetadata?: GoalCurrentMetadata,
  isCurrentValueVisible?: boolean,
}

const IncreaseOrDecreaseValue = ({
  completionPercentage,
  showSmallText,
  currentValueMetadata,
  isCurrentValueVisible = true,
  ...props
}: IncreaseOrDecreaseValueProps): JSX.Element => {
  const isViewingHome: boolean = useCheckPageLocation([RouteName.Home]);

  const linearProgressValue = useMemo(() => {
    if (!completionPercentage || completionPercentage < 0) {
      return 0;
    }
    if (completionPercentage > 100) {
      return 100;
    }
    return completionPercentage;
  }, [completionPercentage]);

  const tooltipContent = (): JSX.Element => {
    if (typeof currentValueMetadata?.currentValue !== 'number') {
      return <div>No value set</div>;
    }
    if (currentValueMetadata?.measurementUnitType?.labelPosition?.id === Goals.LabelPositionId.Prefix) {
      return <div>{`${currentValueMetadata.measurementUnitType.displayLabel}${currentValueMetadata.currentValue}`}</div>;
    }
    return (
      <div>{`${currentValueMetadata.currentValue}${currentValueMetadata.measurementUnitType.displayLabel}`}</div>
    );
  };

  const hookProps = {
    linearProgressValue,
    completionPercentage,
    showSmallText,
    isViewingHome,
    isCurrentValueVisible,
    currentValueMetadata,
    tooltipContent,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default memo(IncreaseOrDecreaseValue, (prevProps, nextProps) => (
  prevProps.status === nextProps.status
  && prevProps.completionPercentage === nextProps.completionPercentage
));
