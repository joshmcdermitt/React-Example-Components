import { Goals } from '@josh-hr/types';
import {
  DataGridProProps,
  GridColumnVisibilityModel,
  GridRowParams,
  GridSortModel,
} from '@mui/x-data-grid-pro';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import StyledGoalsTable from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/StyledGoalsTable';
import { CascadingGoalRow, GoalRow } from '~Goals/const/types';
import { useEnableCascadingGoals } from '~Goals/hooks/utils/useEnableCascadingGoals';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import useGetTableColumns from '~Goals/components/DeleteAfterGoalsV4/useGetTableColumnsDeprecated';
import useGetTableRows from '~Goals/components/DeleteAfterGoalsV4/useGetTableRowsDeprecated';
import CustomTreeCell from './ResolveDependencies/CustomTreeCellDeprecated';

export const goalSortColumnField: Record<string, Goals.GetGoalsSortBy> = {
  title: Goals.GetGoalsSortBy.Title,
  priority: Goals.GetGoalsSortBy.Priority,
  dueDate: Goals.GetGoalsSortBy.DueDate,
  createdDate: Goals.GetGoalsSortBy.CreatedDate,
};

interface ViewProps extends DataGridProProps<GoalRow | CascadingGoalRow> {
  sortByField: Goals.GetGoalsSortBy,
  sortByOrder: Goals.GetGoalsSortOrder,
  isFetching: boolean,
  columnVisibilityModel: GridColumnVisibilityModel,
  enableCascadingGoals: boolean,
}

const View = ({
  rows,
  columns,
  onSortModelChange,
  onRowClick,
  sortByField,
  sortByOrder,
  isFetching,
  columnVisibilityModel,
  enableCascadingGoals,
}: ViewProps): JSX.Element => (
  <>
    { /* REFACTOR: Doesn't need to be 2 tables for this, probably??? */}
    {enableCascadingGoals && (
      <StyledGoalsTable
        columnVisibilityModel={columnVisibilityModel}
        columns={columns}
        rows={rows}
        getTreeDataPath={(row: CascadingGoalRow) => row.path}
        onSortModelChange={onSortModelChange}
        loading={isFetching}
        sortingOrder={['asc', 'desc']}
        treeData
        groupingColDef={{
          headerName: 'Name',
          flex: 3,
          minWidth: 200,
          renderCell: CustomTreeCell,
          cellClassName: 'joshGridTitleCell',
          display: 'flex',
        }}
        disableColumnFilter
        disableColumnMenu
        sortingMode="server"
        onRowClick={onRowClick}
        sortModel={[
          {
            field: goalSortColumnField[sortByField],
            sort: sortByOrder,
          },
        ]}
      />
    )}
    {!enableCascadingGoals && (
      <StyledGoalsTable
        columnVisibilityModel={columnVisibilityModel}
        columns={columns}
        rows={rows}
        disableColumnFilter
        disableColumnMenu
        sortingMode="server"
        sortingOrder={['asc', 'desc']}
        onSortModelChange={onSortModelChange}
        onRowClick={onRowClick}
        loading={isFetching}
        sortModel={[
          {
            field: goalSortColumnField[sortByField],
            sort: sortByOrder,
          },
        ]}
      />
    )}
  </>
);

interface GoalsTableProps {
  data: Goals.Responses.GetGoalsResponse['data'],
  onSortModelChange: (sortModel: GridSortModel) => void,
  sortByField: Goals.GetGoalsSortBy,
  sortByOrder: Goals.GetGoalsSortOrder,
  isFetching: boolean,
}

const GoalsTable = ({
  data,
  onSortModelChange,
  sortByField,
  sortByOrder,
  isFetching,
  ...props
}: GoalsTableProps): JSX.Element => {
  const { userLevelEnableCascadingGoals, orgLevelEnableCascadingGoals } = useEnableCascadingGoals();
  const enableCascadingGoals = orgLevelEnableCascadingGoals && userLevelEnableCascadingGoals;
  const isMobile = useIsMobileQuery();
  const { goalRoutes } = useGetGoalRoutes();

  const columnVisibilityModel: GridColumnVisibilityModel = useMemo(() => ({
    progress: !isMobile,
    dueDate: true,
    target: !isMobile,
    priority: !isMobile,
    role: !isMobile,
    category: !isMobile,
    owner: !isMobile,
  }), [isMobile]);

  const tableColumns = useGetTableColumns(enableCascadingGoals);
  const tableRows = useGetTableRows({ enableCascadingGoals, data });

  const history = useHistory();

  const onRowClick = useCallback((params: GridRowParams<GoalRow>) => {
    history.push(goalRoutes.ViewById.replace(':goalId', params.id as string));
  }, [goalRoutes.ViewById, history]);

  const hookProps = {
    rows: tableRows,
    columns: tableColumns,
    onRowClick,
    onSortModelChange,
    sortByField,
    sortByOrder,
    isFetching,
    columnVisibilityModel,
    enableCascadingGoals,
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
