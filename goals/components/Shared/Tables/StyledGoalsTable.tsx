import { css } from '@emotion/react';
import { LinearProgress } from '@mui/material';
import {
  DataGridPro,
  DataGridProProps,
  GridCellParams,
  GridRow,
  GridRowProps,
} from '@mui/x-data-grid-pro';
import { ReactElement } from 'react';
import { palette } from '~Common/styles/colors';
import { palette as paletteRedesign } from '~Common/styles/colorsRedesign';
import { forMobileObject } from '~Common/styles/mixins';
import { CascadingGoalRow, GoalRow } from '~Goals/const/types';
import { useCheckPageLocation } from '~Common/hooks/usePageLocation';
import { RouteName } from '~Common/const/routeName';
import { PAGINATION_PAGE_SIZES, PAGINATION_DEFAULT_PAGE_SIZE, PAGINATION_DEFAULT_PAGE_NUMBER } from '~Goals/const';

// REFACTOR: Consolidate all styles into GOAL_TABLE_STYLES object
const styles = {
  styledGoalsTable: css({
    color: palette.neutrals.gray800,
    border: 0,
    fontSize: '.8125rem',
    padding: '0rem',

    '.joshGridRow': {
      height: '2.9375rem',
      '.goalNameHome': {
        paddingLeft: '0px !important',
      },
      '.goalOwnerHome': {
        paddingRight: '0px !important',
      },
    },
    '.joshGridCell': {
      height: '100%',
      fontSize: '.8125rem',
    },
    '.joshGridTitleCell': {
      paddingLeft: 0,
    },
    '.joshGridCellDepth1': {
      backgroundColor: palette.neutrals.cardBackground,
    },
    '.joshGridCellDepth2': {
      backgroundColor: palette.neutrals.gray100,
    },
    '.joshGridCellDepth3': {
      backgroundColor: palette.neutrals.gray200,
    },
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: paletteRedesign.background.secondary.default,
      borderBottom: `1px solid ${paletteRedesign.border.secondary} 0px`,
      borderTop: `1px solid ${paletteRedesign.border.secondary} 0px`,
      borderRadius: 0,
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 600,
      fontSize: '.75rem',
      color: paletteRedesign.text.quartnerary.default,

    },
    '&.MuiDataGrid-columnSeparator': {
      display: 'none',
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none',
    },
    '&.MuiDataGrid-row:hover': {
      cursor: 'pointer',
    },
    '&.linearProgress': {
      backgroundColor: palette.brand.indigo,
      '&.MuiLinearProgress-bar1': {
        backgroundColor: palette.brand.indigo,
      },
      '&.MuiLinearProgress-bar2': {
        backgroundColor: palette.brand.indigo,
      },
    },
  }, forMobileObject({
    '.joshGridCell': {
      fontSize: '.6875rem',
    },
  })),
};

const getCellClassName = ({ rowNode }: GridCellParams): string => {
  const className = `joshGridCell joshGridCellDepth${rowNode.depth}`;
  return className;
};
const getRowClassName = (): string => 'joshGridRow';

// Adding identifier to table rows
const CustomGridRow = (props: GridRowProps): ReactElement<GoalRow | CascadingGoalRow> => {
  const { rowId } = props;
  return (
    <GridRow {...props} data-goal-id={`goalsTableRow-${rowId}`} />
  );
};

interface StyledGoalsTableProps extends DataGridProProps {
  headerHeight?: number,
}

const StyledGoalsTable = ({ headerHeight = 38, ...props }: StyledGoalsTableProps): JSX.Element => {
  const isViewingHome = useCheckPageLocation([RouteName.Home]);

  return (
    <DataGridPro
      css={styles.styledGoalsTable}
      getCellClassName={getCellClassName}
      getRowClassName={getRowClassName}
      autoHeight
      columnHeaderHeight={headerHeight}
      rowHeight={isViewingHome ? 47 : 70}
      hideFooter
      sx={{
        '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
          // outline: 'none !important',
        },
      }}
      slots={{
        loadingOverlay: () => <LinearProgress />,
        row: CustomGridRow,
      }}
      pagination
      pageSizeOptions={PAGINATION_PAGE_SIZES}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: PAGINATION_DEFAULT_PAGE_SIZE,
            page: PAGINATION_DEFAULT_PAGE_NUMBER,
          },
        },
      }}
      {...props}
    />
  );
};

export default StyledGoalsTable;
