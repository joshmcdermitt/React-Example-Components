import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { useCheckPageLocation } from '~Common/hooks/usePageLocation';
import { RouteName } from '~Common/const/routeName';
import { palette } from '~Common/styles/colors';
import TooltipOnTruncate from '~Common/V3/components/TooltipOnTruncate';
import ChildGoalCount from '~Goals/components/Shared/ChildGoals/ChildGoalCount';
import GoalTypeIcon from '~Goals/components/Shared/GoalTypeIcon';
import PrivateIndicator from '~Goals/components/Shared/PrivateIndicator';

const styles = {
  nameCell: css({
    display: 'flex',
    alignItems: 'center',
    gap: '.5rem',
    overflow: 'hidden',
    fontSize: '.875rem',
  }),
  contentsContainer: css({
    overflow: 'hidden',
    flex: 1,
  }),
  totalChildGoalsAndTeamNameContainer: css({
    display: 'flex',
    alignItems: 'center',
    gap: '.375rem',
    color: palette.neutrals.gray700,
    fontSize: '.8125rem',
  }),
  goalTitleWrapper: css({
    display: 'flex',
    alignItems: 'center',
    gap: '.25rem',
  }),
  goalTitle: css({
    fontSize: '.75rem',
    borderRadius: '.5rem',
    fontWeight: 600,
  }),
  subText: (isViewingHome: boolean) => css({
    fontSize: isViewingHome ? '.75rem' : '.875rem',
    fontWeight: 400,
    color: palette.neutrals.gray800,
  }),
  lockIcon: css({
    color: palette.neutrals.gray700,
    fontSize: '.625rem',
  }),
  goalDates: css({
    whiteSpace: 'normal',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '.25rem',
  }),
  isPrivate: css({
    fontSize: '.75rem',
    borderRadius: '.5rem',
    display: 'inline-block',
    marginLeft: '.5rem',
  }),
  goalTypeIcon: css({
    width: '.75rem',
    height: '.75rem',
  }),
  progressInfoContainer: css({
    display: 'flex',
    alignItems: 'center',
  }),
  childGoalCount: (isViewingHome: boolean) => css({
    fontSize: isViewingHome ? '.75rem' : '.8125rem',
  }),
};

interface ViewProps {
  contextName?: string,
  contextType: Goals.GoalContextType,
  isPrivate?: boolean,
  isViewingHome: boolean,
  showGoalTypeIcon?: boolean,
  subText?: string,
  title: string,
  totalChildGoals?: number,
}

const View = ({
  contextName,
  contextType,
  isPrivate,
  isViewingHome,
  showGoalTypeIcon = true,
  subText,
  title,
  totalChildGoals = 0,
  ...props
}: ViewProps): JSX.Element => (
  <div css={styles.nameCell} {...props}>
    {showGoalTypeIcon && (
      <GoalTypeIcon
        css={styles.goalTypeIcon}
        contextType={contextType}
        tooltipText={contextName}
      />
    )}
    <div css={styles.contentsContainer}>
      <div css={styles.goalTitleWrapper}>
        <TooltipOnTruncate data-test-id="goalsTableTitle" text={title} tooltipStyle={styles.goalTitle} />
        {isPrivate && (
          <PrivateIndicator
            tooltipStyle={styles.isPrivate}
            iconProps={{
              css: styles.lockIcon,
            }}
          />
        )}
      </div>
      {(totalChildGoals > 0 || !!subText) && (
        <div css={styles.totalChildGoalsAndTeamNameContainer}>
          {totalChildGoals > 0 && (
            <ChildGoalCount css={styles.childGoalCount(isViewingHome)} totalChildGoals={totalChildGoals} />
          )}
          {totalChildGoals > 0 && ' | '}
          {!!subText && (
            <TooltipOnTruncate data-test-id="goalsTableSubText" css={styles.subText(isViewingHome)} text={subText} />
          )}
        </div>
      )}
    </div>
  </div>
);

type NameCellProps = Omit<ViewProps, 'isViewingHome'>

const NameCell = ({ ...props }: NameCellProps): JSX.Element => {
  const isViewingHome = useCheckPageLocation([RouteName.Home]);

  const hookProps = {
    isViewingHome,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default NameCell;
