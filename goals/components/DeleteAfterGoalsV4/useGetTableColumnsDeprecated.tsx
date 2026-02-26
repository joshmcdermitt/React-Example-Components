import { css } from '@emotion/react';
import { styled } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';
import { useMemo } from 'react';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { palette } from '~Common/styles/colors';
import { withoutDesktopObject } from '~Common/styles/mixins';
import JoshDueDate from '~Common/V3/components/JoshDueDate';
import GoalMeasurementValue from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/GoalMeasurementValue';
import GoalStatusText from '~Goals/components/Shared/GoalStatus/GoalStatusText';
import GoalTargetValueMessage from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/GoalTargetValueMessageDeprecated';
import NameCell from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/NameCellDeprecated';
import { GoalRow } from '~Goals/const/types';
import { Goals } from '@josh-hr/types';

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
};

const StyledGoalTargetValueMessage = styled(GoalTargetValueMessage)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 400,
  lineHeight: theme.lineHeight.extraSmall,
}));

/**
 *
 * @deprecated Use goals/hooks/utils/useGetTableColumns instead
 */

const useGetTableColumns = (enableCascadingGoals: boolean): GridColDef<GoalRow>[] => {
  const isMobile = useIsMobileQuery();

  return useMemo<GridColDef<GoalRow>[]>(() => {
    const tableColumnHeaders: GridColDef<GoalRow>[] = [
      {
        field: 'target',
        cellClassName: 'goalTarget',
        headerClassName: 'goalTargetHeader',
        sortable: false,
        headerName: 'Target',
        display: 'flex',
        flex: 2,
        minWidth: 143,
        maxWidth: 200,
        renderCell: (params: GridRenderCellParams<GoalRow>) => {
          const { progress } = params.row;

          const { measurementScale } = progress;

          return (
            <StyledGoalTargetValueMessage
              measurementScale={measurementScale}
              isWrapping
            />
          );
        },
      },
      {
        field: 'progress',
        cellClassName: 'goalProgress',
        headerClassName: 'goalProgressHeader',
        sortable: false,
        headerName: 'Status',
        display: 'flex',
        flex: 1,
        minWidth: 120,
        renderCell: (params: GridRenderCellParams<GoalRow>) => {
          const { progress } = params.row;

          return (
            <div css={styles.progressWrapper} data-test-id="goalsTableProgress">
              <GoalMeasurementValue
                status={progress.status}
                completionPercentage={progress.percentage}
                isAchieved={progress.isAchieved}
                measurementScale={progress.measurementScale}
                hideAboveBelowUnitLabel={progress.measurementScale.measurementUnitType.ownership?.id !== Goals.MeasurementUnitOwnershipId.System}
              />
              <GoalStatusText
                status={progress.status}
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
        maxWidth: 120,
        flex: 1,
        minWidth: 106,
        display: 'flex',
        renderCell: (params: GridRenderCellParams<GoalRow>) => (
          <JoshDueDate
            css={styles.joshDueDate}
            dueDate={params.row.endDate}
            showIcon={false}
          />
        ),
      },
      {
        field: 'priority',
        cellClassName: 'goalPriority',
        headerClassName: 'goalPriorityHeader',
        headerName: 'Priority',
        flex: 1,
        minWidth: 95,
        maxWidth: 125,
      },
      {
        field: 'role',
        cellClassName: 'goalMyRole',
        headerClassName: 'goalMyRoleHeader',
        sortable: false,
        headerName: 'MyRole',
        flex: 1,
        minWidth: 71,
        maxWidth: 150,
      },
      {
        field: 'owner',
        cellClassName: 'goalOwner',
        headerClassName: 'goalOwnerHeader',
        sortable: false,
        headerName: 'Owner',
        maxWidth: 62,
        display: 'flex',
        renderCell: (params: GridRenderCellParams<GoalRow>) => {
          const { owner } = params.row;

          return (
            <BaseAvatar
              data-test-id="goalsTableOwnerAvatar"
              orgUserId={owner.orgUserId}
              avatarSize={30}
            />
          );
        },
      },
    ];

    if (!enableCascadingGoals) {
      tableColumnHeaders.unshift({
        field: 'title',
        cellClassName: 'goalName',
        headerName: 'Name',
        flex: isMobile ? 2 : 3,
        display: 'flex',
        minWidth: 140,
        renderCell: (params: GridRenderCellParams<GoalRow>) => {
          const {
            title,
            isPrivate,
            subText,
            progress,
            contextType,
            contextName,
          } = params.row;

          return (
            <NameCell
              title={title}
              isPrivate={isPrivate}
              subText={subText}
              percentage={progress.percentage}
              status={progress.status}
              totalChildGoals={0}
              contextType={contextType}
              contextName={contextName}
              measurementScale={progress.measurementScale}
              isAchieved={progress.isAchieved}
            />
          );
        },
      });
    }

    return tableColumnHeaders;
  }, [enableCascadingGoals, isMobile]);
};

export default useGetTableColumns;
