import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import withLoadingSkeleton from '~Common/components/withLoadingSkeleton';
import { palette } from '~Common/styles/colors';
import {
  forMobileObject, lineClamp,
} from '~Common/styles/mixins';
import TextSkeleton from '~Common/V3/components/Skeletons/TextSkeleton';
import TooltipOnTruncate from '~Common/V3/components/TooltipOnTruncate';
import { GoalActionMenu } from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/GoalActionMenuDeprecated';
import { BackInformation } from '~Goals/const/types';
import { GetGoalByIdReturn } from '~Goals/hooks/useGetGoalById';
import { GOAL_CATEGORY_TYPE_MAP } from '~Goals/hooks/utils/categoryTypes/useGetGoalCategoryTypes';
import PrivateIndicator from '../PrivateIndicator';

const styles = {
  header: (isDrawer: boolean) => css({
    gridColumn: '1 / 4',
    padding: '0.5rem 0 1rem 0',
    borderBottom: `1px solid ${palette.neutrals.gray300}`,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }, forMobileObject({
    gridColumn: '1',
  }), isDrawer && {
    gridColumn: '1',
    borderBottom: 0,
    marginBottom: 0,
    justifyContent: 'space-between',
  }),
  avatarTitleContainer: css({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    flexDirection: 'row',
  }),
  titleContainer: css({
    lineHeight: '1.2',
    overflow: 'hidden',

  }),
  title: css({
    color: palette.neutrals.gray800,
    fontSize: '1.125rem',
    fontWeight: 600,
  }, lineClamp(1)),
  titleFirstLine: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexDirection: 'row',
  }),
  categoryText: css({
    color: palette.neutrals.gray800,
    fontSize: '.75rem',
  }),
};

interface ViewProps {
  isDrawer: boolean,
  goal: Goals.Goal,
  owner: Goals.GoalParticipant,
  backInformation: BackInformation,
}

const View = ({
  isDrawer,
  goal,
  owner,
  backInformation,
  ...props
}: ViewProps): JSX.Element => (
  <div css={styles.header(isDrawer)} {...props}>
    <div css={styles.avatarTitleContainer}>
      <BaseAvatar
        orgUserId={owner?.orgUserId ?? null}
        avatarSize={30}
      />
      <div css={styles.titleContainer}>
        {/* TODO: Remove this silly implementation. We could not figure out why the tooltip was not working with the overflow stuff in the drawer */}
        <div css={styles.titleFirstLine}>
          {isDrawer && (
            <div css={styles.title} data-test-id="goalsTitle">{goal.title}</div>
          )}
          {!isDrawer && (
            <TooltipOnTruncate css={styles.title} data-test-id="goalsTitle" text={goal.title} />
          )}
          {goal?.isPrivate && (
            <PrivateIndicator />
          )}
        </div>
        <div css={styles.categoryText}>{GOAL_CATEGORY_TYPE_MAP[goal.category!]}</div>
      </div>
      {/* {goal?.isPrivate && (
        <PrivateIndicator />
      )} */}
    </div>
    <GoalActionMenu
      goal={goal}
      showExpandedActionMenu={isDrawer}
      backInformation={backInformation}
      isDrawer={isDrawer}
    />
  </div>
);

const HeaderSkeleton = (): JSX.Element => (
  <TextSkeleton css={styles.header(false)} />
);

interface HeaderProps extends Omit<ViewProps, 'goal' | 'owner'> {
  data: GetGoalByIdReturn,
}

const Header = ({ data: goal, ...props }: HeaderProps): JSX.Element => {
  const owner = useMemo(() => goal.participants.find((participant) => participant.role === Goals.GoalParticipantRole.Owner)!, [goal.participants]);

  const hookProps = {
    goal,
    owner,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { Header, View };
export default withLoadingSkeleton<GetGoalByIdReturn, HeaderProps>(Header, HeaderSkeleton);
