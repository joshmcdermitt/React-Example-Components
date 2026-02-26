import { css } from '@emotion/react';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useMemo } from 'react';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { palette, colors } from '~Common/styles/colors';
import { withoutDesktopObject } from '~Common/styles/mixins';
import JoshDueDate from '~Common/V3/components/JoshDueDate';
import NameCell from '~Goals/components/Tables/GoalsTable/NameCell';
import { BackInformation, GoalRowV4 } from '~Goals/const/types';
import { Goals } from '@josh-hr/types';
import GoalTargetBadge from '~Goals/components/Shared/TargetValue/TargetBadge';
import GoalStatusCell from '~Goals/components/Tables/GoalsTable/GoalStatusCell';

import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { GoalActionMenu, IconDirection } from '~Goals/components/Tables/GoalsTable/GoalActionMenu';
import TooltipOnTruncate from '~Common/V3/components/TooltipOnTruncate';
import Tooltip from '~Common/components/Tooltip';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';

const styles = {
  progressWrapper: css({
    width: '100%',
  }),
  goalDates: css({
    whiteSpace: 'normal',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '.25rem',
  }, withoutDesktopObject({
    lineHeight: '1rem',
  })),
  joshDueDate: css({
    color: palette.neutrals.gray700,
  }),
  headerNameContainer: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: '1.75rem',
    gap: '.25rem',
    fontSize: '.75rem',
  }),

  headerNameIcon: css({
    width: '1.25rem',
    color: palette.neutrals.gray700,
  }),
  headerColumnName: css({
    color: colors.coolGray[550],
    fontSize: '0.75rem',
    fontWeight: 600,
  }),
  nameContainer: css({
    paddingLeft: '1.75rem',
  }),
  teamTooltip: css({
    fontSize: '.75rem',
    fontWeight: 600,
    borderRadius: '.5rem',
  }),
  toolTip: css({
    fontSize: '.75rem',
    fontWeight: 600,
  }),
};

const useGetTableColumns = (
  enableCascadingGoals: boolean,
  backInformation?: BackInformation,
): GridColDef<GoalRowV4>[] => {
  const { featureNamesText } = useGetFeatureNamesText();
  const isMobile = useIsMobileQuery();
  const {
    sortByField,
    sortByOrder,
  } = useGoalsContext();
  return useMemo<GridColDef<GoalRowV4>[]>(() => {
    const tableColumnHeaders: GridColDef<GoalRowV4>[] = [
      {
        field: 'target',
        cellClassName: 'goalTarget',
        headerClassName: 'goalTargetHeader',
        sortable: false,
        headerName: 'Target',
        display: 'flex',
        flex: 2,
        minWidth: 110,
        maxWidth: 185,
        renderCell: (params: GridRenderCellParams<GoalRowV4>) => {
          const { progress, goal } = params.row;
          return (
            <GoalTargetBadge
              progress={progress}
              targetDate={goal.endTimeInMillis}
              name={`goalTableTargetBadge-${goal.goalId}`}
              dataTestId="goalTableTargetBadge"
            />
          );
        },
      },
      {
        field: 'progress',
        cellClassName: 'goalProgress',
        headerClassName: 'goalProgressHeader',
        headerName: 'Status',
        display: 'flex',
        flex: 1,
        sortable: false,
        width: isMobile ? 200 : 170,
        minWidth: 224,
        renderCell: (params: GridRenderCellParams<GoalRowV4>) => {
          const { progress } = params.row;
          return (
            <div css={styles.progressWrapper} data-test-id="goalsTableProgress">
              <GoalStatusCell
                percentage={progress.percentage}
                status={progress.status}
                measurementScale={progress.measurementScale}
                isAchieved={progress.isAchieved}
                value={progress.value}
                statusUpdate={progress.statusUpdate}
                hideProgressCurrentValue
                hideProgressPercentage
              />
            </div>
          );
        },
      },
      {
        field: 'dueDate',
        headerName: 'Due Date',
        cellClassName: 'goalDueDate',
        headerClassName: 'goalDueDateHeader',
        flex: 1,
        minWidth: 130,
        display: 'flex',
        renderCell: (params: GridRenderCellParams<GoalRowV4>) => (
          <JoshDueDate
            css={styles.joshDueDate}
            dueDate={params.row.endDate}
            includeYear
            showIcon={false}
            formattingOverridesDueDate={{
              month: 'short',
            }}
          />
        ),
        renderHeader: () => {
          const isCurrentlySorted = sortByField === 'dueDate';
          const content = isCurrentlySorted && sortByOrder === 'asc'
            ? 'Sort by furthest due date'
            : 'Sort by nearest due date';
          return (
            <div>
              <Tooltip css={styles.toolTip} content={content}>
                <div css={styles.headerColumnName}>Due Date</div>
              </Tooltip>
            </div>
          );
        },
      },
      {
        field: 'priority',
        cellClassName: 'goalPriority',
        headerClassName: 'goalPriorityHeader',
        headerName: 'Priority',
        flex: 1,
        minWidth: 125,
        renderHeader: () => {
          const isCurrentlySorted = sortByField === 'priority';
          const content = isCurrentlySorted && sortByOrder === 'asc'
            ? 'Sort by highest priority'
            : 'Sort by lowest priority';
          return (
            <div>
              <Tooltip content={content} css={styles.toolTip}>
                <div css={styles.headerColumnName}>Priority</div>
              </Tooltip>
            </div>
          );
        },
      },
      {
        field: 'scope',
        cellClassName: 'goalScope',
        headerClassName: 'goalScopeHeader',
        headerName: 'Scope',
        flex: 1,
        minWidth: 150,
        maxWidth: 150,
        sortable: false,
        renderCell: (params: GridRenderCellParams<GoalRowV4>) => {
          const { contextName, contextType } = params.row;

          return (
            <>
              {contextType === Goals.GoalContextType.Team
                ? <TooltipOnTruncate data-test-id="goalsTableScopeTooltip" tooltipStyle={styles.teamTooltip} text={contextName ?? ''} />
                : contextType}
            </>
          );
        },
      },
      {
        field: 'owner',
        cellClassName: 'goalOwner',
        headerClassName: 'goalOwnerHeader',
        headerName: 'Owner',
        width: 92,
        display: 'flex',
        align: 'left',
        sortable: false,
        renderCell: (params: GridRenderCellParams<GoalRowV4>) => {
          const { owner } = params.row;
          return (
            <>
              <BaseAvatar
                data-test-id="goalsTableOwnerAvatar"
                orgUserId={owner?.orgUserId ?? null}
                avatarSize={32}
              />
            </>
          );
        },
      },
      {
        field: 'menu',
        cellClassName: 'goalMenu',
        headerClassName: 'goalMenuHeader',
        headerName: '',
        sortable: false,
        width: 50,
        renderCell: (params: GridRenderCellParams<GoalRowV4>) => {
          const { goal } = params.row;
          return (
            <GoalActionMenu
              goal={goal}
              backInformation={backInformation}
              buttonIconDirection={IconDirection.Horizontal}
              isGoalsDashboard
              isCascadingGoals={enableCascadingGoals}
            />
          );
        },
      },
    ];

    if (!enableCascadingGoals) {
      tableColumnHeaders.unshift({
        field: 'title',
        cellClassName: 'goalName',
        flex: isMobile ? 2 : 3,
        display: 'flex',
        minWidth: 140,
        renderHeader: () => (
          <div css={styles.headerNameContainer}>
            <div css={styles.headerColumnName}>{`${featureNamesText.goals.singular} Name`}</div>
          </div>
        ),
        renderCell: (params: GridRenderCellParams<GoalRowV4>) => {
          const {
            title,
            isPrivate,
            subText,
            contextType,
            contextName,
          } = params.row;

          return (
            <div css={styles.nameContainer}>
              <NameCell
                contextName={contextName}
                contextType={contextType}
                isPrivate={isPrivate}
                showGoalTypeIcon={false}
                subText={subText}
                title={title}
                totalChildGoals={0}
              />
            </div>
          );
        },
      });
    }

    return tableColumnHeaders;
  }, [
    isMobile,
    sortByField,
    sortByOrder,
    backInformation,
    enableCascadingGoals,
    featureNamesText.goals.singular,
  ]);
};

export default useGetTableColumns;
