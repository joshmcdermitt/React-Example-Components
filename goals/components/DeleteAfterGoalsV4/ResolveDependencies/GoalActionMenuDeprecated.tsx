import { css } from '@emotion/react';
import {
  faArrowUpRightFromSquare,
  faBullseyeArrow,
  faCopy,
  faEllipsisVertical,
  faPenToSquare, faTrash,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDrawerActions } from '~Common/hooks/useDrawers';
import { palette } from '~Common/styles/colors';
import DeleteConfirmationButtons from '~Common/V3/components/DeleteConfirmation/DeleteConfirmationButtons';
import DeleteConfirmationPopover, {
  UseDeleteConfirmationPopoverHookReturn,
  useDeleteConfirmationPopover,
} from '~Common/V3/components/DeleteConfirmation/DeleteConfirmationPopover';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import OverflowMenu from '~Common/V3/components/OverflowMenu';
import { CreateGoalWorkflow } from '~Goals/components/DeleteAfterUOM/useGetCreateGoalDefaultValues';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import useOpenGoalStatusUpdateModal from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/useOpenGoalStatusUpdateModalDeprecated';
import { MenuItem } from '~Meetings/components/shared/ActionMenu';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { goalKeys } from '~Goals/const/queryKeys';
import { queryClient } from '~Common/const/queryClient';
import { useDeleteGoal } from '../../../hooks/useDeleteGoal';

const styles = {
  actionMenu: css({
    backgroundColor: palette.neutrals.gray500,
  }),
  icon: css({
    height: '1.125rem',
    color: palette.neutrals.gray700,
  }),
  deleteGoal: css({
    color: palette.brand.red,
    borderTop: `1px solid ${palette.neutrals.gray300}`,

    '&:first-of-type': {
      border: 'none',
    },
  }),
  actionButton: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '.4375rem',
    paddingRight: '.4375rem',
  }),
};

interface ViewProps extends Omit<UseDeleteConfirmationPopoverHookReturn, 'openConfirmationPopover'> {
  menuItems: MenuItem[],
  handleConfirmDeletion: () => void,
  dataTestId: string,
}

const View = ({
  menuItems,
  closeConfirmationPopover,
  isOpen,
  popoverId,
  anchorEl,
  handleConfirmDeletion,
  dataTestId,
  ...props
}: ViewProps): JSX.Element => (
  <>
    <OverflowMenu
      menuItems={[menuItems]}
      renderOverflowMenuButton={(doOpen) => (
        <JoshButton
          onClick={doOpen}
          variant="text"
          data-test-id={dataTestId}
          css={styles.actionButton}
        >
          <FontAwesomeIcon css={styles.icon} icon={faEllipsisVertical} />
        </JoshButton>
      )}
      {...props}
    />
    <DeleteConfirmationPopover
      closeConfirmationPopover={closeConfirmationPopover}
      open={isOpen}
      popoverId={popoverId}
      anchorEl={anchorEl}
      renderConfirmationButtons={({
        informationStyles,
        optionStyles,
        popoverButtonStyles,
      }) => (
        <DeleteConfirmationButtons
          informationStyles={informationStyles}
          optionStyles={optionStyles}
          popoverButtonStyles={popoverButtonStyles}
          onDelete={handleConfirmDeletion}
        />
      )}
    />
  </>
);

interface GoalActionMenuProps {
  goal: Goals.Goal,
  showExpandedActionMenu?: boolean,
  backInformation?: {
    location: string,
    backText: string,
  },
  isDrawer?: boolean,
  dataTestId?: string,
}

/**
 * @deprecated Use GoalActionMenu from ~Goals/components/Tables/GoalsTable/GoalActionMenu
 */

export const GoalActionMenu = ({
  goal,
  showExpandedActionMenu = false,
  backInformation,
  isDrawer = false,
  dataTestId = 'objectiveStatusActionMenu',
  ...props
}: GoalActionMenuProps): JSX.Element => {
  const { popDrawer } = useDrawerActions();
  const {
    anchorEl,
    openConfirmationPopover,
    closeConfirmationPopover,
    isOpen,
    popoverId,
  } = useDeleteConfirmationPopover('goalsViewGoalDeleteConfirmationPopover');

  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const { openGoalStatusUpdateModal } = useOpenGoalStatusUpdateModal();

  const history = useHistory();

  const { goalId } = goal;

  const { mutate: deleteGoalMutation } = useDeleteGoal();

  const handleConfirmDeletion = (): void => {
    deleteGoalMutation({ goalId }, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [goalKeys.lists(), 'non-cascading'] });
        await queryClient.invalidateQueries({ queryKey: [goalKeys.lists(), 'cascading'] });
        if (isDrawer) {
          popDrawer({ popAll: true });
        } else {
          history.push(goalRoutes.Dashboard);
        }
      },
    });
  };

  const menuItems = useMemo(() => {
    const tempMenuItems: MenuItem[] = [];

    if (showExpandedActionMenu) {
      tempMenuItems.push({
        text: `Expand ${featureNamesText.goals.singular}`,
        icon: faArrowUpRightFromSquare,
        onClick: () => {
          history.push(goalRoutes.ViewById.replace(':goalId', goal?.goalId ?? ''), { backInformation });
          popDrawer({ popAll: true });
        },
      });
    }

    if (goal.permissions.includes(Goals.GoalPermission.CanEditGoal)) {
      tempMenuItems.push({
        text: `Edit ${featureNamesText.goals.singular}`,
        icon: faPenToSquare,
        onClick: () => {
          history.push(goalRoutes.EditById.replace(':goalId', goal?.goalId ?? ''), { backInformation });
          if (showExpandedActionMenu) {
            popDrawer({ popAll: true });
          }
        },
      });
    }

    if (goal.permissions.includes(Goals.GoalPermission.CanEditGoalStatus)) {
      const lastStatusUpdate = goal.statusUpdates?.[0];
      tempMenuItems.push({
        text: 'Update Status',
        icon: faBullseyeArrow,
        onClick: () => {
          openGoalStatusUpdateModal({
            modalProps: {
              goal,
              completionPercentage: goal.measurementScale?.completionPercentage ?? 0,
              status: lastStatusUpdate?.status ?? Goals.GoalStatus.OnTrack,
              statusCommentary: '',
              statusCommentarySummary: '',
              measurementScale: goal.measurementScale,
            },
          });
        },
      });
    }

    // We don't have a permission for cloning a goal, so using CanViewGoal for now
    if (goal.permissions.includes(Goals.GoalPermission.CanViewGoal)) {
      tempMenuItems.push({
        text: `Clone This ${featureNamesText.goals.singular}`,
        icon: faCopy,
        onClick: () => {
          history.push(goalRoutes.Create, { backInformation, initialGoal: goal, workflow: CreateGoalWorkflow.Clone });
          popDrawer({ popAll: true });
        },
      });
    }

    if (goal.permissions.includes(Goals.GoalPermission.CanDeleteGoal)) {
      tempMenuItems.push({
        text: `Delete ${featureNamesText.goals.singular}`,
        icon: faTrash,
        onClick: openConfirmationPopover,
        styles: {
          menuText: styles.deleteGoal,
          menuItem: styles.deleteGoal,
          iconColor: 'red',
        },
      });
    }

    return tempMenuItems;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    showExpandedActionMenu,
    goal,
    featureNamesText.goals.singular,
    history,
    goalRoutes.ViewById,
    goalRoutes.EditById,
    goalRoutes.Create,
    backInformation,
    popDrawer,
    openConfirmationPopover,
  ]);

  if (!menuItems.length) {
    return <></>;
  }

  const hookProps = {
    anchorEl,
    closeConfirmationPopover,
    handleConfirmDeletion,
    isOpen,
    menuItems,
    popoverId,
    dataTestId,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
