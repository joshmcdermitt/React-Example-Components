import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { Competency } from '~DevelopmentPlan/const/types';
import { DEFAULT_OPACITY, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import IconButton from '~Common/V3/components/Buttons/IconButton';
import ActionMenu, { MenuItem, useActionMenu } from '~Meetings/components/shared/ActionMenu';
import { faPencil, faTrash, faEllipsisVertical } from '@fortawesome/pro-light-svg-icons';
import { useCallback, useState } from 'react';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { forMobileObject, withLineClamp } from '~Common/styles/mixins';
import HTMLRenderer from '~Common/V3/components/HTML/HTMLRenderer';
import CompetencyResources from './CompetencyResources';
import { AddResource } from '../Layouts/ViewDetail/AddResource';
import AddCompetency from '../Layouts/Create/AddCompetency';

const styles = {
  competencyContainer: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    gap: '1.5rem',
  }, forMobileObject({
    gap: 0,
  })),
  competencyWrap: css({
    width: '100%',
    maxWidth: '800px',
  }),
  competencyName: (notEditingThisCompetency: boolean) => css({
    fontSize: '1rem',
    fontWeight: 600,
    color: palette.neutrals.gray800,
    maxWidth: '50rem',
    display: 'flex',
    alignItems: 'center',
  }, notEditingThisCompetency && {
    opacity: DEFAULT_OPACITY,
  }),
  competencyNameText: css({
  }, withLineClamp(1)),
  competencyDescription: (notEditingThisCompetency: boolean) => css({
    fontSize: '.875rem',
    color: palette.neutrals.gray800,
    fontWeight: 400,
    paddingRight: '1rem',
  }, notEditingThisCompetency && {
    opacity: DEFAULT_OPACITY,
  }),
  editIcon: css({
    color: palette.neutrals.gray700,
    marginLeft: '.5rem',
    cursor: 'pointer',
    fontSize: '.875rem',
    display: 'flex',

    svg: {
      width: '.75rem !important',
      height: '1.125rem !important',
    },
  }),
};

interface ViewProps {
  competency: Competency,
  isEditing: boolean,
  isEditingOtherItem: boolean,
  setCompetencyIdToEdit: (competencyId: number | undefined) => void,
  isOptimisticallyUpdated: boolean,
  pdpId: string,
  menuItems: MenuItem[][],
  doOpen: (event: React.MouseEvent<HTMLElement>) => void,
  actionMenuProps: {
    anchorEle: HTMLElement | null;
    onClose: () => void;
  },
  onClickCallback: () => void,
  isOpen: boolean,
  setIsOpen: (isOpen: boolean) => void,
  resetForm: () => void,
  isOwner: boolean,
}

const View = ({
  competency,
  isEditing,
  setCompetencyIdToEdit,
  isOptimisticallyUpdated,
  pdpId,
  actionMenuProps,
  menuItems,
  doOpen,
  onClickCallback,
  isOpen,
  setIsOpen,
  resetForm,
  isOwner,
  isEditingOtherItem,
}: ViewProps): JSX.Element => (
  <div
    css={styles.competencyContainer}
  >
    <div
      css={styles.competencyWrap}
    >
      {isEditing && (
        <AddCompetency
          isEditing
          competency={competency}
          setCompetencyIdToEdit={setCompetencyIdToEdit}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          resetForm={resetForm}
        />
      )}
      {!isEditing && (
        <>
          <div css={styles.competencyName(isEditingOtherItem)}>
            <div css={styles.competencyNameText}>{competency.name}</div>
            {!isOptimisticallyUpdated && (
            <div>
              <IconButton
                onClick={doOpen}
                data-test-id="personalDevelopmentComptencyMenu"
                tooltip="Competency Options"
                type="button"
                icon={faEllipsisVertical}
                size="large"
                css={styles.editIcon}
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
            </div>
            )}
          </div>
          <HTMLRenderer css={styles.competencyDescription(isEditingOtherItem)} htmlText={competency.description} />
        </>
      )}
      {/* TODO: Need to add in the Drag and Drop functionality here from Mitchs' PR */}
      <CompetencyResources
        resources={competency.resources}
        weAreEditing={isEditing || isEditingOtherItem}
        competencyId={competency.id}
        pdpId={pdpId}
      />
    </div>
    {isOwner && (
      <AddResource
        competencyId={competency.id}
        isOptimisticallyUpdated={isOptimisticallyUpdated}
      />
    )}
  </div>
);

interface CompetencyItemProps {
  competency: Competency,
  isEditing: boolean,
  isEditingOtherItem: boolean,
  editCompetency: (competency: Competency) => () => void,
  setCompetencyIdToEdit: (competencyId: number | undefined) => void,
  pdpId: string,
  isOwner: boolean,
}

const CompetencyItem = ({
  competency,
  isEditing,
  editCompetency,
  setCompetencyIdToEdit,
  pdpId,
  isOwner,
  ...props
}: CompetencyItemProps): JSX.Element => {
  const isOptimisticallyUpdated = competency.id === OPTIMISTIC_ID;
  const [isOpen, setIsOpen] = useState(isEditing);

  const {
    openDeleteResourceModal,
    setCompetencyId,
  } = useAddResourceModalStore((state) => ({
    openDeleteResourceModal: state.openDeleteResourceModal,
    setCompetencyId: state.setCompetencyId,
  }));

  const { doOpen, ...actionMenuProps } = useActionMenu();
  const onClickCallback = useCallback(() => {
    actionMenuProps.onClose();
  }, [actionMenuProps]);
  const menuItems: MenuItem[][] = [
    [
      {
        text: 'Edit',
        icon: faPencil,
        onClick: editCompetency(competency),
      },
      {
        text: 'Delete',
        icon: faTrash,
        onClick: () => {
          setCompetencyId(competency?.id);
          openDeleteResourceModal();
        },
      },
    ],
  ];

  const resetForm = (): void => {
    setCompetencyIdToEdit(undefined);
    setIsOpen(false);
  };

  const hookProps = {
    competency,
    isEditing,
    setCompetencyIdToEdit,
    isOptimisticallyUpdated,
    pdpId,
    actionMenuProps,
    menuItems,
    doOpen,
    onClickCallback,
    isOpen,
    setIsOpen,
    resetForm,
    isOwner,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View, CompetencyItem };
export default CompetencyItem;
