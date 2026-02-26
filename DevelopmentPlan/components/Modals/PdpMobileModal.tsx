import { css } from '@emotion/react';
import JoshModal from '~Common/V3/components/JoshModal';
import { palette } from '~Common/styles/colors';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { PDPMobileModals } from '~DevelopmentPlan/const/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComments } from '@fortawesome/pro-light-svg-icons';
import { TimelineMobile } from './Timeline/TimelineMobile';
import { CommentsMobile } from './Comments/CommentsMobile';

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
    overflowY: 'auto',
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
  titleIcon: css({
    marginRight: '.625rem',
    color: palette.neutrals.gray800,
  }),
};

interface ViewProps {
  showPdpMobileModal: boolean,
  closePdpMobileModal: () => void,
  modalToShow: PDPMobileModals,
  idToUse?: string,
}

const View = ({
  showPdpMobileModal,
  closePdpMobileModal,
  modalToShow,
  idToUse,
}: ViewProps): JSX.Element => (
  <>
    <JoshModal
      css={styles.modal}
      open={showPdpMobileModal}
      onClose={closePdpMobileModal}
    >
      <JoshModal.Header>
        <JoshModal.Title css={styles.title}>
          <FontAwesomeIcon
            css={styles.titleIcon}
            icon={modalToShow === PDPMobileModals.Discussion ? faComments : faClock}
          />
          {modalToShow}
        </JoshModal.Title>
      </JoshModal.Header>
      <JoshModal.Body css={styles.modalBody}>
        {modalToShow === PDPMobileModals.Discussion && (
        <CommentsMobile
          idToUse={idToUse}
        />
        )}
        {modalToShow === PDPMobileModals.Timeline && (
        <TimelineMobile
          idToUse={idToUse}
        />
        )}
      </JoshModal.Body>
      <JoshModal.Footer css={styles.footer}>
        <div id="viewModalButtons" />
      </JoshModal.Footer>
    </JoshModal>
  </>
);

interface PdpMobileModalProps {
  modalToShow: PDPMobileModals,
  idToUse?: string,
}

export const PdpMobileModal = ({
  modalToShow,
  idToUse,
}: PdpMobileModalProps): JSX.Element => {
  const {
    showPdpMobileModal,
    closePdpMobileModal,
  } = useAddResourceModalStore((state) => ({
    showPdpMobileModal: state.showPdpMobileModal,
    closePdpMobileModal: state.closePdpMobileModal,
  }));

  const hookProps = {
    showPdpMobileModal,
    closePdpMobileModal,
    modalToShow,
    idToUse,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
