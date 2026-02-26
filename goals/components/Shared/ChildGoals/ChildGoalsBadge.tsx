import { css } from '@emotion/react';
import JoshBadge from '~Common/V4/JoshBadge';
import { palette } from '~Common/styles/colorsRedesign';
import { TEAM_MEMBERS_STYLES } from '~TeamHub/styles';
import LeftIconSvg from '~Common/V4/JoshBadge/LeftIconSvg';
import { JoshBadgeClasses } from '~Common/V4/JoshBadge/styles';
import LayersTwoIcon from '~Assets/icons/components/LayersTwoIcon';
import { colors } from '~Common/styles/colors';

const styles = {
  ...TEAM_MEMBERS_STYLES,
  customBadge: css({
    padding: '.125rem .375rem .125rem .25rem',
    color: colors.coolGray[550],
    borderColor: palette.border.primary,
    background: palette.background.primary.default,
    [JoshBadgeClasses.leftIcon]: {
      color: palette.text.secondary.default,
    },
  }),
};

interface ChildGoalsBadgeProps {
  goalsCount: number;
}

const ChildGoalsBadge = ({ goalsCount }: ChildGoalsBadgeProps): JSX.Element => (
  <JoshBadge
    css={[styles.badge, styles.customBadge]}
    color="unknown"
    variant="roundedIcon"
  >
    <LeftIconSvg icon={LayersTwoIcon} style={{ fontSize: 'inherit' }} />
    <span>{goalsCount}</span>
  </JoshBadge>
);

export default ChildGoalsBadge;
