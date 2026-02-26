import { css } from '@emotion/react';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import JoshModal from '~Common/V3/components/JoshModal';
import { palette } from '~Common/styles/colors';

const styles = {
  modal: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  modalBody: css({
    flex: 1,
  }),
  title: (displayTextInBlue: boolean) => css({
    color: displayTextInBlue ? palette.brand.indigo : palette.brand.red,
  }),
  buttonSpacer: css({
    marginRight: '.5rem',
  }),
};

interface ViewProps {
  show: boolean,
  close: () => void,
  handleConfirmation: () => void,
  title: string,
  bodyText: string,
  buttonText: string,
  displayTextInBlue: boolean,
}

const View = ({
  show,
  close,
  handleConfirmation,
  title,
  bodyText,
  buttonText,
  displayTextInBlue,
}: ViewProps): JSX.Element => (
  <>
    <JoshModal
      css={styles.modal}
      open={show}
      onClose={close}
    >
      <JoshModal.Header>
        <JoshModal.Title css={styles.title(displayTextInBlue)}>
          {title}
        </JoshModal.Title>
      </JoshModal.Header>
      <JoshModal.Body css={styles.modalBody}>
        <p>{bodyText}</p>
      </JoshModal.Body>
      <JoshModal.Footer>
        <JoshButton
          data-test-id="confirmationModalAccept"
          onClick={handleConfirmation}
          size="small"
          color={displayTextInBlue ? 'primary' : 'danger'}
          css={styles.buttonSpacer}
        >
          {buttonText}
        </JoshButton>
        <JoshButton
          data-test-id="confirmationModalCancel"
          onClick={close}
          size="small"
          variant="ghost"
          color={displayTextInBlue ? 'primary' : 'danger'}
        >
          Cancel
        </JoshButton>
      </JoshModal.Footer>
    </JoshModal>
  </>
);

interface ConfirmationPlanModalProps {
  handleConfirmation: () => void,
  title: string,
  bodyText: string,
  buttonText: string,
  show: boolean,
  close: () => void,
  displayTextInBlue?: boolean,
}

export const ConfirmationPlanModal = ({
  handleConfirmation,
  title,
  bodyText,
  buttonText,
  show,
  close,
  displayTextInBlue = false,
}: ConfirmationPlanModalProps): JSX.Element => {
  const hookProps = {
    show,
    close,
    handleConfirmation,
    title,
    bodyText,
    buttonText,
    displayTextInBlue,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
