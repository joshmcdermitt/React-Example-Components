import { SyntheticEvent, useCallback } from 'react';
import { CloseModalResponse } from '~Common/const/constants';
import ButtonWithConfirmation, { ButtonWithConfirmationProps } from '~Common/V3/components/ButtonWithConfirmation';
import ConfirmationButtons from '~Common/V3/components/ButtonWithConfirmation/ConfirmationButtons';

interface ViewProps extends Omit<ButtonWithConfirmationProps, 'onClick' | 'renderConfirmationButtons'> {
  onClose: (e: SyntheticEvent<HTMLButtonElement>, openConfirmation: (e: SyntheticEvent<HTMLButtonElement>) => void) => void,
  onConfirm: () => void,
}

const View = ({
  onClose,
  onConfirm,
  ...props
}: ViewProps): JSX.Element => (
  <ButtonWithConfirmation
    onClick={onClose}
    renderConfirmationButtons={({
      informationStyles,
      optionStyles,
      popoverButtonStyles,
    }) => (
      <ConfirmationButtons
        onConfirm={onConfirm}
        questionText={CloseModalResponse.ConfirmUnsavedChanges}
        confirmText={CloseModalResponse.Yes}
        cancelText={CloseModalResponse.No}
        informationStyles={informationStyles}
        optionStyles={optionStyles}
        popoverButtonStyles={popoverButtonStyles}
      />
    )}
    {...props}
  />
);

export interface ShouldConfirmButtonProps extends Omit<ViewProps, 'onClose'> {
  shouldConfirmClose: boolean,
}

const ShouldConfirmButton = ({
  onConfirm,
  shouldConfirmClose,
  ...props
}: ShouldConfirmButtonProps): JSX.Element => {
  const onClose = useCallback((e: SyntheticEvent<HTMLButtonElement>, openConfirmation: (e: SyntheticEvent<HTMLButtonElement>) => void) => {
    if (shouldConfirmClose) {
      openConfirmation(e);
    } else {
      onConfirm();
    }
  }, [shouldConfirmClose, onConfirm]);

  const hookProps = {
    onClose,
    onConfirm,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default ShouldConfirmButton;
