import { css } from '@emotion/react';
import LayersThreeIcon from '~Assets/icons/components/LayersThreeIcon';
import Tooltip from '~Common/components/Tooltip';
import { palette } from '~Common/styles/colorsRedesign';
import { childGoalsIconTooltipText } from '~Goals/const/toolTips';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';

const styles = {
  childGoalCount: css({
    display: 'flex',
    alignItems: 'center',
    color: palette.text.secondary.default,
    gap: '2px',
  }),
  icon: css({
    width: '1rem',
    height: '1rem',
    color: palette.foreground.secondary.default,
    marginTop: '-.25rem',
  }),
  tooltip: css({
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '.5rem',
    whiteSpace: 'nowrap',
    flexWrap: 'nowrap',
  }),
};

interface ChildGoalCountProps {
  totalChildGoals: number,
}

const ChildGoalCount = ({
  totalChildGoals,
  ...props
}: ChildGoalCountProps): JSX.Element => {
  const { featureNamesText } = useGetFeatureNamesText();

  return (
    <div
      css={styles.childGoalCount}
      {...props}
    >
      <span>{totalChildGoals}</span>
      <Tooltip content={childGoalsIconTooltipText(totalChildGoals, featureNamesText)} css={styles.tooltip}>
        <div>
          <LayersThreeIcon
            css={styles.icon}
          />
        </div>
      </Tooltip>
    </div>
  );
};

export default ChildGoalCount;
