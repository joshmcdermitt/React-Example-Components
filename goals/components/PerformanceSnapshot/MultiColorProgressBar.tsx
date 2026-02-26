import React from 'react';
import { css } from '@emotion/react';
import { forMobileObject } from '~Common/styles/mixins';
import { getGoalStatusColor } from '~Goals/hooks/utils/useGetGoalStatusColor';
import { useTheme } from '@mui/material';
import { Goals } from '@josh-hr/types';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { getGoalStatusName } from '~Common/utils/getStatusName/getGoalStatusName';

const styles = {
  progressBarContainer: css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    width: '100%',
    height: '0.875rem', // Changed from maxHeight to height
    borderRadius: '1rem',
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
  }, forMobileObject({
    height: '1rem', // Changed from maxHeight to height
  })),
  segmentsWrapper: css({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  }),
  segment: (color: string, isClickable: boolean) => css({
    backgroundColor: color,
    border: 'none',
    height: '100%',
    transition: 'all 0.3s ease',
    cursor: isClickable ? 'pointer' : 'default',
    '&:hover': isClickable ? {
      opacity: 0.8,
      transform: 'scaleY(1.1)',
    } : {},
    '&:active': isClickable ? {
      transform: 'scaleY(1.05)',
    } : {},
  }),
};

interface MultiColorProgressBarProps {
    performanceData?: Goals.PerformanceSnapshotItem[];
    isLoading: boolean;
}

const MultiColorProgressBar: React.FC<MultiColorProgressBarProps> = ({ performanceData, isLoading }) => {
  // Get theme for direct color calculation
  const theme = useTheme();
  const { setStatusFilter, statusFilter, resetFilters } = useGoalsContext();

  // Create a processed array with colors at the top level of the component
  const processedData = performanceData?.map((data) => {
    // Use the imported getGoalStatusColor function directly with theme
    const color = getGoalStatusColor({ status: data.status, theme });
    return {
      ...data,
      color,
    };
  });

  const handleSegmentClick = (status: Goals.GoalStatus): void => {
    if (statusFilter.includes(status)) {
      resetFilters();
    } else {
      setStatusFilter([status]);
    }
  };

  return (
    <div css={styles.progressBarContainer}>
      <div css={styles.segmentsWrapper}>
        {isLoading && (
          <div css={styles.segment(theme.palette.utility.gray500, false)} />
        )}
        {!isLoading && processedData?.map((data) => {
          // Create a more stable key using the percentage and status
          const segmentKey = `segment-${data.percentage}-${data.status}`;
          const hasData = data.percentage > 0;

          if (!hasData) {
            return (
              <div
                key={segmentKey}
                css={styles.segment(data.color, false)}
                style={{ width: `${data.percentage}%` }}
              />
            );
          }

          return (
            <button
              key={segmentKey}
              css={styles.segment(data.color, true)}
              style={{ width: `${data.percentage}%` }}
              onClick={() => handleSegmentClick(data.status)}
              aria-label={`Filter goals by ${getGoalStatusName(data.status)} status`}
              type="button"
            />
          );
        })}
      </div>
    </div>
  );
};

export default MultiColorProgressBar;
