import { css } from '@emotion/react';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import { Goals } from '@josh-hr/types';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import Tooltip from '~Common/components/Tooltip';
import { palette } from '~Common/styles/colors';
import { LinkedGoalType } from '~Goals/const/types';
import { useShowLinkGoalModal } from '~Goals/hooks/utils/useShowLinkGoalModal';
import LinkedGoalCard from '~Goals/components/GoalDetails/LinkedGoals/LinkedGoalCard';
import { useLinkGoalWithExistingGoalLinks } from '~Goals/hooks/utils/useLinkGoalWithExistingGoalLinks';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import HiddenLinkedGoalsCard from './HiddenLinkedGoalsCard';

const styles = {
  supportingGoals: css({
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    gridColumn: '1/5',
  }),
  titleContainer: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gridColumn: '1/5',
  }),
  supportingGoalsText: css({
    color: palette.neutrals.gray700,
    fontSize: '0.75rem',
  }),
  supportingGoalsContainer: css({
    display: 'grid',
    gridTemplateColumns: 'subgrid',
    gridColumn: '1/5',
    gap: '1rem',
  }),
  connectSupportingGoal: css({
    fontSize: '0.75rem',
  }),
};

interface ViewProps {
  handleConnectSupportingGoal: () => void,
  visibleSupportingGoals: Goals.LinkedGoal[],
  canLinkGoal: boolean,
  handleUnlink: (childGoalId: string) => void,
  supportingGoalsCount: number,
  hiddenSupportingGoalsCount: number,
  featureNamesText: FeatureNamesText,
  isDrawer?: boolean,
}

const View = ({
  visibleSupportingGoals,
  handleConnectSupportingGoal,
  canLinkGoal,
  handleUnlink,
  supportingGoalsCount,
  hiddenSupportingGoalsCount,
  isDrawer,
  featureNamesText,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.supportingGoals}
    {...props}
  >
    <div css={styles.titleContainer}>
      <div css={styles.supportingGoalsText}>
        {`Supporting ${featureNamesText.goals.plural} [${supportingGoalsCount || '0'}]`}
      </div>
      {!!supportingGoalsCount && (
        <JoshButton
          css={styles.connectSupportingGoal}
          variant="text"
          data-test-id="goalsInlineConnectSupportingGoal"
          onClick={handleConnectSupportingGoal}
          disabled={!canLinkGoal}
        >
          <JoshButton.IconAndText icon={faPlus} text={`Connect ${featureNamesText.goals.singular}`} />
        </JoshButton>
      )}
    </div>
    <div css={styles.supportingGoalsContainer}>
      {visibleSupportingGoals?.map((goal) => (
        <LinkedGoalCard
          key={goal.goalId}
          goal={goal}
          linkedGoalType={LinkedGoalType.Supporting}
          handleUnlink={() => handleUnlink(goal.goalId)}
          canLinkGoal={canLinkGoal}
          manualGrid
          isDrawer={isDrawer}
        />
      ))}
      {hiddenSupportingGoalsCount > 0 && (
        <HiddenLinkedGoalsCard hiddenGoalsCount={hiddenSupportingGoalsCount} />
      )}
    </div>
    {!supportingGoalsCount && (
      <Tooltip content={canLinkGoal ? '' : `You do not have permission to connect a ${featureNamesText.goals.singular.toLowerCase()}.`}>
        <div>
          <JoshButton
            size="mini"
            variant="ghost"
            data-test-id="goalsConnectSupportingGoal"
            onClick={handleConnectSupportingGoal}
            disabled={!canLinkGoal}
          >
            <JoshButton.IconAndText icon={faPlus} text={`Connect Supporting ${featureNamesText.goals.singular}`} />
          </JoshButton>
        </div>
      </Tooltip>
    )}
  </div>
);

interface SupportingGoalsProps extends Pick<ViewProps, | 'canLinkGoal' | 'isDrawer'> {
  goalId: string,
  supportingGoals: Goals.LinkedGoal[] | undefined,
}

const SupportingGoals = ({
  goalId,
  supportingGoals,
  ...props
}: SupportingGoalsProps): JSX.Element => {
  const { openModal } = useShowLinkGoalModal();
  const { unlinkSupportingGoals } = useLinkGoalWithExistingGoalLinks({ goalId });
  const { featureNamesText } = useGetFeatureNamesText();

  const handleUnlink = (childGoalId: string): void => {
    unlinkSupportingGoals([childGoalId]);
  };

  const handleConnectSupportingGoal = (): void => {
    openModal({
      props: {
        linkedGoalType: LinkedGoalType.Supporting,
      },
    });
  };

  const { visibleSupportingGoals = [], hiddenSupportingGoals = [] } = supportingGoals?.reduce((acc: {
    visibleSupportingGoals: Goals.LinkedGoal[],
    hiddenSupportingGoals: Goals.LinkedGoal[],
  }, goal) => {
    if (goal.permissions?.includes(Goals.GoalPermission.CanViewGoal)) {
      acc.visibleSupportingGoals.push(goal);
    } else {
      acc.hiddenSupportingGoals.push(goal);
    }
    return acc;
  }, {
    visibleSupportingGoals: [],
    hiddenSupportingGoals: [],
  }) || {};

  const hookProps = {
    handleConnectSupportingGoal,
    handleUnlink,
    visibleSupportingGoals,
    supportingGoalsCount: supportingGoals?.length ?? 0,
    hiddenSupportingGoalsCount: hiddenSupportingGoals.length,
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
export default SupportingGoals;
