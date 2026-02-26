import { css } from '@emotion/react';
import { faLinkSlash, faSwap } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu as MUIMenu, MenuItem } from '@mui/material';
import { MouseEvent } from 'react';
import { palette } from '~Common/styles/colors';
import { LinkedGoalType } from '~Goals/const/types';
import { useShowLinkGoalModal } from '~Goals/hooks/utils/useShowLinkGoalModal';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

const styles = {
  menu: css({
    '.MuiList-root': {
      padding: 0,
    },
  }),
  menuItem: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: palette.neutrals.gray900,
    fontSize: '.875rem',
    fontWeight: 500,
  }),
  menuIcon: css({
    color: palette.brand.indigo,
    width: '.875rem',
    height: '.875rem',
    marginLeft: '.75rem',
  }),
  deleteIcon: css({
    color: palette.brand.red,
  }),
};

interface ViewProps {
  anchorEl: HTMLElement | null,
  isMenuOpen: boolean,
  handleCloseMenuClick: (event: MouseEvent<HTMLElement>) => void,
  handleUnlink: () => void,
  handleReplace: () => void,
  linkedGoalType: LinkedGoalType,
  featureNamesText: FeatureNamesText,
}

const View = ({
  anchorEl,
  isMenuOpen,
  handleCloseMenuClick,
  handleUnlink,
  handleReplace,
  linkedGoalType,
  featureNamesText,
  ...props
}: ViewProps): JSX.Element => (
  <MUIMenu
    anchorEl={anchorEl}
    open={isMenuOpen}
    onClose={handleCloseMenuClick}
    onClick={handleCloseMenuClick}
    css={styles.menu}
    {...props}
  >
    <MenuItem
      data-test-id="goalsMenuDisconnectGoal"
      css={styles.menuItem}
      onClick={handleUnlink}
    >
      <span>{`Disconnect ${featureNamesText.goals.singular}`}</span>
      <FontAwesomeIcon css={[styles.menuIcon, styles.deleteIcon]} icon={faLinkSlash} />
    </MenuItem>
    {linkedGoalType === LinkedGoalType.Parent && (
      <MenuItem
        css={styles.menuItem}
        data-test-id="meetingsMenuAddTopic"
        onClick={handleReplace}
      >
        <span>{`Replace ${featureNamesText.goals.singular}`}</span>
        <FontAwesomeIcon css={styles.menuIcon} icon={faSwap} />
      </MenuItem>
    )}
  </MUIMenu>
);

interface MenuProps extends Pick<ViewProps, 'anchorEl' | 'isMenuOpen' | 'handleCloseMenuClick' | 'handleUnlink'> {
  linkedGoalType: LinkedGoalType,
}

const Menu = ({
  linkedGoalType,
  ...props
}: MenuProps): JSX.Element => {
  const { openModal } = useShowLinkGoalModal();
  const { featureNamesText } = useGetFeatureNamesText();

  const handleReplace = (): void => {
    openModal({
      props: {
        linkedGoalType,
      },
    });
  };

  const hookProps = {
    handleReplace,
    linkedGoalType,
    featureNamesText,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default Menu;
