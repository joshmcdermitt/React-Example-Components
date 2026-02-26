import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { Link } from 'react-router-dom';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { useDrawerActions } from '~Common/hooks/useDrawers';
import { palette } from '~Common/styles/colors';
import { withTruncate } from '~Common/styles/mixins';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { viewGoalDetailsTemplate } from '~Goals/components/Drawers/ViewGoalDetailsDrawer';
import ChildGoalCount from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/ChildGoalCountDeprecated';
import GoalStatusText from '~Goals/components/Shared/GoalStatus/GoalStatusText';
import GoalTypeIcon from '~Goals/components/Shared/GoalTypeIcon';
import { AchievedNotToggleType, LinkedGoalType } from '~Goals/const/types';
import { GOAL_CATEGORY_TYPE_MAP } from '~Goals/hooks/utils/categoryTypes/useGetGoalCategoryTypes';
import useGetGoalRoutes, { GetGoalRoutesReturn } from '~Goals/hooks/utils/useGetGoalRoutes';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import Tooltip from '~Common/components/Tooltip';
import GoalMeasurementValue from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/GoalMeasurementValue';
import MenuButton from './MenuButton';
import PrivateIcon from './PrivateIcon';

const styles = {
  linkedGoalCard: (manualGrid = false, disabled: boolean) => css({
    gridColumn: '1/5',
    display: 'grid',
    gridTemplateColumns: manualGrid ? 'subGrid' : '1fr auto auto auto',
  }, !manualGrid && ({
    gap: '0.5rem',
  }), disabled && ({
    cursor: 'not-allowed',
  })),
  joshButton: (disabled: boolean) => css({
    backgroundColor: palette.neutrals.white,
    border: 0,
    width: '100%',
    padding: 0,
    color: palette.neutrals.gray800,
    gridColumn: '1/5',
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    alignItems: 'center',
    fontWeight: 400,
    gap: '0.5rem',
  }, disabled && ({
    pointerEvents: 'none',
  })),
  leftSide: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    overflow: 'hidden',
  }),
  titleContainer: css({
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    overflow: 'hidden',
    gridColumn: '1',
  }),
  title: css({
    color: palette.neutrals.gray800,
    fontWeight: 600,
    textAlign: 'start',
  }, withTruncate()),
  info: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    color: palette.neutrals.gray700,
    fontSize: '0.75rem',
  }),
  dateText: css({
    color: palette.neutrals.gray800,
    fontSize: '0.75rem',
  }),
  rightSection: css({
    gridColumn: '2/5',
    display: 'grid',
    gridTemplateColumns: 'subgrid',
  }),
  progressInfoContainer: css({
    gridColumn: '2',
    display: 'flex',
    flexDirection: 'column',
    minWidth: '4.6875rem',
    alignItems: 'flex-start',
  }),
  avatar: css({
    gridColumn: '3',
    marginLeft: '0.25rem',
  }),
  menuButton: (visible: boolean) => css({
    visibility: visible ? 'visible' : 'hidden',
    gridColumn: '4',
  }),
  categoryType: css({
    display: 'inline-block',
  }, withTruncate()),
};

interface ViewProps {
  title: string,
  totalChildGoals: number,
  contextType: Goals.GoalContextType,
  status: Goals.GoalStatus,
  percentage: number,
  creator: Goals.GoalParticipant,
  goalId: string,
  linkedGoalType: LinkedGoalType,
  handleUnlink: () => void,
  canViewGoal: boolean,
  canLinkGoal: boolean,
  handleInDrawerGoalClick: () => void,
  disabled?: boolean,
  manualGrid?: boolean,
  isTeamGoal: boolean,
  teamName: string | undefined,
  featureNamesText: FeatureNamesText,
  goalRoutes: GetGoalRoutesReturn['goalRoutes'],
  category: Goals.GoalCategory | undefined,
  isDrawer?: boolean,
  measurementScale: Goals.MeasurementScale,
  isAchieved: AchievedNotToggleType | null,
}

const View = ({
  title,
  totalChildGoals,
  contextType,
  status,
  percentage,
  creator,
  linkedGoalType,
  handleUnlink,
  canViewGoal,
  canLinkGoal,
  disabled,
  goalId,
  manualGrid,
  isTeamGoal,
  teamName,
  handleInDrawerGoalClick,
  isDrawer,
  featureNamesText,
  goalRoutes,
  category,
  measurementScale,
  isAchieved,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.linkedGoalCard(manualGrid, !!disabled)}
    {...props}
  >
    <JoshButton
      css={styles.joshButton(!!disabled)}
      component={isDrawer ? 'button' : Link}
      to={isDrawer ? undefined : goalRoutes.ViewById.replace(':goalId', goalId)}
      onClick={isDrawer ? handleInDrawerGoalClick : undefined}
      data-test-id="goalsLinkedGoalCard"
      className="goalsLinkedGoalCard"
      variant="text"
    >
      <div css={styles.leftSide}>
        <GoalTypeIcon
          contextType={contextType}
          tooltipText={isTeamGoal && teamName ? teamName : ''}
        />
        <div css={styles.titleContainer}>
          <Tooltip content={canViewGoal ? title : `Private ${featureNamesText.goals.singular}`}>
            <div css={styles.title}>{canViewGoal ? title : `Private ${featureNamesText.goals.singular}`}</div>
          </Tooltip>
          {canViewGoal && (
            <div css={styles.info}>
              {totalChildGoals > 0 && (
                <ChildGoalCount totalChildGoals={totalChildGoals} />
              )}
              {category && (
                <span css={styles.categoryType}>{GOAL_CATEGORY_TYPE_MAP[category]}</span>
              )}
            </div>
          )}
        </div>
      </div>
      {canViewGoal && (
        <>
          <div css={styles.progressInfoContainer}>
            <GoalMeasurementValue
              status={status}
              showSmallText
              completionPercentage={percentage}
              measurementScale={measurementScale}
              isAchieved={isAchieved}
              hideAboveBelowUnitLabel={measurementScale.measurementUnitType.ownership?.id !== Goals.MeasurementUnitOwnershipId.System}
            />
            <GoalStatusText
              status={status}
            />
          </div>
          <BaseAvatar
            css={styles.avatar}
            orgUserId={creator.orgUserId ?? null}
            avatarSize={30}
          />
        </>
      )}
      {!canViewGoal && (
        <PrivateIcon css={styles.avatar} />
      )}
      <MenuButton
        css={styles.menuButton(canLinkGoal)}
        disabled={!canLinkGoal}
        linkedGoalType={linkedGoalType}
        handleUnlink={handleUnlink}
      />
    </JoshButton>
  </div>
);

interface LinkedGoalCardProps extends Pick<ViewProps,
  'linkedGoalType'
  | 'handleUnlink'
  | 'canLinkGoal'
  | 'manualGrid'
  | 'isDrawer'
> {
  goal: Goals.LinkedGoal,
}

const LinkedGoalCard = ({
  goal,
  ...props
}: LinkedGoalCardProps): JSX.Element => {
  const { pushDrawer } = useDrawerActions();
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const {
    title,
    totalChildGoals,
    currentStatusUpdate,
    endTimeInMillis,
    context,
    participants,
    category,
    measurementScale,
  } = goal;

  const { contextType, contextName: teamName } = context;

  const creator = participants.find((participant) => participant.role === Goals.GoalParticipantRole.Owner);
  const isTeamGoal = contextType === Goals.GoalContextType.Team;

  const permissions = goal.permissions ?? [];
  const canViewGoal = !!permissions.includes(Goals.GoalPermission.CanViewGoal);

  const handleInDrawerGoalClick = (): void => {
    pushDrawer({
      drawer: {
        ...viewGoalDetailsTemplate,
        args: {
          goalId: goal.goalId,
        },
      },
    });
  };

  const hookProps = {
    title,
    totalChildGoals,
    status: currentStatusUpdate.status,
    percentage: currentStatusUpdate.completionPercentage,
    endTimeInMillis,
    contextType,
    creator: creator!,
    goalId: goal.goalId,
    canViewGoal,
    disabled: !canViewGoal,
    isTeamGoal,
    teamName,
    handleInDrawerGoalClick,
    featureNamesText,
    goalRoutes,
    category,
    measurementScale,
    isAchieved: currentStatusUpdate.isAchieved as AchievedNotToggleType | null,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default LinkedGoalCard;
