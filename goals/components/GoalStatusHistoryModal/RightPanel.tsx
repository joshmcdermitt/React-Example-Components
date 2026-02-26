import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import { styled } from '@mui/material';
import moment from 'moment-timezone';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { palette } from '~Common/styles/colors';
import { getDateString } from '~Common/utils/dateString';
import { isHTMLText } from '~Common/utils/isHTMLText';
import HTMLRenderer from '~Common/V3/components/HTML/HTMLRenderer';
import { useStatusUpdateMenu } from '~Goals/hooks/statusUpdates/useStatusUpdateMenu';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import { AchievedNotToggleType } from '~Goals/const/types';
import { useMemo } from 'react';
import GoalMeasurementValue from '../DeleteAfterGoalsV4/ResolveDependencies/GoalMeasurementValue';
import GoalStatusText from '../Shared/GoalStatus/GoalStatusText';
import GoalStatusOverflowMenu from '../Shared/GoalStatusOverflowMenu';
import GoalTargetValueMessage from '../DeleteAfterGoalsV4/ResolveDependencies/GoalTargetValueMessageDeprecated';

const styles = {
  container: css({
    color: palette.neutrals.gray800,
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.875rem',
    fontWeight: 400,
    padding: '1.5rem 1.875rem',
    rowGap: '1.125rem',
  }),
  goalMeasurementValue: css({
    '.linearProgressWrapper': {
      width: '12.5rem',
    },
    '& > .measurementValueText': {
      fontSize: '.875rem',
    },
  }),
  timestamp: css({
    color: palette.neutrals.gray700,
    fontSize: '0.875rem',
    textAlign: 'right',
  }),
  topRow: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }),
  topRightSection: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }),
  goalStatusText: css({
    fontSize: '.6875rem',
  }),
  header: css({
    color: palette.neutrals.gray700,
    fontSize: '0.75rem',
  }),
  creator: css({
    alignItems: 'center',
    columnGap: '0.5rem',
    display: 'flex',
    flexDirection: 'row',
  }),
  backButton: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginLeft: '-0.375rem',
  }),
};

const StyledTargetTextContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const StyledTargetHeaderText = styled('div')(({ theme }) => ({
  fontSize: theme.fontSize.extraSmall,
  lineHeight: theme.fontSize.extraSmall,
  color: theme.palette.text.tertiary,
  fontWeight: 400,
}));

interface ViewProps {
  status: Goals.GoalStatusUpdate,
  goal: Goals.Goal,
  canDeleteStatusUpdate: boolean,
  canEditStatusUpdate: boolean,
  handleBackClick: () => void,
  showBackButton: boolean,
  objectivesUnitOfMeasure: boolean,
}

const View = ({
  status,
  goal,
  canDeleteStatusUpdate,
  canEditStatusUpdate,
  handleBackClick,
  showBackButton,
  objectivesUnitOfMeasure,
  ...props
}: ViewProps): JSX.Element => (
  <section css={styles.container} {...props}>
    {showBackButton && (
      <div>
        <JoshButton
          css={styles.backButton}
          onClick={handleBackClick}
          variant="text"
          size="small"
          textButtonColor={palette.neutrals.gray700}
          data-test-id="goalStatusHistoryModalBack"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </JoshButton>
      </div>
    )}
    {objectivesUnitOfMeasure && (
      <StyledTargetTextContainer>
        <StyledTargetHeaderText data-test-id="goalStatusHistoryModalTargetHeader">Target</StyledTargetHeaderText>
        <GoalTargetValueMessage
          measurementScale={goal.measurementScale}
          statusUpdate={status}
        />
      </StyledTargetTextContainer>
    )}
    <div css={styles.topRow}>
      <div>
        <p css={styles.header} data-test-id="goalStatusHistoryModalProgressHeader">Progress</p>
        <GoalMeasurementValue
          css={styles.goalMeasurementValue}
          status={status.status}
          completionPercentage={status.completionPercentage}
          measurementScale={goal.measurementScale}
          statusUpdate={status}
          isAchieved={status.isAchieved as AchievedNotToggleType | null}
        />
        <GoalStatusText
          css={styles.goalStatusText}
          status={status.status}
        />
      </div>
      <div css={styles.topRightSection}>
        <div css={styles.timestamp}>
          <p>{getDateString({ timestamp: status.lastModifiedInMillis }).dateString}</p>
          <p>{moment(status.lastModifiedInMillis).format('h:mma')}</p>
        </div>
        <GoalStatusOverflowMenu
          goal={goal}
          status={status}
          canEditStatusUpdate={canEditStatusUpdate}
          canDeleteStatusUpdate={canDeleteStatusUpdate}
        />
      </div>
    </div>
    <div css={styles.creator}>
      <BaseAvatar
        orgUserId={status.creator.orgUserId ?? null}
        avatarSize={22}
      />
      {`${status.creator.firstName} ${status.creator.lastName}`}
    </div>
    <div>
      <StyledTargetHeaderText>Update</StyledTargetHeaderText>
      {isHTMLText(status.statusCommentary) && (
        <HTMLRenderer htmlText={status.statusCommentary} />
      )}
      {!isHTMLText(status.statusCommentary) && (
        <p>{status.statusCommentary}</p>
      )}
    </div>
  </section>
);

interface RightPanelProps extends Pick<ViewProps, 'goal' | 'handleBackClick' | 'showBackButton'> {
  statusId: string;
}

const RightPanel = ({
  goal,
  statusId,
  ...props
}: RightPanelProps): JSX.Element => {
  const objectivesUnitOfMeasure = useFeatureFlag('objectivesUnitOfMeasure');

  const emptyStatus: Goals.GoalStatusUpdate = useMemo(() => ({
    statusId: '',
    status: Goals.GoalStatus.OnTrack,
    completionPercentage: 0,
    creator: {
      firstName: '',
      lastName: '',
      profileImageUrl: '',
      orgUserId: '',
      jobTitle: '',
    },
    lastModifiedInMillis: 0,
    statusCommentary: '',
    value: 0,
    isAchieved: null,
    createdInMillis: 0,
  }), []);

  const status = useMemo((): Goals.GoalStatusUpdate => goal.statusUpdates.find((statusUpdate) => statusUpdate.statusId === statusId)
    ?? emptyStatus, [emptyStatus, goal.statusUpdates, statusId]);

  const {
    canDeleteStatusUpdate,
    canEditStatusUpdate,
  } = useStatusUpdateMenu({ goal, status });

  const hookProps = {
    canDeleteStatusUpdate,
    canEditStatusUpdate,
    goal,
    status,
    objectivesUnitOfMeasure,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default RightPanel;
