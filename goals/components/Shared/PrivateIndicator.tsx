import { css, SerializedStyles } from '@emotion/react';
import { faLock } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import Tooltip from '~Common/components/Tooltip';

import { palette } from '~Common/styles/colors';
import { TooltipText } from '~Goals/const/toolTips';

const styles = {
  lockIcon: css({
    color: palette.neutrals.gray700,
    fontSize: '.9375rem',
  }),
};

interface ViewProps {
  iconProps?: Omit<FontAwesomeIconProps, 'icon'>,
  tooltipStyle?: SerializedStyles,
}

const View = ({ iconProps, tooltipStyle, ...props }: ViewProps): JSX.Element => (
  <Tooltip content={TooltipText.PrivateGoal} css={tooltipStyle}>
    <span {...props}>
      <FontAwesomeIcon
        css={styles.lockIcon}
        icon={faLock}
        {...iconProps}
      />
    </span>
  </Tooltip>
);

type PrivateIndicatorProps = Pick<ViewProps, 'iconProps' | 'tooltipStyle'>

const PrivateIndicator = ({ ...props }: PrivateIndicatorProps): JSX.Element => (
  <View
    {...props}
  />
);

export { View };
export default PrivateIndicator;
