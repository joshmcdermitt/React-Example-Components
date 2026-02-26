import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import JoshModal from '~Common/V3/components/JoshModal';
import { palette } from '~Common/styles/colors';
import { DEFAULT_DATE, DEFAULT_RESOURCE_TITLE } from '~DevelopmentPlan/const/defaults';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { ResourceType } from '~DevelopmentPlan/const/types';
import useGetPersonalDevelopmentResourceTypeLabels from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentResourceTypeLabels';
import { AddResourceModalBody } from './AddResourceModalBody';

const styles = {
  footer: css({
    '&>#modalButtons': {
      alignItems: 'center',
      columnGap: '0.5rem',
      display: 'flex',
      flexDirection: 'row',
    },
  }),
  modal: css({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }),
  title: css({
    color: palette.neutrals.gray800,
    fontSize: '1.125rem',
    fontWeight: 600,
  }),
  tabWrapper: css({
    backgroundColor: palette.neutrals.gray100,
    display: 'flex',
    height: '3.125rem',
    alignItems: 'flex-end',
    position: 'relative',

    ':before': {
      width: '300%',
      height: '100%',
      content: '""',
      background: 'inherit',
      position: 'absolute',
      top: 0,
      left: '-100%',
      zIndex: -1,
    },
  }),
  tabNavItem: css({
    display: 'flex',
    alignItems: 'center',
  }),
};

interface ViewProps {
  activeTab: number,
  setActiveTab: (tab: number) => void,
  closeAddResourceModal: () => void,
  showAddResourceModal: boolean,
  getResourceTypeString: () => string,
  pdpId: string,
}

const View = ({
  activeTab,
  setActiveTab,
  closeAddResourceModal,
  showAddResourceModal,
  getResourceTypeString,
  pdpId,
}: ViewProps): JSX.Element => (
  <JoshModal
    css={styles.modal}
    open={showAddResourceModal}
    onClose={closeAddResourceModal}
  >
    <JoshModal.Header>
      <JoshModal.Title css={styles.title}>
        {getResourceTypeString()}
      </JoshModal.Title>
    </JoshModal.Header>
    <JoshModal.Body>
      <AddResourceModalBody
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        pdpId={pdpId}
      />
    </JoshModal.Body>
    <JoshModal.Footer css={styles.footer}>
      <div id="modalButtons" />
    </JoshModal.Footer>
  </JoshModal>
);

interface AddResourceModalProps {
  pdpId: string,
}

export const AddResourceModal = ({
  pdpId,
}: AddResourceModalProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState(0);
  const {
    closeAddResourceModal,
    showAddResourceModal,
    resourceId,
    setResourceContentDueDate,
    setResourceContentTitle,
  } = useAddResourceModalStore((state) => ({
    closeAddResourceModal: state.closeAddResourceModal,
    showAddResourceModal: state.showAddResourceModal,
    setResourceContentDueDate: state.setResourceContentDueDate,
    setResourceContentTitle: state.setResourceContentTitle,
    resourceId: state.resourceId,
  }));

  const { resourceTypeLabels } = useGetPersonalDevelopmentResourceTypeLabels();

  const resourceTypeTitle = resourceTypeLabels[resourceId ?? ResourceType.All];
  const getResourceTypeString = (): string => (resourceTypeTitle !== resourceTypeLabels[ResourceType.Accomplishment]
    ? `Add ${resourceTypeTitle}` : `New ${resourceTypeTitle}`);
  // We want to reset data when we go to create a new resource
  useEffect(() => {
    setResourceContentDueDate(DEFAULT_DATE);
    setResourceContentTitle(DEFAULT_RESOURCE_TITLE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hookProps = {
    closeAddResourceModal,
    showAddResourceModal,
    activeTab,
    setActiveTab,
    pdpId,
    getResourceTypeString,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
