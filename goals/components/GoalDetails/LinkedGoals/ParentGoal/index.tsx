import { css } from '@emotion/react';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import { Goals } from '@josh-hr/types';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import Tooltip from '~Common/components/Tooltip';
import { palette } from '~Common/styles/colors';
import { LinkedGoalType } from '~Goals/const/types';
import { useShowLinkGoalModal } from '~Goals/hooks/utils/useShowLinkGoalModal';
import { useLinkGoalWithExistingGoalLinks } from '~Goals/hooks/utils/useLinkGoalWithExistingGoalLinks';
import LinkedGoalCard from '~Goals/components/GoalDetails/LinkedGoals/LinkedGoalCard';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';

const styles = {
  parentGoal: css({
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    gridColumn: '1/5',
  }),
  parentGoalText: css({
    color: palette.neutrals.gray700,
    fontSize: '0.75rem',
    gridColumn: '1/5',
  }),
  linkedGoalCard: css({
    gap: '1rem',
  }),
};

interface ViewProps {
  parentGoal: Goals.LinkedGoal | undefined,
  handleConnectParentGoal: () => void,
  canLinkGoal: boolean,
  handleUnlink: () => void,
  featureNamesText: FeatureNamesText,
  isDrawer?: boolean,
}

const View = ({
  parentGoal,
  handleConnectParentGoal,
  canLinkGoal,
  handleUnlink,
  featureNamesText,
  isDrawer,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.parentGoal}
    {...props}
  >
    <div css={styles.parentGoalText}>{`Parent ${featureNamesText.goals.singular}`}</div>
    {parentGoal && (
      <LinkedGoalCard
        css={styles.linkedGoalCard}
        goal={parentGoal}
        linkedGoalType={LinkedGoalType.Parent}
        handleUnlink={handleUnlink}
        canLinkGoal={canLinkGoal}
        isDrawer={isDrawer}
        manualGrid
      />
    )}
    {!parentGoal && (
      <Tooltip content={canLinkGoal ? '' : `You do not have permission to connect a ${featureNamesText.goals.singular}.`}>
        <div>
          <JoshButton
            size="mini"
            variant="ghost"
            data-test-id="goalsConnectParentGoal"
            onClick={handleConnectParentGoal}
            disabled={!canLinkGoal}
          >
            <JoshButton.IconAndText icon={faPlus} text={`Connect Parent ${featureNamesText.goals.singular}`} />
          </JoshButton>
        </div>
      </Tooltip>
    )}
  </div>
);

interface ParentGoalProps extends Pick<ViewProps, 'parentGoal' | 'canLinkGoal' | 'isDrawer'> {
  goalId: string,
}

const ParentGoal = ({
  goalId,
  ...props
}: ParentGoalProps): JSX.Element => {
  const { openModal } = useShowLinkGoalModal();
  const { unlinkParentGoal } = useLinkGoalWithExistingGoalLinks({ goalId });
  const { featureNamesText } = useGetFeatureNamesText();

  const handleUnlink = (): void => {
    unlinkParentGoal();
  };

  const handleConnectParentGoal = (): void => {
    openModal({
      props: {
        linkedGoalType: LinkedGoalType.Parent,
      },
    });
  };

  const hookProps = {
    handleConnectParentGoal,
    handleUnlink,
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
export default ParentGoal;
