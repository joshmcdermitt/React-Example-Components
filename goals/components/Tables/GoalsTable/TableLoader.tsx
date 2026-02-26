import { css } from '@emotion/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Skeleton, TableHead } from '@mui/material';
import Paper from '@mui/material/Paper';
import { palette } from '~Common/styles/colors';
import { palette as paletteRedesign } from '~Common/styles/colorsRedesign';
import { FC } from 'react';
import { GOALS_TABLE_STYLES } from '~Goals/const/styles';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';

const styles = {
  ...GOALS_TABLE_STYLES,
  tableContainer: css({
    boxShadow: 'none !important',
    borderRadius: '0 !important',
  }),
  loaderTable: css({
    'tr.MuiTableCell-root:first-child': {
      width: '70% !important',
    },
  }),
  tableCallStatusSmall: css({
    maxWidth: '10.625rem',
    minWidth: '7.5rem',
  }),
  tableCallNameSmall: css({
    width: '100%',
    'thead .MuiTableCell-root': {
      padding: '0.5rem 1rem',
    },
  }),
  headerCell: css({
    padding: '0.25rem 1rem',
    fontWeight: 600,
    fontSize: '.75rem',
    color: paletteRedesign.text.quartnerary.default,
    backgroundColor: paletteRedesign.background.secondary.default,
    borderBottom: `1px solid ${paletteRedesign.border.secondary}`,
    borderTop: `1px solid ${paletteRedesign.border.secondary}`,
  }),
};

interface TableRowsLoaderProps {
  numberofRows: number;
}

interface TableLoaderProps {
  rowsNum: number;
  isDesktop?: boolean;
}

export function TableLoader({
  rowsNum,
  isDesktop = true,
}: TableLoaderProps): JSX.Element {
  const TableHeaderLoader = (): JSX.Element => {
    const { featureNamesText } = useGetFeatureNamesText();

    return (
      <TableRow sx={{ background: palette.neutrals.gray100, height: '2.375rem' }}>
        {isDesktop ? (
          <>
            <TableCell component="th" scope="row" width="240px" css={styles.headerCell}>{`${featureNamesText.goals.singular} Name`}</TableCell>
            <TableCell width="160px" css={styles.headerCell}>Target</TableCell>
            <TableCell width="210px" css={styles.headerCell}>Status</TableCell>
            <TableCell width="130px" css={styles.headerCell}>Due Date</TableCell>
            <TableCell width="130px" css={styles.headerCell}>Priority</TableCell>
            <TableCell width="130px" css={styles.headerCell}>Scope</TableCell>
            <TableCell width="92px" css={styles.headerCell}>Owner</TableCell>
            <TableCell width="32px" css={styles.headerCell} />
          </>
        ) : (
          <>
            <TableCell component="th" scope="row" css={[styles.tableCallNameSmall, styles.headerCell]}>Objective Name</TableCell>
            <TableCell css={[styles.tableCallStatusSmall, styles.headerCell]}>Status</TableCell>
            <TableCell width="92px" css={styles.headerCell}>Owner</TableCell>
            <TableCell width="32px" css={styles.headerCell} />
          </>
        )}
      </TableRow>
    );
  };

  const TableRowsLoader: FC<TableRowsLoaderProps> = ({ numberofRows }) => (
    <>
      {Array.from({ length: numberofRows }, (_, index) => (
        <TableRow key={index}>
          {isDesktop ? (
            <>
              <TableCell component="th" scope="row">
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
              <TableCell>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" variant="circular" width="30px" height="30px" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
            </>
          ) : (
            <>
              <TableCell component="th" scope="row">
                <Skeleton animation="wave" variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" variant="circular" width="30px" height="30px" />
              </TableCell>
              <TableCell>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
            </>
          )}
        </TableRow>
      ))}
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
        <Table css={[styles.goalsTable(isDesktop), styles.loaderTable]}>
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
