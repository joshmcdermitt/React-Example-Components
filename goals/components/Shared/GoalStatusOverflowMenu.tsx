import { css } from '@emotion/react';
import {
  faEdit,
  faEllipsisVertical,
  faLink,
  faTrash,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copy from 'copy-to-clipboard';

import NiceModal from '@ebay/nice-modal-react';
import { Goals } from '@josh-hr/types';
import { MouseEventHandler, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from '~Common/components/Toasts';
import { palette } from '~Common/styles/colors';
import ConfirmationButtons from '~Common/V3/components/ButtonWithConfirmation/ConfirmationButtons';
import ConfirmationPopover, {
  useConfirmationPopover,
  UseConfirmationPopoverHookReturn,
} from '~Common/V3/components/ButtonWithConfirmation/ConfirmationPopover';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import OverflowMenu from '~Common/V3/components/OverflowMenu';
import { useDeleteGoalStatusUpdate } from '~Goals/hooks/statusUpdates/useDeleteGoalStatusUpdate';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import useOpenGoalStatusUpdateModal from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/useOpenGoalStatusUpdateModalDeprecated';
import { MenuItem } from '~Meetings/components/shared/ActionMenu';
import GoalStatusHistoryModal from '../GoalStatusHistoryModal';

const styles = {
  overflowMenuButton: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '.4375rem',
    paddingRight: '.4375rem',
  }),
  icon: css({
    height: '1.125rem',
    color: palette.neutrals.gray700,
  }),
  deleteMenuItem: css({
    color: palette.brand.red,
  }),
};

interface ViewProps extends UseConfirmationPopoverHookReturn {
  menuItems: MenuItem[][],
  handleConfirmDeletion: MouseEventHandler<HTMLButtonElement>,
}

const View = ({
  menuItems,
  anchorEl,
  isOpen,
  popoverId,
  closeConfirmationPopover,
  handleConfirmDeletion,
  ...props
}: ViewProps): JSX.Element => (
  <>
    <OverflowMenu
      menuItems={menuItems}
      renderOverflowMenuButton={(doOpen) => (
        <JoshButton
          css={styles.overflowMenuButton}
          onClick={doOpen}
          variant="text"
          data-test-id="objectiveStatusActionMenu"
        >
          <FontAwesomeIcon css={styles.icon} icon={faEllipsisVertical} />
        </JoshButton>
      )}
      {...props}
    />
    <ConfirmationPopover
      closeConfirmationPopover={closeConfirmationPopover}
      open={isOpen}
      popoverId={popoverId}
      anchorEl={anchorEl}
      renderConfirmationButtons={({ informationStyles, optionStyles, popoverButtonStyles }) => (
        <ConfirmationButtons
          onConfirm={handleConfirmDeletion}
          informationStyles={informationStyles}
          optionStyles={optionStyles}
          popoverButtonStyles={popoverButtonStyles}
        />
      )}
    />
  </>
);

interface GoalStatusOverflowMenuProps {
  goal: Goals.Goal,
  status: Goals.GoalStatusUpdate,
  canEditStatusUpdate: boolean,
  canDeleteStatusUpdate: boolean,
  isDrawer?: boolean,
}

const GoalStatusOverflowMenu = ({
  goal,
  status,
  isDrawer = false,
  canDeleteStatusUpdate,
  canEditStatusUpdate,
  ...props
}: GoalStatusOverflowMenuProps): JSX.Element => {
  const {
    anchorEl,
    openConfirmationPopover,
    closeConfirmationPopover,
    isOpen,
    popoverId,
  } = useConfirmationPopover('deleteGoalStatusUpdate');
  const history = useHistory();
  const { goalRoutes } = useGetGoalRoutes();
  const { openGoalStatusUpdateModal } = useOpenGoalStatusUpdateModal();

  const { mutate: deleteGoalStatusUpdate } = useDeleteGoalStatusUpdate({
    onSuccessCallback: isDrawer ? undefined : (newGoalData) => {
      const { statusUpdates, goalId } = newGoalData.response;
      const statusIdToNavigateTo = statusUpdates[statusUpdates.length - 1].statusId;
      history.push(goalRoutes.GoalStatusById.replace(':goalId', goalId).replace(':statusId', statusIdToNavigateTo));
    },
  });

  const menuItems = useMemo(() => {
    const tempMenuItems: MenuItem[][] = [[]];
    if (canEditStatusUpdate) {
      tempMenuItems[0].push(
        {
          text: 'Edit Status Update',
          onClick: () => {
            void NiceModal.hide(GoalStatusHistoryModal);
            openGoalStatusUpdateModal({
              modalProps: {
                isEdit: true,
                goal,
                statusId: status.statusId,
                status: status.status,
                completionPercentage: status.completionPercentage,
                statusCommentary: status.statusCommentary,
                statusCommentarySummary: status.statusCommentarySummary ?? '',
                measurementScale: goal.measurementScale,
                onCloseCallback: () => {
                  if (!isDrawer) {
                    void NiceModal.show(GoalStatusHistoryModal, {
                      goalId: goal.goalId,
                      displayedStatusId: status.statusId,
                    });
                  }
                },
              },
            });
          },
          icon: faEdit,
        },
      );
    }

    tempMenuItems[0].push(
      {
        text: 'Copy Link',
        onClick: () => {
          const copySuccessful = copy(
            `${window.location.origin}${goalRoutes.GoalStatusById.replace(':goalId', goal.goalId).replace(':statusId', status.statusId)}`,
          );
          if (copySuccessful) {
            toast.info('Copied.');
          }
        },
        icon: faLink,
      },
    );

    if (canDeleteStatusUpdate) {
      tempMenuItems.push([
        {
          text: 'Delete Status Update',
          onClick: (event) => {
            openConfirmationPopover(event);
          },
          icon: faTrash,
          styles: {
            menuText: styles.deleteMenuItem,
            menuItem: styles.deleteMenuItem,
            iconColor: palette.brand.red,
          },
        },
      ]);
    }

    return tempMenuItems;
  }, [
    canDeleteStatusUpdate,
    canEditStatusUpdate,
    goal,
    isDrawer,
    openConfirmationPopover,
    openGoalStatusUpdateModal,
    status.completionPercentage,
    status.status,
    status.statusCommentary,
    status.statusCommentarySummary,
    status.statusId,
    goalRoutes.GoalStatusById,
  ]);

  const handleConfirmDeletion: MouseEventHandler<HTMLButtonElement> = (event): void => {
    deleteGoalStatusUpdate({
      goalId: goal.goalId,
      statusId: status.statusId,
    });
    closeConfirmationPopover(event);
  };

  const hookProps = {
    menuItems,
    anchorEl,
    openConfirmationPopover,
    closeConfirmationPopover,
    isOpen,
    popoverId,
    handleConfirmDeletion,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default GoalStatusOverflowMenu;
