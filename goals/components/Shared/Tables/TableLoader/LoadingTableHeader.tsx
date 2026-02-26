import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { TableCell, TableRow } from '@mui/material';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { palette } from '~Common/styles/colors';

const styles = {
  loadingTableHeader: css({
    background: palette.neutrals.gray100,
    height: '2.5rem',
  }),
};

interface ViewProps {
  isMobile: boolean,
  showPriorityColumn: boolean,
}

const View = ({
  isMobile,
  showPriorityColumn,
}: ViewProps): JSX.Element => (
  <TableRow css={styles.loadingTableHeader}>
    {!isMobile && (
      <>
        <TableCell component="th" scope="row">Name</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Dates</TableCell>
        {showPriorityColumn && (
          <TableCell>Priority</TableCell>
        )}
        <TableCell>My Role</TableCell>
        <TableCell>Category</TableCell>
        <TableCell>Owner</TableCell>
      </>
    )}
    {isMobile && (
    <>
      <TableCell component="th" scope="row">Name</TableCell>
      <TableCell>Dates</TableCell>
    </>
    )}
  </TableRow>
);

interface LoadingTableHeaderProps {
  activeTab: Goals.GoalContextType,
}

const LoadingTableHeader = ({
  activeTab,
  ...props
}: LoadingTableHeaderProps): JSX.Element => {
  const isMobile = useIsMobileQuery();
  const showPriorityColumn = activeTab !== Goals.GoalContextType.Team;

  const hookProps = {
    isMobile,
    showPriorityColumn,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default LoadingTableHeader;
