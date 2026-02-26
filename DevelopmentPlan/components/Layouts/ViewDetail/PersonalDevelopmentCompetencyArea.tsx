import { css } from '@emotion/react';
import { useParams } from 'react-router';
import JoshCard from '~Common/V3/components/JoshCard';
import { palette } from '~Common/styles/colors';
import {
  Competency,
  CompetencyResource, GetCompetencyResourceSearchParams, GetPersonalDevelopmentResourceSortBy,
  GetPersonalDevelopmentSortOrder, PDPPermissions, ResourceType, TabType,
  ViewPersonalDevelopmentPlanPerspective,
} from '~DevelopmentPlan/const/types';
import { useGetCompetencyResources } from '~DevelopmentPlan/hooks/useGetCompetencyResources';
import { usePagination } from '~Common/hooks/usePagination';
import { COMPETENCY_RESOURCE_PAGE_SIZE, COMPETENCY_RESOURCE_TABS, DEFAULT_PDP_PATHNAME } from '~DevelopmentPlan/const/defaults';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import Pagination from '~Common/V3/components/Pagination';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { CompetencyResourceTable, personalDevelopmentResourceSortColumnField } from '~DevelopmentPlan/components/Tables/CompetencyResourceTable';
import CompetencyFilterBar from '~DevelopmentPlan/components/TableFilters/CompetencyFilterBar';
import { CompetencySelectObj, getDateRangeDates } from '~DevelopmentPlan/const/functions';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { useGetCompetencyList } from '~DevelopmentPlan/hooks/useGetCompetencyList';
import EmptyStateWithImage from '~Common/components/EmptyStates/EmptyStateWithImage';
import EmptyDevelopmentPlanCompetencies from '~DevelopmentPlan/assets/images/emptyDevelopmentPlanCompetencies.svg';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { GridSortModel } from '@mui/x-data-grid';
import { useGetPlanById } from '~DevelopmentPlan/hooks/useGetPlanById';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { AddResource } from './AddResource';

const styles = {
  planTitle: css({
    color: palette.brand.indigo,
    fontWeight: 600,
    fontSize: '1.125rem',
    marginBottom: '.75rem',
  }),
  tableFooterWrapper: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  }),
};

interface ViewProps {
  competencyResources: CompetencyResource[] | undefined,
  competencies: Competency[],
  isFetching: boolean,
  page: number,
  numberOfPages: number,
  onPageChange: (event: SelectChangeEvent<number>) => void,
  onPreviousClick: () => void,
  onNextClick: () => void,
  activeTab: TabType,
  setActiveTab: (tab: TabType) => void,
  uniqueCompetencyNames: CompetencySelectObj[],
  showSkeleton: boolean,
  canEdit: boolean,
  hasCompetencies: boolean,
  handleAddCompetency: () => void,
  isLoading: boolean,
  sortByResourceField: GetPersonalDevelopmentResourceSortBy | undefined,
  sortByResourceOrder: GetPersonalDevelopmentSortOrder | undefined,
  onSortModelChange: (sortModel: GridSortModel) => void,
  isOwner: boolean,
}

const View = ({
  competencyResources,
  isFetching,
  page,
  numberOfPages,
  onPageChange,
  onPreviousClick,
  onNextClick,
  activeTab,
  setActiveTab,
  uniqueCompetencyNames,
  showSkeleton,
  canEdit,
  competencies,
  hasCompetencies,
  handleAddCompetency,
  isLoading,
  sortByResourceField,
  sortByResourceOrder,
  onSortModelChange,
  isOwner,
}: ViewProps): JSX.Element => (
  <>
    <JoshCard>
      <div
        css={styles.planTitle}
      >
        Development Plan
      </div>
      {!hasCompetencies && !isLoading && (
        <EmptyStateWithImage
          renderImage={() => (
            <EmptyDevelopmentPlanCompetencies title="Empty Competencies" />
          )}
          renderText={() => (
            <p>
              Competencies are focus areas for growth.
              <br />
              <JoshButton
                variant="text"
                textButtonColor={palette.brand.indigo}
                onClick={handleAddCompetency}
                data-test-id="pdpsCreatePageEmptyStateAddCompetency"
              >
                Add your first one.
              </JoshButton>
            </p>
          )}
        />
      )}
      {(hasCompetencies || isLoading) && (
        <>
          <div>
            <CompetencyFilterBar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              uniqueCompetencyNames={uniqueCompetencyNames}
            />
          </div>
          <CompetencyResourceTable
            competencyResources={competencyResources}
            isFetching={isFetching}
            showSkeleton={showSkeleton}
            competencies={competencies}
            accomplishmentsView={activeTab === TabType.Accomplishments}
            onSortModelChange={onSortModelChange}
            sortByField={sortByResourceField}
            sortByOrder={sortByResourceOrder}
            activeTab={activeTab}
          />
        </>
      )}
      {!showSkeleton && (
      <div
        css={styles.tableFooterWrapper}
      >
        {isOwner && canEdit && hasCompetencies && (
        <AddResource />
        )}
        {numberOfPages > 1 && (
        <Pagination
          page={page}
          onPageChange={onPageChange}
          numberOfPages={numberOfPages}
          onPreviousClick={onPreviousClick}
          onNextClick={onNextClick}
        />
        )}
      </div>
      )}
    </JoshCard>
  </>
);

interface PersonalDevelopmentPlanDetailsParams {
  pdpId: string,
}

export const PersonalDevelopmentCompetencyArea = (): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();

  const {
    page,
    setPage,
    planPermissions,
    sortByResourceField,
    setSortByResourceField,
    sortByResourceOrder,
    setSortByResourceOrder,
    dateRangeValue,
  } = useStoreParams((state) => ({
    page: state.page,
    setPage: state.setPage,
    dateRangeValue: state.dateRangeValue,
    planPermissions: state.planPermissions,
    sortByResourceField: state.sortByResourceField,
    setSortByResourceField: state.setSortByResourceField,
    sortByResourceOrder: state.sortByResourceOrder,
    setSortByResourceOrder: state.setSortByResourceOrder,
  }));
  const [typeFilter, setTypeFilter] = useQueryParamState<ResourceType[]>('personalDevelopment', 'type', [], true);
  const [competencyFiltered] = useQueryParamState<number[]>('personalDevelopment', 'competency', [], true);

  const [activeTab, setActiveTab] = useQueryParamState<TabType>(
    'personalDevelopment',
    'tab',
    COMPETENCY_RESOURCE_TABS[0].value,
  );

  const setTypeFilterOptions = (): ResourceType[] => {
    const typeMappings: Record<TabType, ResourceType[]> = {
      [TabType.Accomplishments]: [ResourceType.Accomplishment],
      [TabType.Steps]: [ResourceType.ActionItem, ResourceType.Feedback, ResourceType.Goal,
        ResourceType.LearningPlaylist, ResourceType.Learning, ResourceType.Meeting],
      [TabType.Plan]: [],
    };

    return typeFilter.length === 0 ? (typeMappings[activeTab] || []) : typeFilter;
  };
  useEffect(() => {
    setTypeFilter([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const history = useHistory();
  // If the filters/searchText change, reset the page number so we don't look at page 2 of a 1 page searchText as an example.
  useEffect(() => {
    setPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.search]);

  const { startDate, endDate } = getDateRangeDates(dateRangeValue);
  const params = {
    skip: (page - 1) * COMPETENCY_RESOURCE_PAGE_SIZE,
    take: COMPETENCY_RESOURCE_PAGE_SIZE,
    sortField: sortByResourceField,
    sortDirection: sortByResourceOrder,
    competency: competencyFiltered,
    contentTypes: setTypeFilterOptions(),
    startDate,
    endDate,
  } as GetCompetencyResourceSearchParams;
  const {
    data, isFetching, isLoading: resourceIsLoading, isError: competencyResourceError,
  } = useGetCompetencyResources({ id: pdpId, params });
  const { data: competenciesReturn, isLoading: competencyIsLoading, isError: competencyError } = useGetCompetencyList({ id: pdpId });
  const competencies = competenciesReturn?.response ?? [];
  const uniqueCompetencyNames = Array.from(new Set(competencies.map((item) => ({ id: item.id, name: item.name }))));

  const { data: plan } = useGetPlanById({ id: pdpId });
  const isOwner = plan?.owner?.orgUserId === getOrganizationUserId();

  useEffect(() => {
    const inPDPs = history.location.pathname.includes(`${DEFAULT_PDP_PATHNAME}`);
    if (inPDPs && competencyResourceError && competencyError) {
      history.push(DevelopmentPlanRoutes?.PermissionsDenied);
    }
  }, [competencyError, competencyResourceError, history]);

  const isLoading = resourceIsLoading && competencyIsLoading;
  const [showSkeleton] = useSkeletonLoaders(isLoading);
  const unfilteredCompetencyResources = data?.response ?? [];
  const competencyResources = unfilteredCompetencyResources.filter((item) => item?.contentType?.id !== ResourceType.Recognition);

  const canEdit = planPermissions.includes(PDPPermissions.CanEdit);

  const usePaginationProps = usePagination({
    // eslint-disable-next-line no-underscore-dangle
    totalCount: data?._metadata?.totalNumberOfRecords ?? 1,
    pageSize: COMPETENCY_RESOURCE_PAGE_SIZE,
    page,
    setPage,
  });
  const hasCompetencies = competencies && competencies.length > 0 && !isLoading;

  const handleAddCompetency = (): void => {
    const editDetail = DevelopmentPlanRoutes.EditById
      .replace(':pdpId', pdpId)
      .replace(':stepId', ViewPersonalDevelopmentPlanPerspective.Create_Plan);
    history.push(editDetail);
  };

  const onSortModelChange = useCallback((sortModel: GridSortModel) => {
    if (sortModel.length) {
      const sortOrder = sortModel[0].sort === GetPersonalDevelopmentSortOrder.Ascending
        ? GetPersonalDevelopmentSortOrder.Ascending : GetPersonalDevelopmentSortOrder.Descending;
      const resourceField = personalDevelopmentResourceSortColumnField[sortModel[0].field];
      setSortByResourceField(resourceField);
      setSortByResourceOrder(sortOrder);
    }
  }, [setSortByResourceField, setSortByResourceOrder]);

  const hookProps = {
    competencyResources,
    competencies,
    isFetching,
    page,
    activeTab,
    setActiveTab,
    uniqueCompetencyNames,
    showSkeleton,
    canEdit,
    hasCompetencies,
    handleAddCompetency,
    isLoading,
    sortByResourceField,
    sortByResourceOrder,
    onSortModelChange,
    isOwner,
    ...usePaginationProps,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
