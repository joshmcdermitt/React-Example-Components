import { MouseEvent } from 'react';
import Button from '~Common/V3/components/Button';
import { RenderConfirmationButtonsParams } from '~Common/V3/components/DeleteConfirmation/DeleteConfirmationPopover';

interface UnlinkConfirmationButtonsProps extends RenderConfirmationButtonsParams {
  onDelete: (mouseEvent: MouseEvent) => void,
}

const UnlinkConfirmationButtons = ({
  informationStyles,
  optionStyles,
  popoverButtonStyles,
  onDelete,
}: UnlinkConfirmationButtonsProps): JSX.Element => (
  <>
    <Button
      variant="text"
      renderContents={() => <>Are You Sure?</>}
      css={[popoverButtonStyles, informationStyles]}
      disabled
    />
    <Button
      variant="text"
      data-test-id="confirmDeleteButton"
      renderContents={() => <>Yes, Unlink</>}
      css={[popoverButtonStyles, optionStyles]}
      onClick={onDelete}
    />
    <Button
      variant="text"
      data-test-id="cancelDeleteButton"
      renderContents={() => <>No, Cancel</>}
      css={[popoverButtonStyles, optionStyles]}
    />
  </>
);

export default UnlinkConfirmationButtons;
