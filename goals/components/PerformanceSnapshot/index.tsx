import MultiColorProgressBar from '~Goals/components/PerformanceSnapshot/MultiColorProgressBar';
import SnapshotCard from '~Goals/components/PerformanceSnapshot/SnapshotCard';
import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { useGetPerformanceSnapshot } from '~Goals/hooks/useGetPerformanceSnapshot';
import { useMemo } from 'react';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { CardSkeleton } from '~Common/V3/components/Card';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { useGetHistoricalPerformanceSnapshot } from '~Goals/hooks/useGetHistoricalPerformanceSnapshot';

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  }),
  cardsRow: css({
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    width: '100%',
    flexWrap: 'wrap',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  }),
  snapshotCard: css({
    display: 'flex',
    gap: '.75rem',
    border: '1px solid #e0e0e0',
    borderRadius: '.25rem',
    padding: '.75rem',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: '1',
    minWidth: '100px',
    maxWidth: 'none',
    minHeight: '105px',
  }),
};

export interface PerformanceSnapshotContainerProps {
  payload: Goals.Requests.GetGoalsRequestBody;
  enableCascadingGoals: boolean;
}

const PerformanceSnapshotContainer = ({
  payload,
  enableCascadingGoals,
}: PerformanceSnapshotContainerProps): JSX.Element => {
  const { data: performanceData, isLoading } = useGetPerformanceSnapshot(payload, enableCascadingGoals);
  const metrics = useMemo(() => performanceData, [performanceData]);
  const hasData = metrics && metrics?.length > 0;

  const { data: historicalData } = useGetHistoricalPerformanceSnapshot(payload, enableCascadingGoals);
  const historicalMetrics = useMemo(() => historicalData?.response, [historicalData?.response]);

  const historicalMetricsMap = useMemo(() => {
    if (!historicalMetrics) return new Map();
    return new Map(historicalMetrics.map((metric) => [metric.status, metric]));
  }, [historicalMetrics]);

  const enrichedMetrics = useMemo(() => {
    if (!metrics) return [];
    return metrics.map((metric) => {
      const historicalMetric = historicalMetricsMap.get(metric.status) as Goals.PerformanceSnapshotItem | undefined;
      const percentChanged = historicalMetric
        ? metric.percentage - historicalMetric.percentage
        : undefined;

      return {
        ...metric,
        percentChanged,
      };
    });
  }, [metrics, historicalMetricsMap]);

  const [showSkeleton] = useSkeletonLoaders(isLoading);

  return (
    <div css={styles.container}>
      <Typography fontSize="1.25rem" fontWeight="600" component="p">
        Performance Snapshot
      </Typography>
      <MultiColorProgressBar performanceData={metrics} isLoading={showSkeleton} />
      {showSkeleton && (
        <MultipleSkeletonLoaders
          css={styles.cardsRow}
          numberOfSkeletons={4}
          renderSkeletonItem={() => (
            <CardSkeleton css={styles.snapshotCard} />
          )}
        />
      )}
      {metrics && !hasData && !showSkeleton && (
        <div css={styles.cardsRow}>
          <SnapshotCard
            key="performance-snapshot-no-data"
          />
        </div>
      )}
      {metrics && hasData && !showSkeleton && (
        <div css={styles.cardsRow}>
          {enrichedMetrics.map((metric) => (
            <SnapshotCard
              key={`performance-snapshot-${metric.status}`}
              percentage={metric.percentage}
              status={metric.status}
              percentChanged={metric.percentChanged}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PerformanceSnapshotContainer;
