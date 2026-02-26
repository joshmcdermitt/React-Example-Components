import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { styled } from '@mui/material';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import withLoadingSkeleton from '~Common/components/withLoadingSkeleton';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { palette } from '~Common/styles/colors';
import { forMobileObject, withLineClampObject } from '~Common/styles/mixins';
import HTMLRenderer from '~Common/V3/components/HTML/HTMLRenderer';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { GetGoalByIdReturn } from '~Goals/hooks/useGetGoalById';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import useOpenGoalStatusUpdateModal from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/useOpenGoalStatusUpdateModalDeprecated';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import NiceModal from '@ebay/nice-modal-react';
import { AchievedNotToggleType } from '~Goals/const/types';
import { isHTMLText } from '~Common/utils/isHTMLText';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import GoalMeasurementValue from '../DeleteAfterGoalsV4/ResolveDependencies/GoalMeasurementValue';
import GoalStatusIndicatorIcon from '../Shared/GoalStatus/GoalStatusIndicatorIcon';
import GoalStatusText from '../Shared/GoalStatus/GoalStatusText';
import GoalStatusHistoryModal from '../GoalStatusHistoryModal';

const styles = {
  statusContainer: (isDrawer: boolean) => css({
    border: `.0625rem solid ${palette.neutrals.gray300}`,
    borderRadius: '.3125rem',
    padding: '.625rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr .5fr',
    gap: '.625rem',
    alignItems: 'center',
  }, forMobileObject({
    gridTemplateColumns: '1fr 1fr',
    '> div:nth-of-type(2)': {
      order: 3,
      gridColumn: 'span 2',
    },
  }), isDrawer && {
    gridTemplateColumns: '1fr 1fr',
    '> div:nth-of-type(2)': {
      order: 3,
      gridColumn: 'span 2',
    },
  }),
  heading: css({
    color: palette.neutrals.gray700,
    fontSize: '.75rem',
    fontWeight: 400,
  }),
  editButton: css({
    justifySelf: 'end',
    maxHeight: '3.0625rem',
  }),
  bottomSection: (isDrawer: boolean) => css({
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    gridColumn: '1/4',
  }, forMobileObject({
    order: 4,
  }), isDrawer && {
    order: 4,
  }),
  latestUpdateHeader: css({
    gridColumn: '1/4',
  }),
  statusCommentary: css({
    color: palette.neutrals.gray800,
    fontSize: '.875rem',
    fontWeight: 500,
    gridColumn: '1/4',
    lineHeight: 1.2,
  }, withLineClampObject(2, 1.2), forMobileObject(withLineClampObject(4, 1.2))),
  viewGoalHistory: css({
    marginTop: '.75rem',
    fontSize: '.75rem',
    fontWeight: 400,
    gridColumn: '1',
    textAlign: 'start',
    paddingLeft: 0,
  }),
  goalStatusTextContainer: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }),
  skeleton: css({
    minWidth: '100%',
    height: '12.5rem',
  }),
  goalMeasurementValue: css({
    '& > .measurementValueText': {
      fontSize: '.875rem',
    },
  }),
};

const StyledGoalStatusText = styled(GoalStatusText)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: theme.fontSize.small,
  lineHeight: theme.lineHeight.small,
}));

interface ViewProps {
  status: Goals.GoalStatusUpdate,
  date: string,
  onUpdateStatus: () => void,
  isDrawer?: boolean,
  onHistoryClick: () => void,
  goal: Goals.Goal,
  statusUpdatesCount: number,
  isMobile: boolean,
  featureNamesText: FeatureNamesText,
  enableObjectiveSummary: boolean,
}

const View = ({
  status,
  date,
  onUpdateStatus,
  isDrawer = false,
  onHistoryClick,
  goal,
  statusUpdatesCount,
  isMobile,
  featureNamesText,
  enableObjectiveSummary,
}: ViewProps): JSX.Element => (
  <div
    css={styles.statusContainer(isDrawer)}
  >
    <div>
      <span
        css={styles.heading}
      >
        {`Status as of ${date}`}
      </span>
      <div css={styles.goalStatusTextContainer}>
        <GoalStatusIndicatorIcon
          size={12}
          status={status.status}
        />
        <StyledGoalStatusText
          status={status.status}
        />
      </div>
    </div>
    <div>
      <span
        css={styles.heading}
        data-test-id="goalProgressLabel"
      >
        Progress
      </span>
      <GoalMeasurementValue
        css={styles.goalMeasurementValue}
        isShowingStatusIndicator={false}
        status={status.status}
        completionPercentage={status.completionPercentage}
        isAchieved={status.isAchieved as AchievedNotToggleType | null}
        measurementScale={goal.measurementScale}
      />
    </div>
    {goal.permissions.includes(Goals.GoalPermission.CanEditGoalStatus) && (
      <JoshButton
        variant="ghost"
        size={isMobile ? 'mini' : 'small'}
        css={styles.editButton}
        onClick={onUpdateStatus}
        data-test-id="goalUpdateStatus"
      >
        Update Status
      </JoshButton>
    )}
    <div css={styles.bottomSection(isDrawer)}>
      <span css={[styles.heading, styles.latestUpdateHeader]}>Latest Update</span>

      {enableObjectiveSummary && status.statusCommentarySummary ? (
        <>
          {isHTMLText(status.statusCommentarySummary) && (
            <HTMLRenderer css={styles.statusCommentary} htmlText={status.statusCommentarySummary} />
          )}
          {!isHTMLText(status.statusCommentarySummary) && (
            <div css={styles.statusCommentary}>{status.statusCommentarySummary}</div>
          )}
        </>
      ) : (
        <>
          {isHTMLText(status.statusCommentary) && (
            <HTMLRenderer css={styles.statusCommentary} htmlText={status.statusCommentary} />
          )}
          {!isHTMLText(status.statusCommentary) && (
            <div css={styles.statusCommentary}>{status.statusCommentary}</div>
          )}
        </>
      )}

      <JoshButton
        variant="text"
        size="small"
        css={styles.viewGoalHistory}
        data-test-id="viewGoalHistory"
        onClick={onHistoryClick}
      >
        {`View ${featureNamesText.goals.singular} History ${statusUpdatesCount > 0 ? `(${statusUpdatesCount})` : ''}`}
      </JoshButton>
    </div>
  </div>
);

const GoalDetailStatusSkeleton = (): JSX.Element => (
  <SkeletonLoader
    css={styles.skeleton}
    renderComponent={() => (<></>)}
  />
);

interface GoalDetailStatusProps {
  data: GetGoalByIdReturn,
  isDrawer?: boolean,
  isReadOnly?: boolean,
}

const GoalDetailStatus = ({
  data: goal,
  isDrawer = false,
  isReadOnly = false,
}: GoalDetailStatusProps): JSX.Element => {
  const status = goal.statusUpdates[0];
  const date = moment(status?.createdInMillis).format('MMM Do YYYY');
  const history = useHistory();
  const isMobile = useIsMobileQuery();
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const { openGoalStatusUpdateModal } = useOpenGoalStatusUpdateModal();

  const onUpdateStatus = (): void => {
    openGoalStatusUpdateModal({
      modalProps: {
        goal,
        status: status.status,
        completionPercentage: status.completionPercentage,
        statusCommentary: '',
        statusCommentarySummary: '',
        measurementScale: goal.measurementScale,
      },
    });
  };

  const onHistoryClick = (): void => {
    if (isDrawer) {
      // Going to open the modal another way
      void NiceModal.show(GoalStatusHistoryModal, {
        goalId: goal.goalId,
        displayedStatusId: status.statusId,
        shouldAffectUrl: false,
      });
    } else {
      history.push(goalRoutes.GoalStatusById.replace(':goalId', goal.goalId).replace(':statusId', status.statusId));
    }
  };

  const statusUpdatesCount = goal.statusUpdates?.length ?? 0;
  const enableObjectiveSummary = useFeatureFlag('enableObjectiveSummary');
  const hookProps = {
    status,
    date,
    onUpdateStatus,
    isDrawer,
    onHistoryClick,
    goal,
    isReadOnly,
    statusUpdatesCount,
    isMobile,
    featureNamesText,
    enableObjectiveSummary,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export default withLoadingSkeleton<GetGoalByIdReturn, GoalDetailStatusProps>(GoalDetailStatus, GoalDetailStatusSkeleton);
