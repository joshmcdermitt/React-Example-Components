import { css } from '@emotion/react';
import {
  SyntheticEvent, useState,
} from 'react';

import { palette } from '~Common/styles/colors';
import { DEFAULT_OPACITY, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { openInNewTab } from '~DevelopmentPlan/const/functions';
import { CompetencyResource as CompetencyResourceType, ResourceType } from '~DevelopmentPlan/const/types';
import DeleteConfirmationPopover, {
  useDeleteConfirmationPopover,
} from '~Common/V3/components/DeleteConfirmation/DeleteConfirmationPopover';
import { useDeleteResource } from '~DevelopmentPlan/hooks/useDeleteResource';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { useGetPlanById } from '~DevelopmentPlan/hooks/useGetPlanById';
import { useResourceDetailsDrawer } from '../../Drawers/Resource/ResourceDetails';
import UnlinkConfirmationButtons from '../UnlinkConfirmationButtons';
import CompetencyResource from './CompetencyResource';

const styles = {
  resourcesContainer: (weAreEditing: boolean) => css({
    display: 'flex',
    gap: '.375rem',
    flexDirection: 'column',
    marginTop: '.375rem',
  }, weAreEditing && {
    opacity: DEFAULT_OPACITY,
  }),
  dueDate: css({
    alignSelf: 'flex-end',
    color: palette.neutrals.gray700,
    width: '6.5rem',
  }),
};

interface ViewProps {
  resources: CompetencyResourceType[] | undefined,
  weAreEditing: boolean,
  anchorEl: HTMLElement | null,
  openConfirmationPopover: (event: SyntheticEvent<HTMLElement, Event>) => void,
  closeConfirmationPopover: (event: SyntheticEvent<HTMLElement, Event>) => void
  isOpen: boolean,
  popoverId: string | undefined,
  handleConfirmDeletion: () => void,
  setResourceToBeDeleted: (resourceId: number) => void,
  handleResourceClick: (resource: CompetencyResourceType) => void,
}

const View = ({
  resources,
  weAreEditing,
  anchorEl,
  openConfirmationPopover,
  closeConfirmationPopover,
  isOpen,
  popoverId,
  handleConfirmDeletion,
  setResourceToBeDeleted,
  handleResourceClick,
}: ViewProps): JSX.Element => (
  <>
    <div
      css={styles.resourcesContainer(weAreEditing)}
    >
      {resources?.map((resource) => (
        <CompetencyResource
          key={resource.id}
          resource={resource}
          handleResourceClick={handleResourceClick}
          setResourceToBeDeleted={setResourceToBeDeleted}
          openConfirmationPopover={openConfirmationPopover}
        />
      ))}
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
          <UnlinkConfirmationButtons
            informationStyles={informationStyles}
            optionStyles={optionStyles}
            popoverButtonStyles={popoverButtonStyles}
            onDelete={handleConfirmDeletion}
          />
        )}
      />
    </div>
  </>
);

interface CompetencyResourcesProps {
  resources: CompetencyResourceType[] | undefined,
  weAreEditing?: boolean,
  competencyId: number,
  pdpId: string,
}

const CompetencyResources = ({
  resources,
  weAreEditing = false,
  competencyId,
  pdpId,
}: CompetencyResourcesProps): JSX.Element => {
  const [resourceToBeDeleted, setResourceToBeDeleted] = useState<number>(OPTIMISTIC_ID);

  const {
    anchorEl,
    openConfirmationPopover,
    closeConfirmationPopover,
    isOpen,
    popoverId,
  } = useDeleteConfirmationPopover('competencyResourceDeleteConfirmationPopover');

  const {
    mutate: deleteResourceMutation,
  } = useDeleteResource();

  const handleConfirmDeletion = (): void => {
    deleteResourceMutation({ id: pdpId, competencyId, resourceId: resourceToBeDeleted });
  };

  const { data: plan } = useGetPlanById({ id: pdpId });
  const { owner } = plan ?? {};
  const { openDrawer: openResourceDetailsDrawer } = useResourceDetailsDrawer();
  const {
    openViewResourceModal,
  } = useAddResourceModalStore((state) => ({
    openViewResourceModal: state.openViewResourceModal,
  }));

  const handleResourceClick = (resource: CompetencyResourceType): void => {
    const {
      contentType: { id: contentTypeId },
      contentId,
    } = resource;
    switch (contentTypeId) {
      case ResourceType.Meeting:
        openInNewTab(`/meetings?orgId=0x2f7fbc&meetingId=${contentId}`);
        break;
      case ResourceType.Accomplishment:
        openViewResourceModal(contentTypeId, competencyId, contentId, true);
        break;
      default:
        openResourceDetailsDrawer({
          resourceType: contentTypeId,
          subjectUid: contentId,
          ownerId: owner?.userId as string ?? '',
          ownerOrgID: owner?.orgUserId ?? '',
        });
    }
  };

  const hookProps = {
    resources,
    weAreEditing,
    anchorEl,
    openConfirmationPopover,
    closeConfirmationPopover,
    isOpen,
    popoverId,
    handleConfirmDeletion,
    setResourceToBeDeleted,
    handleResourceClick,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, CompetencyResources };
export default CompetencyResources;
