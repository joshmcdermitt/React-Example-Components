import { css } from '@emotion/react';
import {
  faArrowUpRightFromSquare,
  faEllipsisVertical,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDrawerActions } from '~Common/hooks/useDrawers';
import { palette } from '~Common/styles/colorsRedesign';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import OverflowMenu from '~Common/V4/components/OverflowMenu';
import { CreateGoalWorkflow } from '~Goals/hooks/utils/useGetCreateGoalDefaultValues';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import { ListIconPosition, MenuItem } from '~Common/V4/components/ActionMenu';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import DotsHorizontal from '~Assets/icons/components/DotsHorizontal';
import ConfirmationPopover, {
  UseConfirmationPopoverHookReturn,
  useConfirmationPopover,
} from '~Common/V3/components/ButtonWithConfirmation/ConfirmationPopover';
import ConfirmationButtons from '~Common/V3/components/ButtonWithConfirmation/ConfirmationButtons';
import { useQueryClient } from '@tanstack/react-query';
import { goalKeys } from '~Goals/const/queryKeys';
import useOpenGoalStatusUpdateModal from '~Goals/hooks/utils/useOpenGoalStatusUpdateModal';
import EditIcon from '~Assets/icons/components/V4/Edit05Icon';
import BarChartSquareIcon from '~Assets/icons/components/V4/BarChartSquare01Icon';
import CopyIcon from '~Assets/icons/components/V4/Copy07Icon';
import TrashIcon from '~Assets/icons/components/V4/Trash04Icon';
import { toast } from '~Common/components/Toasts';
import { useDeleteGoal } from '../../../hooks/useDeleteGoal';
import { getGoalById } from '../../../hooks/useGetGoalById';

const styles = {
  ellipsisIcon: css({
    height: '1.125rem',
  }),
  deleteGoal: css({
    color: palette.foreground.errorPrimary,
  }),
  actionButton: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '.4375rem',
    paddingRight: '.4375rem',
    color: palette.foreground.quinary.default,
  }),
};

export enum IconDirection {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

interface ViewProps extends Omit<UseConfirmationPopoverHookReturn, 'openConfirmationPopover'> {
  menuItems: MenuItem[],
  handleConfirmDeletion: () => void,
  dataTestId: string,
  buttonIconDirection?: IconDirection,
  listIconPosition?: ListIconPosition,
}

const View = ({
  menuItems,
  closeConfirmationPopover,
  isOpen,
  popoverId,
  anchorEl,
  handleConfirmDeletion,
  dataTestId,
  buttonIconDirection = IconDirection.Vertical,
  listIconPosition,
  ...props
}: ViewProps): JSX.Element => (
  <>
    <OverflowMenu
      menuItems={[menuItems]}
      listIconPosition={listIconPosition}
      renderOverflowMenuButton={(doOpen) => (
        <JoshButton
          onClick={doOpen}
          variant="text"
          data-test-id={dataTestId}
          css={styles.actionButton}
        >
          {buttonIconDirection === IconDirection.Horizontal && (
            <DotsHorizontal />
          )}
          {buttonIconDirection === IconDirection.Vertical && (
            <FontAwesomeIcon css={styles.ellipsisIcon} icon={faEllipsisVertical} />
          )}
        </JoshButton>
      )}
      {...props}
    />
    <ConfirmationPopover
      closeConfirmationPopover={closeConfirmationPopover}
      open={isOpen}
      popoverId={popoverId}
      anchorEl={anchorEl}
      renderConfirmationButtons={({
        informationStyles,
        optionStyles,
        popoverButtonStyles,
      }) => (
        <ConfirmationButtons
          informationStyles={informationStyles}
          optionStyles={optionStyles}
          popoverButtonStyles={popoverButtonStyles}
          onConfirm={handleConfirmDeletion}
        />
      )}
    />
  </>
);

interface GoalActionMenuProps {
  goal: Goals.GoalV4,
  showExpandedActionMenu?: boolean,
  backInformation?: {
    location: string,
    backText: string,
  },
  isDrawer?: boolean,
  dataTestId?: string,
  buttonIconDirection?: IconDirection,
  isGoalsDashboard: boolean,
  isCascadingGoals?: boolean,
  listIconPosition?: ListIconPosition,
}

export const GoalActionMenu = ({
  goal,
  showExpandedActionMenu = false,
  backInformation,
  isDrawer = false,
  dataTestId = 'objectiveStatusActionMenu',
  buttonIconDirection = IconDirection.Vertical,
  isGoalsDashboard,
  isCascadingGoals = false,
  listIconPosition,
  ...props
}: GoalActionMenuProps): JSX.Element => {
  const { popDrawer } = useDrawerActions();
  const {
    anchorEl,
    openConfirmationPopover,
    closeConfirmationPopover,
    isOpen,
    popoverId,
  } = useConfirmationPopover('goalsViewGoalDeleteConfirmationPopover');
  const queryClient = useQueryClient();
  const {
    status, statusId, isAchieved, value,
  } = goal.currentStatusUpdate;
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const { openGoalStatusUpdateModal } = useOpenGoalStatusUpdateModal();

  const history = useHistory();

  const { goalId } = goal;

  const { mutate: deleteGoalMutation } = useDeleteGoal();

  const handleConfirmDeletion = (): void => {
    deleteGoalMutation({ goalId }, {
      onSuccess: async () => {
        if (isGoalsDashboard) {
          await queryClient.invalidateQueries({
            queryKey: [goalKeys.lists(), isCascadingGoals ? 'cascading' : 'non-cascading'],
          });
        } else if (isDrawer) {
          popDrawer({ popAll: true });
        } else {
          history.push(goalRoutes.Dashboard);
        }
      },
    });
  };

  const menuItems = useMemo(() => {
    /**
     * Temporarily stores the menu items to be displayed in the action menu.
     * It is an array of objects, each containing the following properties:
     * - text: The text to be displayed in the menu item.
     * - icon?: The icon to be displayed in the menu item.
     * - onClick: The function to be called when the menu item is clicked.
     * - divider?: Whether to display a divider below the menu item.
     */
    const tempMenuItems: MenuItem[] = [];

    if (showExpandedActionMenu) {
      tempMenuItems.push({
        text: `Expand ${featureNamesText.goals.singular}`,
        faIcon: faArrowUpRightFromSquare,
        onClick: () => {
          history.push(goalRoutes.ViewById.replace(':goalId', goal?.goalId ?? ''), { backInformation });
          popDrawer({ popAll: true });
        },
      });
    }

    if (goal.permissions.includes(Goals.GoalPermission.CanEditGoal)) {
      tempMenuItems.push({
        text: `Edit ${featureNamesText.goals.singular}`,
        svgIcon: EditIcon,
        onClick: () => {
          history.push(goalRoutes.EditById.replace(':goalId', goal?.goalId ?? ''), { backInformation });
          if (showExpandedActionMenu) {
            popDrawer({ popAll: true });
          }
        },
      });
    }

    if (goal.permissions.includes(Goals.GoalPermission.CanEditGoalStatus)) {
      tempMenuItems.push({
        text: 'Update Status',
        svgIcon: BarChartSquareIcon,
        onClick: () => {
          openGoalStatusUpdateModal({
            modalProps: {
              goal,
              isAchieved: isAchieved ?? false,
              isEdit: false,
              measurementScale: goal.measurementScale,
              status,
              statusCommentary: '',
              statusId: String(statusId),
              value: value ?? undefined,
            },
          });
        },
      });
    }

    // We don't have a permission for cloning a goal, so using assess if the user can view the goal
    if (goal.permissions.includes(Goals.GoalPermission.CanViewGoal)) {
      tempMenuItems.push({
        text: `Clone This ${featureNamesText.goals.singular}`,
        svgIcon: CopyIcon,
        onClick: async () => {
          try {
            const result = await getGoalById({ goalId: goal.goalId });
            const initialGoal = result.response;
            if (initialGoal) {
              // Since we're cloning the current goal which is a GoalV4, we can safely cast the response
              history.push(goalRoutes.Create, { backInformation, initialGoal: initialGoal as unknown as Goals.GoalV4, workflow: CreateGoalWorkflow.Clone });
              popDrawer({ popAll: true });
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching goal for cloning:', error);
            toast.error('Error fetching goal for cloning');
          }
        },
      });
    }

    if (goal.permissions.includes(Goals.GoalPermission.CanDeleteGoal)) {
      tempMenuItems.push({
        text: `Delete ${featureNamesText.goals.singular}`,
        svgIcon: TrashIcon,
        onClick: openConfirmationPopover,
        styles: {
          menuText: styles.deleteGoal,
          menuItem: styles.deleteGoal,
          iconColor: palette.foreground.errorPrimary,
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
    buttonIconDirection,
    listIconPosition,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
