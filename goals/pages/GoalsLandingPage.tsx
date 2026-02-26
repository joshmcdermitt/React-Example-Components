import { css } from '@emotion/react';
import JoshCard from '~Common/V3/components/JoshCard';
import { TableFilters } from '~Goals/components/TableFilters';
import SearchHeader from '~Goals/components/SearchGoals/SearchHeader';
import { useIsDesktopQuery, useIsMobileQuery } from '~Common/hooks/useMediaListener';
import MuiPagination from '~Common/V4/Pagination';
import GoalsTable, { goalSortColumnField } from '~Goals/components/Tables/GoalsTable';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { useCallback } from 'react';
import { GridSortModel } from '@mui/x-data-grid-pro';
import { dataGridToGoalsSortOrder } from '~Goals/components/DeleteAfterGoalsV4/Goals';
import { palette } from '~Common/styles/colorsRedesign';
import PerformanceSnapshotContainer from '~Goals/components/PerformanceSnapshot';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';

const styles = {
  joshCard: css({
    marginBottom: '2rem',
    padding: '0rem',
    boxShadow: 'none',
    border: `1px solid ${palette.border.secondary}`,
    borderRadius: '.75rem',
    background: palette.background.primary.default,
  }),
  paginationContainer: css({
    padding: '.75rem 1.5rem 1rem 1.5rem',
    borderTop: `1px solid ${palette.border.secondary}`,
  }),
};

const GoalsLandingPage = (): JSX.Element => {
  const isMobile = useIsMobileQuery();
  const {
    enableCascadingGoals,
    payload,
    numberOfPages,
    numberOfPagesCascading,
    page,
    onPageChange,
    setSortByField,
    setSortByOrder,
    setPage,
  } = useGoalsContext();
  const isDesktop = useIsDesktopQuery();
  const areFiltersActive = false;

  const pageCount = enableCascadingGoals ? numberOfPagesCascading : numberOfPages;

  const onSortModelChange = useCallback((sortModel: GridSortModel) => {
    if (sortModel.length) {
      setSortByField(goalSortColumnField[sortModel[0].field]);
      if (sortModel[0].sort) {
        setSortByOrder(dataGridToGoalsSortOrder[sortModel[0].sort]);
      }
      // Reset to first page when sort changes
      setPage(1);
    }
  }, [setSortByField, setSortByOrder, setPage]);

  const enablePerformanceSnapshot = useFeatureFlag('enableGoalPerformanceSnapshot');

  return (
    <>
      {enablePerformanceSnapshot && (
      <PerformanceSnapshotContainer
        payload={payload}
        enableCascadingGoals={enableCascadingGoals}
      />
      )}
      <JoshCard
        css={styles.joshCard}
      >
        <SearchHeader />
        {isDesktop && (
        <TableFilters
          areFiltersActive={areFiltersActive}
        />
        )}

        {enableCascadingGoals && (
        <GoalsTable
          onSortModelChange={onSortModelChange}
        />
        )}
        {!enableCascadingGoals && (
        <GoalsTable
          onSortModelChange={onSortModelChange}
        />
        )}

        {pageCount > 1 && (
        <div css={styles.paginationContainer}>
          <MuiPagination
            count={pageCount}
            page={page}
            onPageChange={onPageChange}
            siblingCount={0}
            boundaryCount={isMobile ? 1 : 3}
          />
        </div>
        )}
      </JoshCard>
    </>
  );
};

export default GoalsLandingPage;
