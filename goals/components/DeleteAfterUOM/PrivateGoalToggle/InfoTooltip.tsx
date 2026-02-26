import { css } from '@emotion/react';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import Tooltip from '~Common/components/Tooltip';
import { palette } from '~Common/styles/colors';
import GoalPermissionsLearnMore from '~Goals/components/Shared/GoalPermissionsLearnMore';
import useGetPrivateGoalTooltipText from '~Goals/hooks/utils/useGetPrivateGoalTooltipText';

const styles = {
  tooltipText: css({
    marginRight: '0.25rem',
  }),
  infoIcon: css({
    color: palette.neutrals.gray400,
  }),
};

interface ViewProps {
  privateGoalTooltip: JSX.Element,
}

const View = ({
  privateGoalTooltip,
  ...props
}: ViewProps): JSX.Element => (
  <Tooltip content={privateGoalTooltip}>
    <div css={styles.infoIcon} {...props}>
      <FontAwesomeIcon
        icon={faInfoCircle}
      />
    </div>
  </Tooltip>
);

interface InfoTooltipProps {
  selectedGoalType: string,
}

const InfoTooltip = ({
  selectedGoalType,
  ...props
}: InfoTooltipProps): JSX.Element => {
  const { tooltipText } = useGetPrivateGoalTooltipText();

  const privateGoalTooltip = useMemo(() => {
    let text = '';

    if (selectedGoalType in tooltipText) {
      text = tooltipText[selectedGoalType as keyof typeof tooltipText];
    }

    return (
      <>
        <span css={styles.tooltipText}>
          {text}
        </span>
        <GoalPermissionsLearnMore textButtonColor={palette.neutrals.white} />
      </>
    );
  }, [selectedGoalType, tooltipText]);

  const hookProps = {
    privateGoalTooltip,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default InfoTooltip;
