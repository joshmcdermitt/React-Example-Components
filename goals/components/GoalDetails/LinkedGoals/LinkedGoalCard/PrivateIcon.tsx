import { css } from '@emotion/react';
import { faLock } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { palette } from '~Common/styles/colors';

const styles = {
  privateIcon: css({
    width: '1.875rem',
    height: '1.875rem',
    borderRadius: '.375rem',
    backgroundColor: palette.neutrals.gray600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  icon: css({
    color: palette.neutrals.white,
  }),
};

const PrivateIcon = ({ ...props }): JSX.Element => (
  <div
    css={styles.privateIcon}
    {...props}
  >
    <FontAwesomeIcon css={styles.icon} icon={faLock} />
  </div>
);

export default PrivateIcon;
