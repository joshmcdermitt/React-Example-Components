import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
// import { useHistory } from 'react-router-dom';
import { useCheckPageLocation } from '~Common/hooks/usePageLocation';
import { RouteName } from '~Common/const/routeName';
import { palette } from '~Common/styles/colors';
import TooltipOnTruncate from '~Common/V3/components/TooltipOnTruncate';
import ChildGoalCount from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/ChildGoalCountDeprecated';
import GoalMeasurementValue from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/GoalMeasurementValue';
import GoalStatusText from '~Goals/components/Shared/GoalStatus/GoalStatusText';
import GoalTypeIcon from '~Goals/components/Shared/GoalTypeIcon';
import PrivateIndicator from '~Goals/components/Shared/PrivateIndicator';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { AchievedNotToggleType } from '~Goals/const/types';

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
    gap: '.25rem',
    color: palette.neutrals.gray700,
    fontSize: '.8125rem',
  }),
  goalTitleWrapper: css({
    display: 'flex',
    alignItems: 'center',
    gap: '.25rem',
  }),
  goalTitle: (isViewingHome: boolean) => css({
    fontSize: isViewingHome ? '.8125rem' : '.875rem',
    fontWeight: isViewingHome ? 500 : 600,
    color: palette.neutrals.gray800,
  }),
  subText: (isViewingHome: boolean) => css({
    fontSize: isViewingHome ? '.75rem' : '.8125rem',
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
  title: string,
  status: Goals.GoalStatus,
  featureNamesText: FeatureNamesText,
  contextType: Goals.GoalContextType,
  showGoalTypeIcon?: boolean,
  contextName?: string,
  subText?: string,
  percentage: number,
  isPrivate?: boolean,
  totalChildGoals?: number,
  showProgressBar?: boolean,
  measurementScale: Goals.MeasurementScale,
  isViewingHome: boolean,
  isAchieved: AchievedNotToggleType | null,
}

const View = ({
  title,
  isPrivate,
  totalChildGoals = 0,
  subText,
  percentage,
  status,
  showProgressBar,
  contextType,
  contextName,
  showGoalTypeIcon = true,
  measurementScale,
  isViewingHome,
  isAchieved,
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
        <TooltipOnTruncate data-test-id="goalsTableTitle" css={styles.goalTitle(isViewingHome)} text={title} />
        {isPrivate && (
          <PrivateIndicator
            css={styles.isPrivate}
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
          {!!subText && (
            <TooltipOnTruncate data-test-id="goalsTableSubText" css={styles.subText(isViewingHome)} text={subText} />
          )}
        </div>
      )}
      {showProgressBar && (
        <div css={styles.progressInfoContainer}>
          <GoalMeasurementValue
            status={status}
            completionPercentage={percentage}
            isAchieved={isAchieved}
            measurementScale={measurementScale}
            hideAboveBelowUnitLabel={measurementScale.measurementUnitType.ownership?.id !== Goals.MeasurementUnitOwnershipId.System}
          />
          <GoalStatusText
            status={status}
          />
        </div>
      )}
    </div>
  </div>
);

type NameCellProps = Omit<ViewProps, 'featureNamesText' | 'isViewingHome'>

/**
 * @deprecated Use goals/components/Shared/NameCell instead
 */

const NameCell = ({ ...props }: NameCellProps): JSX.Element => {
  const { featureNamesText } = useGetFeatureNamesText();
  const isViewingHome = useCheckPageLocation([RouteName.Home]);

  const hookProps = {
    featureNamesText,
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
