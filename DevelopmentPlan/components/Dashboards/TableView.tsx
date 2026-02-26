import { css } from '@emotion/react';
import {
  GetPDPSearchParams, GetPersonalDevelopmentSortBy, GetPersonalDevelopmentSortOrder, PDPList,
  PDPRoleType,
  TabType, ViewPerspective,
} from '~DevelopmentPlan/const/types';
import {
  PERSONAL_DEVELOPMENT_OTHER_PLANS_PAGE_SIZE, PERSONAL_DEVELOPMENT_TABS,
} from '~DevelopmentPlan/const/defaults';
import JoshCard from '~Common/V3/components/JoshCard';
import { palette } from '~Common/styles/colors';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useGetOtherPlans } from '~DevelopmentPlan/hooks/useGetOtherPlans';
import { usePagination } from '~Common/hooks/usePagination';
import Pagination from '~Common/V3/components/Pagination';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { GridSortModel } from '@mui/x-data-grid';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import ListDashboardEmptyState from '../EmptyStates/ListDashboardEmptyState';
import SharedTable, { personalDevelopmentSortColumnField } from '../Tables/SharedTable';
import { TableLoader } from '../SkeletonLoaders/TableLoader';
import TableFilterBar from '../TableFilters/DataTableFilterBar';

const styles = {
  joshCard: css({
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }),
  cardHeader: css({
    color: palette.brand.indigo,
    fontWeight: 600,
    fontSize: '1.5rem',
  }),
  cardDescription: css({
    color: palette.neutrals.gray700,
    fontWeight: 400,
    fontSize: '14px',
    maxWidth: '30.8125rem',
  }),
};

interface ViewProps {
  plans: PDPList[],
  isFetching: boolean,
  hasMyPlans: boolean,
  viewPerspective: ViewPerspective,
  numberOfPages: number,
  onPageChange: (event: SelectChangeEvent<number>) => void,
  onPreviousClick: () => void,
  onNextClick: () => void,
  page: number,
  onSortModelChange: (sortModel: GridSortModel) => void,
  sortByField: GetPersonalDevelopmentSortBy | undefined,
  sortByOrder: GetPersonalDevelopmentSortOrder | undefined,
  clearAllFilters: () => void,
  areFiltersActive: boolean,
  showSkeleton: boolean,
  activeTab: TabType,
  setActiveTab: (tab: TabType) => void,
}

const View = ({
  plans,
  isFetching,
  hasMyPlans,
  viewPerspective,
  numberOfPages,
  onPageChange,
  onPreviousClick,
  onNextClick,
  page,
  onSortModelChange,
  sortByField,
  sortByOrder,
  showSkeleton,
  clearAllFilters,
  areFiltersActive,
  activeTab,
  setActiveTab,
}: ViewProps): JSX.Element => (
  <>
    <JoshCard
      css={styles.joshCard}
    >
      <div
        css={styles.cardHeader}
      >
        Other Plans
      </div>
      <div
        css={styles.cardDescription}
      >
        View development plans as a mentor or viewer. As a manager, you can view all of your direct reports development plans regardless of role.
      </div>
      {showSkeleton && (
      <TableLoader
        rowsNum={10}
      />
      )}
      {!showSkeleton && (
      <>
        <TableFilterBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          areFiltersActive={areFiltersActive}
          clearAllFilters={clearAllFilters}
        />
        {plans.length === 0 && (
        <>
          {!hasMyPlans && !showSkeleton && (
          <ListDashboardEmptyState
            viewPerspective={viewPerspective}
            areFiltersActive={areFiltersActive}
          />
          )}
        </>
        )}
        {plans.length > 0 && (
        <>
          <SharedTable
            data={plans}
            onSortModelChange={onSortModelChange}
            sortByField={sortByField}
            sortByOrder={sortByOrder}
            isFetching={isFetching}
          />
          {numberOfPages > 1 && (
          <Pagination
            page={page}
            onPageChange={onPageChange}
            numberOfPages={numberOfPages}
            onPreviousClick={onPreviousClick}
            onNextClick={onNextClick}
          />
          )}
        </>
        )}
      </>
      )}
    </JoshCard>
  </>
);

interface TableViewProps{
  searchText: string,
  viewPerspective: ViewPerspective,
}

const TableView = ({
  searchText,
  viewPerspective,
}: TableViewProps): JSX.Element => {
  const [role, setRole] = useQueryParamState<PDPRoleType[]>('personalDevelopment', 'role', [], true);
  const [status, setStatus] = useQueryParamState<PDPRoleType[]>('personalDevelopment', 'status', [], true);
  const [ownerList, setOwnerList] = useQueryParamState<string[]>('personalDevelopment', 'owner', [], true);

  const {
    page,
    setPage,
    sortByField,
    setSortByField,
    sortByOrder,
    setSortByOrder,
  } = useStoreParams((state) => ({
    page: state.page,
    setPage: state.setPage,
    sortByField: state.sortByField,
    setSortByField: state.setSortByField,
    sortByOrder: state.sortByOrder,
    setSortByOrder: state.setSortByOrder,
  }));
  const history = useHistory();

  // If the filters/searchText change, reset the page number so we don't look at page 2 of a 1 page searchText as an example.
  useEffect(() => {
    setPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.search, searchText]);

  const params = {
    skip: (page - 1) * PERSONAL_DEVELOPMENT_OTHER_PLANS_PAGE_SIZE,
    take: PERSONAL_DEVELOPMENT_OTHER_PLANS_PAGE_SIZE,
    search: searchText,
    sortField: sortByField,
    sortDirection: sortByOrder,
    role,
    status,
    owner: ownerList,
  } as GetPDPSearchParams;

  const {
    data, isLoading: plansAreLoading, isFetching,
  } = useGetOtherPlans({ params });
  const [showSkeleton] = useSkeletonLoaders(plansAreLoading);

  const plans = data?.response ?? [];
  const hasMyPlans = (data?.response?.length ?? 0) > 0;

  const usePaginationProps = usePagination({
    // eslint-disable-next-line no-underscore-dangle
    totalCount: data?._metadata?.totalNumberOfRecords ?? 1,
    pageSize: PERSONAL_DEVELOPMENT_OTHER_PLANS_PAGE_SIZE,
    page,
    setPage,
  });

  const onSortModelChange = useCallback((sortModel: GridSortModel) => {
    if (sortModel.length) {
      const sortOrder = sortModel[0].sort === GetPersonalDevelopmentSortOrder.Ascending
        ? GetPersonalDevelopmentSortOrder.Ascending : GetPersonalDevelopmentSortOrder.Descending;
      const resourceField = personalDevelopmentSortColumnField[sortModel[0].field];
      setSortByField(resourceField);
      setSortByOrder(sortOrder);
    }
  }, [setSortByField, setSortByOrder]);

  const areFiltersActive = ownerList.length > 0
    || role.length > 0
    || status.length > 0;

  const clearAllFilters = (): void => {
    setRole([]);
    setStatus([]);
    setOwnerList([]);
  };

  const [activeTab, setActiveTab] = useQueryParamState<TabType>(
    'personalDevelopment',
    'tab',
    PERSONAL_DEVELOPMENT_TABS[0].value,
  );

  const hookProps = {
    searchText,
    plans,
    isFetching,
    hasMyPlans,
    viewPerspective,
    page,
    onSortModelChange,
    sortByField,
    sortByOrder,
    showSkeleton,
    clearAllFilters,
    areFiltersActive,
    activeTab,
    setActiveTab,
    ...usePaginationProps,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, TableView };
export default TableView;
