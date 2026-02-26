import { css } from '@emotion/react';
import { faEllipsisVertical } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  MouseEvent,
  RefObject,
  useRef,
  useState,
} from 'react';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { LinkedGoalType } from '~Goals/const/types';
import { palette } from '~Common/styles/colors';
import Menu from './Menu';

const styles = {
  menuButton: css({}),
  joshButton: css({
    paddingLeft: '.4375rem',
    paddingRight: '.4375rem',
  }),
};

interface ViewProps {
  handleOpenMenuClick: (event: MouseEvent<HTMLElement>) => void,
  handleCloseMenuClick: (event: MouseEvent<HTMLElement>) => void,
  menuButtonRef: RefObject<HTMLButtonElement>,
  isMenuOpen: boolean,
  linkedGoalType: LinkedGoalType,
  handleUnlink: () => void,
  disabled: boolean,
}

const View = ({
  handleOpenMenuClick,
  handleCloseMenuClick,
  menuButtonRef,
  isMenuOpen,
  linkedGoalType,
  handleUnlink,
  disabled,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.menuButton}
    {...props}
  >
    <JoshButton
      css={styles.joshButton}
      onClick={handleOpenMenuClick}
      variant="icon"
      size="small"
      textButtonColor={palette.neutrals.gray700}
      ref={menuButtonRef}
      disabled={disabled}
      data-test-id="goalsLinkedGoalCardMenu"
    >
      <FontAwesomeIcon icon={faEllipsisVertical} />
    </JoshButton>
    <Menu
      anchorEl={menuButtonRef.current}
      isMenuOpen={isMenuOpen}
      handleCloseMenuClick={handleCloseMenuClick}
      linkedGoalType={linkedGoalType}
      handleUnlink={handleUnlink}
    />
  </div>
);

type MenuButtonProps = Pick<ViewProps, 'linkedGoalType' | 'handleUnlink' | 'disabled'>;

const MenuButton = ({ ...props }: MenuButtonProps): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleOpenMenuClick = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    event.preventDefault();
    setIsMenuOpen(true);
  };

  const handleCloseMenuClick = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    event.preventDefault();
    setIsMenuOpen(false);
  };

  const hookProps = {
    handleOpenMenuClick,
    handleCloseMenuClick,
    isMenuOpen,
    menuButtonRef,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default MenuButton;
