import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { TableHead } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import LoadingTableHeader from './LoadingTableHeader';
import LoadingTableRows from './LoadingTableRows';

const styles = {
  tableContainer: css({
    boxShadow: 'none !important',
    borderRadius: '0 !important',
  }),
  loaderTable: css({
    'tr.MuiTableCell-root:first-of-type': {
      width: '70% !important',
    },
    'thead .MuiTableCell-root': {
      padding: '0.5rem 1rem',
    },
  }),
};

interface TableLoaderProps {
  numberOfRows: number;
  activeTab: Goals.GoalContextType,
}

const TableLoader = ({
  activeTab,
  numberOfRows,
}: TableLoaderProps): JSX.Element => (
  <TableContainer
    sx={{
      boxShadow: 'none !important',
      borderRadius: '0 !important',
    }}
    component={Paper}
  >
    <Table css={styles.loaderTable}>
      <TableHead>
        <LoadingTableHeader activeTab={activeTab} />
      </TableHead>
      <TableBody>
        <LoadingTableRows numberOfRows={numberOfRows} />
      </TableBody>
    </Table>
  </TableContainer>
);

export default TableLoader;
