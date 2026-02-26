import { css } from '@emotion/react';
import JoshModal from '~Common/V3/components/JoshModal';
import { palette } from '~Common/styles/colors';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import AddComment from '../Layouts/ViewDetail/AddComment';

// TODO: consolidate these once completed with all modals
const styles = {
  footer: css({
    '&>#contextButtonsViewDetails': {
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
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: '1.3125rem',
  }),
  subTitle: css({
    color: palette.neutrals.gray700,
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.5rem',
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
  closeApprovePlanModal: () => void,
  showApprovePlanModal: boolean,
  planOwnerName: string,
}

const View = ({
  closeApprovePlanModal,
  showApprovePlanModal,
  planOwnerName,
}: ViewProps): JSX.Element => (
  <JoshModal
    css={styles.modal}
    open={showApprovePlanModal}
    onClose={closeApprovePlanModal}
  >
    <JoshModal.Header>
      <JoshModal.Title css={styles.title}>
        Complete Plan Review
        <div css={styles.subTitle}>{`Leave a note for ${planOwnerName}`}</div>
      </JoshModal.Title>
    </JoshModal.Header>
    <JoshModal.Body css={styles.modalBody}>
      <AddComment
        isApprovalProcess
      />
    </JoshModal.Body>
    <JoshModal.Footer css={styles.footer}>
      <div id="modalButtons" />
    </JoshModal.Footer>
  </JoshModal>
);

interface ApprovePlanModalProps {
  planOwnerName: string,
}

export const ApprovePlanModal = ({
  planOwnerName,
}: ApprovePlanModalProps): JSX.Element => {
  const {
    closeApprovePlanModal,
    showApprovePlanModal,
  } = useAddResourceModalStore((state) => ({
    closeApprovePlanModal: state.closeApprovePlanModal,
    showApprovePlanModal: state.showApprovePlanModal,
  }));

  const hookProps = {
    closeApprovePlanModal,
    showApprovePlanModal,
    planOwnerName,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
