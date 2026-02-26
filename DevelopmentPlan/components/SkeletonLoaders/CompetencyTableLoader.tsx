import { css } from '@emotion/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Skeleton, TableHead } from '@mui/material';
import Paper from '@mui/material/Paper';
import { palette } from '~Common/styles/colors';

const styles = {
  tableContainer: css({
    boxShadow: 'none !important',
    borderRadius: '0 !important',
  }),
  loaderTable: css({
    'tr.MuiTableCell-root:first-child': {
      width: '70% !important',
    },
    'thead .MuiTableCell-root': {
      padding: '0.5rem 1rem',
    },
  }),
};

interface TableRowsLoaderProps {
  numberofRows: number;
}

interface CompetencyTableLoaderProps {
  rowsNum: number;
}

export function CompetencyTableLoader({
  rowsNum,
}: CompetencyTableLoaderProps): JSX.Element {
  const TableHeaderLoader = (): JSX.Element => (
    <>
      <TableRow sx={{ background: palette.neutrals.gray100, height: '2.5rem' }}>
        <TableCell component="th" scope="row">Title</TableCell>
        <TableCell>Competency</TableCell>
        <TableCell>Due Date</TableCell>
        <TableCell>Status</TableCell>
      </TableRow>
    </>
  );
  const TableRowsLoader: React.FC<TableRowsLoaderProps> = ({ numberofRows }) => (
    <>
      <>
        {Array.from({ length: numberofRows }, (_, index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row" sx={{ width: '70%' }}>
              <Skeleton animation="wave" variant="text" />
            </TableCell>
            <TableCell>
              <Skeleton animation="wave" variant="text" />
            </TableCell>
            <TableCell>
              <Skeleton animation="wave" variant="text" />
            </TableCell>
            <TableCell>
              <Skeleton animation="wave" variant="text" />
            </TableCell>
          </TableRow>
        ))}
      </>
    </>
  );

  return (
    <>
      <TableContainer
        sx={{
          boxShadow: 'none !important',
          borderRadius: '0 !important',
        }}
        component={Paper}
      >
        <Table css={styles.loaderTable}>
          <TableHead>
            <TableHeaderLoader />
          </TableHead>
          <TableBody>
            <TableRowsLoader numberofRows={rowsNum} />
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
