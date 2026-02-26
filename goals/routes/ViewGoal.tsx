import NiceModal from '@ebay/nice-modal-react';
import { css } from '@emotion/react';
import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Goals } from '@josh-hr/types';
import { useCallback, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { palette } from '~Common/styles/colors';
import { forMobileObject } from '~Common/styles/mixins';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import GoalStatusHistoryModal from '~Goals/components/GoalStatusHistoryModal';
import MarkCompleteButton from '~Goals/components/Shared/MarkCompleteButton';
import { BackInformation, OpenGoalStatusesV3 } from '~Goals/const/types';
import { useGetLinkedGoalsById } from '~Goals/hooks/linkGoals/useGetLinkedGoalsById';
import { useEnableCascadingGoals } from '~Goals/hooks/utils/useEnableCascadingGoals';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import { sortGoalStatusUpdates } from '~Goals/utils/sortGoalStatusUpdates';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { InteriorTopBar } from '../components/GoalsTopBar/InteriorTopBar';
import ViewGoalDetails from '../components/Shared/ViewGoalDetails';
import { GetGoalByIdReturn, useGetGoalById } from '../hooks/useGetGoalById';

const styles = {
  container: css({
    width: '100%',
    margin: '1.875rem 1.875rem 0 1.875rem',
  }),
  textBackButton: css({
    fontSize: '1rem',
    fontWeight: 400,
    color: palette.neutrals.gray800,
  }),
  icon: css({
    marginRight: '.5rem',
  }),
  buttonSpacing: css({
    marginRight: '.625rem',
  }),
  actionItems: css({
    height: '19.0625rem',
  }),
  description: css({
    height: '8.4375rem',
  }),
  status: css({
    height: '4.0625rem',
  }),
  rightSide: (showMarkCompleteButton: boolean) => css({
    display: 'flex',
    gap: '.625rem',
  }, forMobileObject({
    display: 'grid',
    gridTemplateColumns: showMarkCompleteButton ? '1fr 1fr' : '1fr',
  })),
  editButton: (showMarkCompleteButton: boolean) => css({
  }, forMobileObject({
    width: showMarkCompleteButton ? '100%' : 'min-content',
  })),
  viewGoalDetails: css({
    marginTop: '1.875rem',
    marginBottom: '2rem',
  }),
};

interface ViewProps {
  goal: Goals.Goal | undefined,
  onEditClick: () => void,
  handleBackClick: () => void,
  backText: string,
  showMarkCompleteButton: boolean,
  showRightSide: boolean,
  goalId: string,
}

const View = ({
  goal,
  onEditClick,
  backText,
  handleBackClick,
  showMarkCompleteButton,
  showRightSide,
  goalId,
}: ViewProps): JSX.Element => (
  <div css={styles.container}>
    <InteriorTopBar
      renderLeftSide={() => (
        <JoshButton
          onClick={handleBackClick}
          variant="text"
          css={styles.textBackButton}
          textButtonColor={palette.neutrals.gray700}
          data-test-id="goalsBackToGoalsList"
        >
          <FontAwesomeIcon
            css={styles.icon}
            icon={faArrowLeft}
          />
          {`Back to ${backText}`}
        </JoshButton>
      )}
      renderRightSide={goal && showRightSide ? () => (
        <div css={styles.rightSide(showMarkCompleteButton)}>
          {goal?.permissions.includes(Goals.GoalPermission.CanEditGoal) && (
            <JoshButton
              css={styles.editButton(showMarkCompleteButton)}
              data-test-id="goalsEditGoal"
              onClick={onEditClick}
              variant={showMarkCompleteButton ? 'ghost' : 'default'}
            >
              Edit
            </JoshButton>
          )}
          {showMarkCompleteButton && (
            <MarkCompleteButton
              goal={goal}
            />
          )}
        </div>
      ) : undefined}
    />
    <ViewGoalDetails
      css={styles.viewGoalDetails}
      goalId={goalId}
    />
  </div>
);

interface GoalDetailsParams {
  goalId: string,
  statusId?: string,
}

interface ViewGoalProps {
  isOnStatusRoute?: boolean,
}

const ViewGoal = ({
  isOnStatusRoute = false,
}: ViewGoalProps): JSX.Element => {
  const { goalId, statusId } = useParams<GoalDetailsParams>();
  const { data: goal, isLoading } = useGetGoalById({
    goalId,
    select: useCallback((tempData: HttpCallReturn<GetGoalByIdReturn>) => sortGoalStatusUpdates(tempData.response), []),
  });
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();

  const canViewGoal = !!goal?.permissions.includes(Goals.GoalPermission.CanViewGoal);

  const { state: locationState = {} } = useLocation();
  const { backInformation } = locationState as { backInformation: BackInformation};
  const { isCompleted } = goal || {};

  const {
    orgLevelEnableCascadingGoals,
  } = useEnableCascadingGoals();

  // Prefetch linked goals, but only if the feature is enabled
  useGetLinkedGoalsById({ goalId, enabled: orgLevelEnableCascadingGoals });

  const history = useHistory();
  const onEditClick = (): void => {
    history.push(goalRoutes.EditById.replace(':goalId', goalId), { backInformation });
  };

  useEffect(() => {
    if (isOnStatusRoute && goal && canViewGoal) {
      void NiceModal.show(GoalStatusHistoryModal, {
        goalId: goal.goalId,
        displayedStatusId: statusId,
      });
    } else if (!isOnStatusRoute) {
      void NiceModal.hide(GoalStatusHistoryModal);
    }
  }, [isOnStatusRoute, statusId, goal, canViewGoal]);

  useEffect(() => {
    if (!canViewGoal && !isLoading) {
      history.push(goalRoutes.PermissionsDenied);
    }
  }, [isLoading, history, canViewGoal, goalRoutes.PermissionsDenied]);

  const handleBackClick = (): void => {
    if (backInformation) {
      history.push(backInformation.location);
    } else if (isCompleted) {
      history.push(goalRoutes.ListComplete);
    } else {
      history.push(goalRoutes.Dashboard);
    }
  };

  const showMarkCompleteButton = goal?.permissions.includes(Goals.GoalPermission.CanCompleteGoal)
    && goal?.statusUpdates?.[0]?.status ? OpenGoalStatusesV3.includes(goal?.statusUpdates?.[0]?.status) : false;

  const showRightSide = goal?.permissions.includes(Goals.GoalPermission.CanEditGoal) || showMarkCompleteButton;

  const hookProps = {
    onEditClick,
    backText: backInformation?.backText || `${featureNamesText.goals.plural}`,
    handleBackClick,
    showMarkCompleteButton,
    showRightSide,
    goalId,
    goal,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };

export default ViewGoal;
