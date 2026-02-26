import { Goals } from '@josh-hr/types';
import {
  DataGridProProps,
  GridCellParams,
  GridColumnVisibilityModel,
  GridEventListener,
  GridRenderCellParams,
  GridSortModel,
} from '@mui/x-data-grid-pro';
import { css } from '@emotion/react';
import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useIsDesktopQuery, useIsMobileQuery } from '~Common/hooks/useMediaListener';
import StyledGoalsTable from '~Goals/components/Shared/Tables/StyledGoalsTable';
import {
  BackInformation,
  CascadingGoalRow, CascadingGoalRowV4, GoalRowV4,
} from '~Goals/const/types';
import EmptyState from '~Goals/components/Tables/GoalsTable/EmptyState';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import useGetTableColumns from '~Goals/hooks/utils/useGetTableColumns';
import useGetTableRows from '~Goals/hooks/utils/useGetTableRows';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { GOALS_TABLE_STYLES } from '~Goals/const/styles';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { colors } from '~Common/styles/colors';
import { LinearProgress } from '@mui/material';
import CustomTreeCell from './CustomTreeCell';
import { TableLoader } from './TableLoader';

const styles = {
  ...GOALS_TABLE_STYLES,
  headerNameContainer: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: '1.75rem',
    gap: '.25rem',
    fontSize: '.75rem',
    color: colors.coolGray[550],
    fontWeight: 600,
  }),
  headerNameIcon: css({
    width: '1.25rem',
  }),
};

export const goalSortColumnField: Record<string, Goals.GetGoalsSortByV4> = {
  dueDate: Goals.GetGoalsSortByV4.DueDate,
  priority: Goals.GetGoalsSortByV4.Priority,
  title: Goals.GetGoalsSortByV4.Title,
  ownerName: Goals.GetGoalsSortByV4.OwnerName,
  status: Goals.GetGoalsSortByV4.Status,
};

interface ViewProps extends DataGridProProps<GoalRowV4 | CascadingGoalRowV4> {
  additionalTableConfigCascading: Partial<DataGridProProps<GoalRowV4 | CascadingGoalRowV4>>,
  columnVisibilityModel: GridColumnVisibilityModel,
  enableCascadingGoals: boolean,
  handleCellClickEvent: GridEventListener<'cellClick'>,
  isDesktop: boolean,
  isFetching: boolean,
  isCascadingFetching: boolean,
  isLoadingData: boolean,
  onSortModelChange: (sortModel: GridSortModel) => void,
  rows: GoalRowV4[] | CascadingGoalRowV4[],
  sortByField: Goals.GetGoalsSortByV4,
  sortByOrder: Goals.GetGoalsSortOrder,
}

const View = ({
  additionalTableConfigCascading,
  columns,
  columnVisibilityModel,
  enableCascadingGoals,
  handleCellClickEvent,
  isDesktop,
  isFetching,
  isCascadingFetching,
  isLoadingData,
  onSortModelChange,
  rows,
  sortByField,
  sortByOrder,
}: ViewProps): JSX.Element => (
  <>
    {isLoadingData && (
      <TableLoader
        rowsNum={10}
        isDesktop={isDesktop}
      />
    )}
    {rows.length > 0 && (
    <StyledGoalsTable
      columnVisibilityModel={columnVisibilityModel}
      columns={columns}
      rows={rows}
      onSortModelChange={onSortModelChange}
      loading={isFetching || isCascadingFetching}
      sortingOrder={['asc', 'desc']}
      disableColumnFilter
      disableColumnMenu
      disableColumnReorder
      disableColumnResize
      disableColumnSelector
      sx={{
        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-columnHeader:focus-within': {
          outline: 'none !important',
        },
      }}
      slots={{
        noRowsOverlay: () => <></>,
        noResultsOverlay: () => <></>,
        loadingOverlay: () => <LinearProgress />,
      }}
      sortingMode="server"
      onCellClick={handleCellClickEvent}
      sortModel={[{
        field: goalSortColumnField[sortByField],
        sort: sortByOrder,
      }]}
      {...(enableCascadingGoals ? additionalTableConfigCascading : {})}
      css={styles.goalsTable(isDesktop)}
    />
    )}
    {rows.length === 0 && !isLoadingData && <EmptyState />}
  </>
);

interface GoalsTableProps {
  onSortModelChange: (sortModel: GridSortModel) => void,
}

const GoalsTable = ({
  onSortModelChange,
  ...props
}: GoalsTableProps): JSX.Element => {
  const isMobile = useIsMobileQuery();
  const {
    goalsCascading: dataCascading,
    goals: data,
    enableCascadingGoals,
    sortByField,
    sortByOrder,
    isFetching,
    isLoading,
    isCascadingFetching,
  } = useGoalsContext();
  const isDesktop = useIsDesktopQuery();
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const history = useHistory();
  const { state: locationState = {} } = useLocation();
  const { backInformation } = (locationState as { backInformation: BackInformation }) || {};

  const tableColumns = useGetTableColumns(enableCascadingGoals, backInformation);
  const tableRows = useGetTableRows({
    enableCascadingGoals,
    data: enableCascadingGoals ? dataCascading : data,
  });

  const columnVisibilityModel: GridColumnVisibilityModel = useMemo(() => ({
    progress: true,
    dueDate: isDesktop,
    target: isDesktop,
    priority: isDesktop,
    role: isDesktop,
    owner: true,
    scope: isDesktop,
  }), [isDesktop]);

  const handleCellClickEvent: GridEventListener<'cellClick'> = useCallback((params: GridCellParams<GoalRowV4 | CascadingGoalRowV4>) => {
    if (params.field !== 'menu') {
      // Strip the row index suffix (e.g., "_0", "_1") from the ID to get the original goal ID
      const idString = String(params.id);
      const parts = idString.split('_');
      const goalId = parts.length > 1 ? parts.slice(0, -1).join('_') : idString;
      history.push(goalRoutes.ViewById.replace(':goalId', goalId));
    }
  }, [goalRoutes.ViewById, history]);

  const [isLoadingData] = useSkeletonLoaders(isLoading);

  const additionalTableConfigCascading: Partial<DataGridProProps> = {
    getTreeDataPath: (row: CascadingGoalRow) => row.path,
    treeData: true,
    groupingColDef: {
      headerName: `${featureNamesText.goals.singular} Name`,
      flex: isMobile ? 2 : 3,
      minWidth: 140,
      // maxWidth: 350,
      renderCell: (params: GridRenderCellParams<GoalRowV4>) => (
        <CustomTreeCell
          showProgressBar={false}
          {...params}
        />
      ),
      renderHeader: () => (
        <div css={styles.headerNameContainer}>
          {`${featureNamesText.goals.singular} Name`}
        </div>
      ),
      cellClassName: 'joshGridTitleCell',
      display: 'flex',
    },
  };

  const hookProps = {
    rows: tableRows,
    columns: tableColumns,
    onSortModelChange,
    sortByField,
    sortByOrder,
    isFetching,
    isCascadingFetching,
    columnVisibilityModel,
    enableCascadingGoals,
    handleCellClickEvent,
    isLoadingData,
    additionalTableConfigCascading,
    isDesktop,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default GoalsTable;
