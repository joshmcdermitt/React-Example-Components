import { css } from '@emotion/react';
import JoshModal from '~Common/V3/components/JoshModal';
import { palette } from '~Common/styles/colors';
import { OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { ResourceType } from '~DevelopmentPlan/const/types';
import useGetPersonalDevelopmentResourceTypeLabels, {
  PersonalDevelopmentResourceTypeLabels,
} from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentResourceTypeLabels';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { ViewResourceModalBody } from './ViewResourceModalBody';

const styles = {
  footer: css({
    '&>#viewModalButtons': {
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
  modalBody: css({
    flex: 1,
    overflow: 'unset',
  }),
  title: css({
    color: palette.brand.indigo,
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
  closeViewResourceModal: () => void,
  showViewResourceModal: boolean,
  resourceId: ResourceType | undefined,
  showData: boolean,
  resourceTypeLabels: PersonalDevelopmentResourceTypeLabels,
}

const View = ({
  closeViewResourceModal,
  showViewResourceModal,
  resourceId,
  showData,
  resourceTypeLabels,
}: ViewProps): JSX.Element => (
  <>
    {showData && resourceId !== ResourceType.All && (
      <JoshModal
        css={styles.modal}
        open={showViewResourceModal}
        onClose={closeViewResourceModal}
      >
        <JoshModal.Header>
          <JoshModal.Title css={styles.title}>
            {resourceTypeLabels[resourceId ?? ResourceType.All]}
          </JoshModal.Title>
        </JoshModal.Header>
        <JoshModal.Body css={styles.modalBody}>
          <ViewResourceModalBody />
        </JoshModal.Body>
        <JoshModal.Footer css={styles.footer}>
          <div id="viewModalButtons" />
        </JoshModal.Footer>
      </JoshModal>
    )}
  </>
);

export const ViewResourceModal = (): JSX.Element => {
  const {
    closeViewResourceModal,
    showViewResourceModal,
    resourceId,
    resourceContentId,
  } = useAddResourceModalStore((state) => ({
    closeViewResourceModal: state.closeViewResourceModal,
    showViewResourceModal: state.showViewResourceModal,
    resourceId: state.resourceId,
    resourceContentId: state.resourceContentId,
  }));

  const { resourceTypeLabels } = useGetPersonalDevelopmentResourceTypeLabels();

  const showData = !!resourceContentId && resourceContentId !== OPTIMISTIC_ID;

  const hookProps = {
    closeViewResourceModal,
    showViewResourceModal,
    resourceId,
    showData,
    resourceTypeLabels,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
