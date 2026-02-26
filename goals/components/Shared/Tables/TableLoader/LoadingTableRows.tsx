import { TableCell, TableRow } from '@mui/material';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';

interface ViewProps {
  isMobile: boolean,
  numberOfRows: number,
}

const View = ({
  isMobile,
  numberOfRows,
}: ViewProps): JSX.Element => (
  <>
    {Array.from({ length: numberOfRows }, (_, index) => (
      <TableRow key={index}>
        {isMobile && (
        <>
          <TableCell component="th" scope="row" sx={{ width: '70%' }}>
            <SkeletonLoader variant="text" renderComponent={() => <></>} />
          </TableCell>
          <TableCell>
            <SkeletonLoader variant="text" renderComponent={() => <></>} />
          </TableCell>
        </>
        )}
        {!isMobile && (
        <>
          <TableCell component="th" scope="row" sx={{ width: '70%' }}>
            <SkeletonLoader variant="text" renderComponent={() => <></>} />
          </TableCell>
          <TableCell>
            <SkeletonLoader variant="text" renderComponent={() => <></>} />
          </TableCell>
          <TableCell>
            <SkeletonLoader variant="text" renderComponent={() => <></>} />
          </TableCell>
          <TableCell>
            <SkeletonLoader variant="text" renderComponent={() => <></>} />
          </TableCell>
          <TableCell>
            <SkeletonLoader variant="text" renderComponent={() => <></>} />
          </TableCell>
          <TableCell>
            <SkeletonLoader variant="text" renderComponent={() => <></>} />
          </TableCell>
        </>
        )}
      </TableRow>
    ))}
  </>
);

type LoadingTableRowsProps = Pick<ViewProps, 'numberOfRows'>;

const LoadingTableRows = ({
  ...props
}: LoadingTableRowsProps): JSX.Element => {
  const isMobile = useIsMobileQuery();

  const hookProps = {
    isMobile,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export default LoadingTableRows;
