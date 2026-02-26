import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { palette } from '~Common/styles/colors';
import { withLineClamp } from '~Common/styles/mixins';
import { getDateString } from '~Common/utils/dateString';
import { isHTMLText } from '~Common/utils/isHTMLText';
import HTMLRenderer from '~Common/V3/components/HTML/HTMLRenderer';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { AchievedNotToggleType } from '~Goals/const/types';
import { GetGoalByIdReturn, useGetGoalById } from '~Goals/hooks/useGetGoalById';
import { useCallback, useMemo } from 'react';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import { sortGoalStatusUpdates } from '~Goals/utils/sortGoalStatusUpdates';
import GoalMeasurementValue from '../DeleteAfterGoalsV4/ResolveDependencies/GoalMeasurementValue';

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  statusButton: css({
    overflow: 'hidden',
    ':not(:last-of-type)': {
      borderBottom: `1px solid ${palette.neutrals.gray200}`,
    },
    height: '5.9375rem',

    color: palette.neutrals.gray800,
    display: 'flex',
    flexDirection: 'column',
    padding: '0.75rem',
    gap: '0.5rem',

    ':hover': {
      color: palette.neutrals.gray800,
    },
  }),
  highlight: css({
    backgroundColor: palette.neutrals.gray100,
  }),
  topRow: css({
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 400,
    width: '100%',
  }),
  bottomRow: css({
    fontSize: '.8125rem',
    fontWeight: 400,
    textAlign: 'start',
    color: palette.neutrals.gray700,
  }),
  dateStamp: css({
    flex: 1,
    whiteSpace: 'nowrap',
    textAlign: 'end',
    fontSize: '0.75rem',
    fontWeight: 400,
    color: palette.neutrals.gray600,
  }),
  valueContainer: css({
    flex: 1,
    '& .MuiLinearProgress-root ': {
      maxWidth: '2.8125rem',
    },
  }),
  statusCommentary: css(withLineClamp(2)),
};

interface LeftPanelProps {
  statusId: string,
  measurementScale: Goals.MeasurementScale,
  handleStatusClick: (statusId: string) => void,
  goalId: string,
}

export const LeftPanel = ({
  statusId,
  measurementScale,
  handleStatusClick,
  goalId,
  ...props
}: LeftPanelProps): JSX.Element => {
  const { data: goal } = useGetGoalById({
    goalId,
    select: useCallback((tempData: HttpCallReturn<GetGoalByIdReturn>): GetGoalByIdReturn => sortGoalStatusUpdates(tempData.response), []),
  });

  const statusUpdates = useMemo((): Goals.GoalStatusUpdate[] => goal?.statusUpdates ?? [], [goal]);

  return (
    <section css={styles.container} {...props}>
      {statusUpdates.map((status) => (
        <JoshButton
          data-test-id="goalStatusUpdate"
          key={status.statusId}
          onClick={() => handleStatusClick(status.statusId)}
          css={[styles.statusButton, statusId === status.statusId && styles.highlight]}
          variant="text"
        >
          <div css={styles.topRow}>
            <div css={styles.valueContainer}>
              <GoalMeasurementValue
                status={status.status}
                completionPercentage={status.completionPercentage}
                isAchieved={status.isAchieved as AchievedNotToggleType | null}
                measurementScale={measurementScale}
                statusUpdate={status}
                hideAboveBelowUnitLabel={status.snapshotInformation?.measurementUnitType.ownership?.id !== Goals.MeasurementUnitOwnershipId.System}
              />
            </div>
            <div css={styles.dateStamp}>
              {getDateString({ timestamp: status.lastModifiedInMillis }).dateString}
            </div>
          </div>
          <div css={styles.bottomRow}>
            {isHTMLText(status.statusCommentary) && (
              <HTMLRenderer css={styles.statusCommentary} htmlText={status.statusCommentary} />
            )}
            {!isHTMLText(status.statusCommentary) && (
              <div css={styles.statusCommentary}>{status.statusCommentary}</div>
            )}
          </div>
        </JoshButton>
      ))}
    </section>
  );
};
