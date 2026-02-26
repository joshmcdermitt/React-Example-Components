import { ChangeEvent } from 'react';
import JoshSwitch from '~Common/V3/components/JoshSwitch';
import { css } from '@emotion/react';

const styles = {
  container: css({
    gap: '0.5rem',
  }),
  label: css({
    fontSize: '14px',
    fontWeight: '500',
  }),
};
interface CascadeViewToggleProps {
  handleCascadeViewChange: (event: ChangeEvent<HTMLInputElement>) => void,
  enableCascadingGoals: boolean,
  disabled?: boolean,
  showCheckedLabels?: boolean,
}

const CascadeViewToggle = ({
  handleCascadeViewChange,
  enableCascadingGoals,
  showCheckedLabels,
  disabled,
}: CascadeViewToggleProps): JSX.Element => (
  <JoshSwitch data-test-id="goalsTableToggleCascade">
    <JoshSwitch.Label
      label="Cascade View"
      labelPlacement="start"
      labelTextStyles={styles.label}
      css={styles.container}
    >
      <JoshSwitch.Switch
        onChange={handleCascadeViewChange}
        defaultChecked={enableCascadingGoals}
        disabled={disabled}
        showCheckedLabels={showCheckedLabels}
        size="small"
      />
    </JoshSwitch.Label>
  </JoshSwitch>
);

export default CascadeViewToggle;
