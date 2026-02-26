import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { palette } from '~Common/styles/colors';
import { forMobileObject, withTruncate } from '~Common/styles/mixins';
import TooltipOnTruncate from '~Common/V3/components/TooltipOnTruncate';
import { GOAL_DETAIL_STYLES } from '~Goals/const/styles';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import withLoadingSkeleton from '~Common/components/withLoadingSkeleton';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import { GetGoalByIdReturn } from '~Goals/hooks/useGetGoalById';
import { getFormattedDate } from '~Common/utils/getFormattedDate';
import { GoalDescription } from './GoalDescription';
import GoalTargetValueMessage from '../DeleteAfterGoalsV4/ResolveDependencies/GoalTargetValueMessageDeprecated';

const styles = {
  ...GOAL_DETAIL_STYLES,
  details: css({
    fontSize: '.875rem',
    fontWeight: 500,
    color: palette.neutrals.gray700,
    maxWidth: '18.75rem',
    lineHeight: 1,
  }, withTruncate()),
  priorityTeamWrap: css({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  }, forMobileObject({
    gridTemplateColumns: '1fr',
  })),
  goalDetailsWrap: css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: '1rem',
  }),
  teamContainer: css({
    overflow: 'hidden',
  }),
  goalTeamClamp: css({
    color: palette.neutrals.gray700,
    fontSize: '.875rem',
    fontWeight: 500,
  }),
  externalLink: css({
    color: palette.brand.indigo,
    display: 'inline-block',
  }),
  skeleton: css({
    minWidth: '100%',
    height: '12.5rem',
  }),
};

const CategoryValue = ({ label, value }: { label: string, value: string | JSX.Element }): JSX.Element => (
  <div>
    <span css={styles.subHeading}>
      {label}
    </span>
    <span css={styles.details}>
      {value}
    </span>
  </div>
);

interface ViewProps {
  timePeriod: string,
  externalLink: string | undefined,
  priority: string | undefined,
  team: string | undefined,
  goalTypeLabel: string,
  description: string | undefined,
  objectivesUnitOfMeasure: boolean,
  isDrawer?: boolean,
  goal: Goals.Goal,
}

const View = ({
  timePeriod,
  externalLink,
  priority,
  team,
  goalTypeLabel,
  description,
  objectivesUnitOfMeasure,
  isDrawer = false,
  goal,
}: ViewProps): JSX.Element => (
  <div
    css={styles.goalDetailsWrap}
  >
    {objectivesUnitOfMeasure && !isDrawer
      && (
        <CategoryValue
          label="Target"
          value={<GoalTargetValueMessage measurementScale={goal.measurementScale} />}
        />
      )}
    {description && <GoalDescription text={description} />}
    <div css={styles.priorityTeamWrap}>
      {priority && <CategoryValue label="Priority" value={priority} />}
      {team && (
        <div css={styles.teamContainer}>
          <span css={styles.subHeading}>Team</span>
          <TooltipOnTruncate
            css={styles.goalTeamClamp}
            text={team}
          />
        </div>
      )}
      {!team && <CategoryValue label="Scope" value={goalTypeLabel} />}
    </div>
    <CategoryValue label="Time Period" value={timePeriod} />
    {externalLink && (
      <div>
        <span css={styles.subHeading}>External Link</span>
        <a css={[styles.details, styles.externalLink]} target="_blank" href={externalLink} rel="noreferrer">
          {externalLink}
        </a>
      </div>
    )}
  </div>
);

const GoalDetailSkeleton = (): JSX.Element => (
  <SkeletonLoader css={styles.skeleton} renderComponent={() => <></>} />
);

interface GoalDetailsProps {
  data: GetGoalByIdReturn,
  isDrawer: boolean,
}

const GoalDetails = ({
  data: goal,
  isDrawer,
}: GoalDetailsProps): JSX.Element => {
  const { featureNamesText } = useGetFeatureNamesText();
  const objectivesUnitOfMeasure = useFeatureFlag('objectivesUnitOfMeasure');

  const { date: startDate } = getFormattedDate({ date: new Date(goal?.startTimeInMillis ?? 0) });
  const { date: endDate } = getFormattedDate({ date: new Date(goal?.endTimeInMillis ?? 0) });

  const timePeriod = `${startDate} - ${endDate}`;
  const link = /^https?:\/\/(.*)/.test(goal.externalLink ?? '') ? goal.externalLink : `https://${goal?.externalLink ?? ''}`;
  const externalLink = goal.externalLink ? link : undefined;
  const priority = goal.priority ? Goals.GoalPriority[goal?.priority] : undefined;
  const team = goal.context?.contextName;
  const goalType = goal.context?.contextType;
  const goalTypeLabel = goalType === Goals.GoalContextType.Organization
    ? `Organization ${featureNamesText.goals.singular}` : `Personal ${featureNamesText.goals.singular}`;

  const { description } = goal;

  const hookProps = {
    timePeriod,
    externalLink,
    priority,
    team,
    goalTypeLabel,
    description,
    objectivesUnitOfMeasure,
    isDrawer,
    goal,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export default withLoadingSkeleton<GetGoalByIdReturn, GoalDetailsProps>(GoalDetails, GoalDetailSkeleton);
