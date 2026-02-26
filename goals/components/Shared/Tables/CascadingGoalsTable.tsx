import { DataGridProProps, GridRowParams } from '@mui/x-data-grid-pro';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import CustomTreeCell from '../../DeleteAfterGoalsV4/ResolveDependencies/CustomTreeCellDeprecated';
import StyledGoalsTable from '../../DeleteAfterGoalsV4/ResolveDependencies/StyledGoalsTable';

interface ViewProps extends DataGridProProps {
  onRowClick: (params: GridRowParams<{ id: string }>) => void,
}

const View = ({
  onRowClick,
  ...props
}: ViewProps): JSX.Element => (
  <StyledGoalsTable
    treeData
    headerHeight={44}
    groupingColDef={{
      headerName: 'Name',
      cellClassName: 'goalName',
      flex: 3,
      minWidth: 175,
      renderCell: CustomTreeCell,
      display: 'flex',
    }}
    disableColumnFilter
    disableColumnMenu
    sortingMode="server"
    onRowClick={onRowClick}
    {...props}
  />
);

type CascadingGoalsTableProps = Omit<ViewProps, 'onRowClick'>;

const CascadingGoalsTable = ({ ...props }: CascadingGoalsTableProps): JSX.Element => {
  const history = useHistory();
  const { goalRoutes } = useGetGoalRoutes();

  const onRowClick = useCallback((params: GridRowParams<{ id: string }>) => {
    history.push(goalRoutes.ViewById.replace(':goalId', params.id as string));
  }, [goalRoutes.ViewById, history]);

  const hookProps = {
    onRowClick,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default CascadingGoalsTable;
