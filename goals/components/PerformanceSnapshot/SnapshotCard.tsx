import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import StatusBadge from '../Shared/GoalStatus/StatusBadge';
import PercentageChanged from './PercentageChanged';

const styles = {
  snapshotCard: css({
    backgroundColor: '#fff',
    display: 'flex',
    gap: '.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '.75rem',
    padding: '.75rem',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: '1',
    minWidth: '205px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#f8f9fa',
      borderColor: '#c0c0c0',
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    },
    '&:focus-visible': {
      outline: '2px solid #1976d2',
      outlineOffset: '2px',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.6,
      '&:hover': {
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
        transform: 'none',
        boxShadow: 'none',
      },
    },
  }),
  badgeWrapper: css({
    display: 'inline-flex',
    width: 'fit-content',
    // marginBottom: '.25rem',
  }),
  percentageText: css({
    marginTop: 0, // Reset any default margins
    marginBottom: '0rem',
    fontWeight: '600',
    lineHeight: 1, // Reduce line height to match text size
  }),
  percentageContainer: css({
    display: 'flex',
    flexDirection: 'row',
    gap: '.75rem',
    alignItems: 'flex-start',
  }),
  badge: css({
    minHeight: '1.5rem',
  }),
};

interface SnapshotCardProps {
  percentage?: number;
  status?: Goals.GoalStatus;
  percentChanged?: number;
}

const SnapshotCard = ({
  percentage,
  status,
  percentChanged,
}: SnapshotCardProps): JSX.Element => {
  const enableObjectivesPerformanceSnapshotHistory = useFeatureFlag('enableObjectivesPerformanceSnapshotHistory');

  const { setStatusFilter } = useGoalsContext();

  const handleClick = (): void => {
    if (status) {
      setStatusFilter([status]);
    }
  };

  const getStatusDisplayName = (goalStatus?: Goals.GoalStatus): string => {
    if (!goalStatus) return 'Unknown Status';

    // Convert enum value to readable format
    return goalStatus.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <button
      css={styles.snapshotCard}
      onClick={handleClick}
      disabled={!status}
      aria-label={`Filter goals by ${getStatusDisplayName(status)} status`}
      type="button"
    >
      {status && (
        <div css={styles.badgeWrapper}>
          <StatusBadge status={status} />
        </div>
      )}
      {!status && (
        <div css={styles.badgeWrapper}>
          <div css={styles.badge} />
        </div>
      )}
      <div css={styles.percentageContainer}>
        <Typography fontSize="2.25rem" fontWeight="bold" component="p" css={styles.percentageText}>
          {percentage && (
            <>
              {percentage}
              <span>%</span>
            </>
          )}
          {!percentage && (
            <span>N/A</span>
          )}
        </Typography>
        {enableObjectivesPerformanceSnapshotHistory && (
          <PercentageChanged
            percentChanged={percentChanged}
            status={status}
          />
        )}
      </div>
    </button>
  );
};

export default SnapshotCard;
