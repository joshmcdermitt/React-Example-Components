import { css } from '@emotion/react';
import { faEllipsisV } from '@fortawesome/pro-solid-svg-icons';
import { faEllipsisV as faEllipsisVLight } from '@fortawesome/pro-light-svg-icons';
import { SyntheticEvent, useCallback } from 'react';
import { palette } from '~Common/styles/colors';
import ActionMenu, { MenuItem, useActionMenu } from '~Meetings/components/shared/ActionMenu';
import IconButton from '~Common/V3/components/Buttons/IconButton';
import {
  ActionMenuActions, CompetencyRow, PDPPermissions, ViewPersonalDevelopmentPlanPerspective,
} from '~DevelopmentPlan/const/types';
import { useHistory, useParams } from 'react-router-dom';
import { setDetailMenuItems } from '~DevelopmentPlan/const/functions';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { useClosePlan } from '~DevelopmentPlan/hooks/useClosePlan';
import { useCompletePlan } from '~DevelopmentPlan/hooks/useCompletePlan';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { useDeleteResource } from '~DevelopmentPlan/hooks/useDeleteResource';
import DeleteConfirmationPopover, { useDeleteConfirmationPopover } from '~Common/V3/components/DeleteConfirmation/DeleteConfirmationPopover';
import DeleteConfirmationButtons from '~Common/V3/components/DeleteConfirmation/DeleteConfirmationButtons';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { PersonalDevelopmentPlanDetailsParams } from '../Layouts/ViewDetail/PersonalDevelopmentPlanDetails';
import UnlinkConfirmationButtons from './UnlinkConfirmationButtons';

const styles = {
  ellipsis: (thinMenu: boolean) => css({
    marginRight: '.625rem',
    color: palette.neutrals.gray500,
    marginLeft: '.5rem',
    border: `1px solid ${palette.neutrals.gray200}`,
    borderRadius: '.1875rem',
    padding: '0',

    '& svg': {
      borderRadius: '.1875rem',
      color: palette.neutrals.gray500,
    },
  }, thinMenu && {
    border: 'none',
    margin: '0',
    '& svg': {
      width: '1rem',
      height: '1rem',
    },
  }),
};

interface ViewProps {
  doOpen: (event: React.MouseEvent<HTMLElement>) => void,
  menuItems: MenuItem[][],
  actionMenuProps: {
      anchorEle: HTMLElement | null;
      onClose: () => void;
  },
  onClickCallback: () => void,
  tooltipText: string,
  thinMenu: boolean,
  anchorEl: HTMLElement | null,
  closeConfirmationPopover: (event: SyntheticEvent<HTMLElement, Event>) => void
  isOpen: boolean,
  popoverId: string | undefined,
  handleConfirmDeletion: () => void,
  showUnlink: boolean,
}
const View = ({
  doOpen,
  menuItems,
  actionMenuProps,
  onClickCallback,
  tooltipText,
  thinMenu,
  anchorEl,
  closeConfirmationPopover,
  isOpen,
  popoverId,
  handleConfirmDeletion,
  showUnlink,
}: ViewProps): JSX.Element => (
  <>
    {menuItems.length > 0 && (
      <>
        <IconButton
          onClick={doOpen}
          data-test-id="personalDevelopmentActionMenu"
          tooltip={tooltipText}
          type="button"
          icon={thinMenu ? faEllipsisVLight : faEllipsisV}
          size="large"
          css={styles.ellipsis(thinMenu)}
        />
        <ActionMenu
          menuItems={menuItems}
          onClick={onClickCallback}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          {...actionMenuProps}
        />
      </>
    )}
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
        <>
          {showUnlink && (
          <UnlinkConfirmationButtons
            informationStyles={informationStyles}
            optionStyles={optionStyles}
            popoverButtonStyles={popoverButtonStyles}
            onDelete={handleConfirmDeletion}
          />
          )}
          {!showUnlink && (
          <DeleteConfirmationButtons
            informationStyles={informationStyles}
            optionStyles={optionStyles}
            popoverButtonStyles={popoverButtonStyles}
            onDelete={handleConfirmDeletion}
          />
          )}
        </>
      )}
    />
  </>
);

interface ActionMenuProps {
  permissions: PDPPermissions[],
  tooltipText?: string,
  thinMenu?: boolean,
  params?: GridRenderCellParams<number, CompetencyRow>,
  isDraft?: boolean,
  showUnlink?: boolean,
}

const PersonalDevelopmentActionMenu = ({
  permissions,
  tooltipText = 'Plan Options',
  thinMenu = false,
  params,
  isDraft,
  showUnlink = false,
}: ActionMenuProps): JSX.Element => {
  const {
    anchorEl,
    openConfirmationPopover,
    closeConfirmationPopover,
    isOpen,
    popoverId,
  } = useDeleteConfirmationPopover('personalDevelopmentActionMenu');

  const {
    openDeletePlanModal,
    openReopenPlanModal,
  } = useAddResourceModalStore((state) => ({
    openDeletePlanModal: state.openDeletePlanModal,
    openReopenPlanModal: state.openReopenPlanModal,
  }));

  // close isn't being used, but its throwing an error in the console, since its being spread into the ActionMenu component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { doOpen, close, ...actionMenuProps } = useActionMenu();
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const onClickCallback = useCallback(() => {
    actionMenuProps.onClose();
  }, [actionMenuProps]);

  const {
    mutate: closePlanMutation,
  } = useClosePlan();
  const {
    mutate: completePlanMutation,
  } = useCompletePlan();

  const {
    mutate: deleteResourceMutation,
  } = useDeleteResource();
  const history = useHistory();
  const handleActionmenuClick = (type: ActionMenuActions, id: number, event?: SyntheticEvent<HTMLElement, Event>): void => {
    const handleAction = (actionType: ActionMenuActions): void => {
      const convertedId = id.toString();
      switch (actionType) {
        case ActionMenuActions.MarkComplete:
          completePlanMutation({ id: convertedId });
          break;
        case ActionMenuActions.Unlink:
          if (event) openConfirmationPopover(event);
          break;
        case ActionMenuActions.ReOpenPlan:
          openReopenPlanModal();
          break;
        case ActionMenuActions.ClosePlan:
          closePlanMutation({ id: convertedId });
          break;
        case ActionMenuActions.EditCompetencies: {
          const editDetail = DevelopmentPlanRoutes.EditById
            .replace(':pdpId', convertedId)
            .replace(':stepId', ViewPersonalDevelopmentPlanPerspective.Create_Plan);
          history.push(editDetail);
          break;
        }
        case ActionMenuActions.EditDetails: {
          const editDetail = DevelopmentPlanRoutes.EditById
            .replace(':pdpId', id.toString())
            .replace(':stepId', ViewPersonalDevelopmentPlanPerspective.Setup);
          history.push(editDetail);
          break;
        }
        case ActionMenuActions.DeletePlan:
          openDeletePlanModal();
          break;
        default:
          break;
      }
    };
    handleAction(type);
  };

  const menuItems:MenuItem[][] = setDetailMenuItems(permissions, handleActionmenuClick, parseInt(pdpId, 10), isDraft);

  const {
    setPage,
  } = useStoreParams((state) => ({
    setPage: state.setPage,
  }));
  const handleConfirmDeletion = (): void => {
    if (params) {
      const {
        row: {
          competency:
                { id: competencyId },
          id: resourceId,
        },
      } = params;

      deleteResourceMutation({ id: pdpId, competencyId, resourceId }, { onSuccess: () => setPage(1) });
    }
  };

  const hookProps = {
    actionMenuProps,
    menuItems,
    doOpen,
    onClickCallback,
    tooltipText,
    thinMenu,
    anchorEl,
    closeConfirmationPopover,
    isOpen,
    popoverId,
    handleConfirmDeletion,
    showUnlink,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default PersonalDevelopmentActionMenu;
