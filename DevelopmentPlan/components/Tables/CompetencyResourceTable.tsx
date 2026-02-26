import {
  Competency,
  CompetencyResource,
  CompetencyResourceStatus,
  CompetencyResourceStatusDescriptionType,
  CompetencyResourceStatusEnum,
  CompetencyRow,
  CompetencyTableTitle,
  FoundCompetencyResult,
  GetPersonalDevelopmentResourceSortBy,
  GetPersonalDevelopmentSortOrder,
  PDPPermissions,
  ResourceType, TabType,
} from '~DevelopmentPlan/const/types';
import {
  DataGrid, DataGridProps, GridCellParams, GridColumns, GridEventListener, GridRenderCellParams, GridRowParams, GridSortModel,
} from '@mui/x-data-grid';
import { css } from '@emotion/react';
import { useEffect, useMemo } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { PaginationProps } from '~Common/V3/components/Pagination';
import { tableStyles } from '~DevelopmentPlan/const/pageStyles';
import { findCompetencyInfo, getPersonalDevelopmentTypeIcon, openInNewTab } from '~DevelopmentPlan/const/functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { palette } from '~Common/styles/colors';
import moment from 'moment';
import { withLineClamp } from '~Common/styles/mixins';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { CustomNoRowsOverlay } from '~Common/V3/components/MUI/DataGridNoRowsDisplay';
import { useParams } from 'react-router-dom';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';
import { useGetPlanById } from '~DevelopmentPlan/hooks/useGetPlanById';
import JoshDueDate from '~Common/V3/components/JoshDueDate';
import { ItemStatus } from '~Common/V3/components/JoshDueDate/useJoshDueDate';
import emptyPersonalDevelopmentPlan from '~DevelopmentPlan/assets/images/emptyPersonalDevelopmentPlan.svg?url';
import { CompetencyTableLoader } from '../SkeletonLoaders/CompetencyTableLoader';
import PersonalDevelopmentStatus from '../Shared/PersonalDevelopmentStatus';
import PersonalDevelopmentActionMenu from '../Shared/PersonalDevelopmentActionMenu';
import { useResourceDetailsDrawer } from '../Drawers/Resource/ResourceDetails';
import { PersonalDevelopmentPlanDetailsParams } from '../Layouts/ViewDetail/PersonalDevelopmentPlanDetails';

const styles = {
  ...tableStyles,
  icon: css({
    marginRight: '0.5rem',
    verticalAlign: 0,
    color: palette.neutrals.gray700,
  }),
  dueDate: (hasDueDate?: boolean, isPastDue?: boolean, isSoon?: boolean) => {
    let color = 'inherit';

    if (!hasDueDate) {
      color = palette.neutrals.gray800;
    } else if (isPastDue) {
      color = palette.brand.red;
    } else if (isSoon) {
      color = palette.brand.green;
    }

    return css({
      alignItems: 'center',
      color,
      display: 'flex',
      flexDirection: 'row',
      gap: '0.5rem',
    });
  },
  competencyTitle: css({
    lineHeight: '.875rem',
    width: '100%',
  }, withLineClamp(1)),
  overflow: css({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }, withLineClamp(1)),
  competencyName: css({
    fontSize: '.75rem',
    color: palette.neutrals.gray800,
  }, withLineClamp(1)),
};

export const personalDevelopmentResourceSortColumnField: Record<string, GetPersonalDevelopmentResourceSortBy> = {
  title: GetPersonalDevelopmentResourceSortBy.Title,
  status: GetPersonalDevelopmentResourceSortBy.Status,
  dueDate: GetPersonalDevelopmentResourceSortBy.DueDate,
};

interface ViewProps extends Omit<DataGridProps<CompetencyRow>, 'page' | 'onPageChange' | 'onError'>,
Omit<PaginationProps, 'page' | 'onPageChange' | 'numberOfPages' | 'onPreviousClick' | 'onNextClick' | 'onResize'> {
  competencyResources: CompetencyResource[] | undefined,
  isFetching: boolean,
  handleCellClickEvent: GridEventListener<'cellClick'>,
  showSkeleton: boolean,
  sortByField: GetPersonalDevelopmentResourceSortBy | undefined,
  sortByOrder: GetPersonalDevelopmentSortOrder | undefined,
  onSortModelChange: (sortModel: GridSortModel) => void,
}

const View = ({
  competencyResources,
  pageSize,
  rows,
  columns,
  handleCellClickEvent,
  isFetching,
  showSkeleton,
  sortByField,
  sortByOrder,
  onSortModelChange,
}: ViewProps): JSX.Element => (
  <>
    {showSkeleton && (
    <CompetencyTableLoader
      rowsNum={5}
    />
    )}
    {competencyResources && !showSkeleton && (
    <DataGrid
      css={styles.personalDevelopmentTable(rows && rows.length > 0)}
      autoHeight
      columns={columns}
      disableColumnFilter
      disableColumnMenu
      disableSelectionOnClick
      sortingMode="server"
      headerHeight={38}
      rowHeight={90}
      getRowHeight={() => 'auto'}
      hideFooter
      pageSize={pageSize}
      rows={rows}
      sortingOrder={[GetPersonalDevelopmentSortOrder.Ascending, GetPersonalDevelopmentSortOrder.Descending]}
      onSortModelChange={onSortModelChange}
      onCellClick={handleCellClickEvent}
      components={{
        LoadingOverlay: LinearProgress,
        NoRowsOverlay: CustomNoRowsOverlay,
      }}
      componentsProps={{
        noRowsOverlay: {
          altText: 'No Resources Found',
          bodyText: 'No Resources Found',
          image: emptyPersonalDevelopmentPlan,
        },
      }}
      loading={isFetching}
      sortModel={[
        {
          field: personalDevelopmentResourceSortColumnField[sortByField ?? GetPersonalDevelopmentResourceSortBy.Title],
          sort: sortByOrder ?? GetPersonalDevelopmentSortOrder.Ascending,
        },
      ]}
    />
    )}
  </>
);

interface CompetencyResourceTableProps{
  competencyResources: CompetencyResource[] | undefined,
  isFetching: boolean,
  showSkeleton: boolean,
  competencies: Competency[],
  accomplishmentsView?: boolean,
  onSortModelChange: (sortModel: GridSortModel) => void,
  sortByField: GetPersonalDevelopmentResourceSortBy | undefined,
  sortByOrder: GetPersonalDevelopmentSortOrder | undefined,
  activeTab: TabType,
}

export const CompetencyResourceTable = ({
  competencyResources,
  isFetching,
  showSkeleton,
  competencies,
  accomplishmentsView = false,
  onSortModelChange,
  sortByField,
  sortByOrder,
}: CompetencyResourceTableProps): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const { data: currentPdpDetails } = useGetPlanById({ id: pdpId });
  const permissions = currentPdpDetails?.permissions ?? {};

  const isDesktop = useIsDesktopQuery();

  const tableColumnHeaders: GridColumns<CompetencyRow> = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      maxWidth: 800,
      sortable: true,
      renderCell: (params: GridRenderCellParams<CompetencyTableTitle, CompetencyRow>) => {
        if (!params.value) {
          return null;
        }
        const { title, resourceTypeId } = params?.value || {};

        const icon = getPersonalDevelopmentTypeIcon(resourceTypeId ?? ResourceType.All);
        const renderStatusIcon = (): JSX.Element => (
          <FontAwesomeIcon
            icon={icon}
            css={styles.icon}
          />
        );

        return (
          <>
            {renderStatusIcon()}
            <div>
              <span css={styles.competencyTitle}>{title}</span>
              {!isDesktop && (
                <div css={styles.competencyName}>
                  {params.row.competency.name}
                </div>
              )}
            </div>
          </>
        );
      },
    },
    {
      field: 'competency',
      headerName: 'Competency',
      flex: 1,
      maxWidth: 400,
      sortable: false,
      hide: !isDesktop,
      renderCell: (params: GridRenderCellParams<FoundCompetencyResult, CompetencyRow>) => {
        const competencyName = params.value?.name ?? '';

        return (
          <>
            <div css={styles.overflow}>
              {competencyName}
            </div>
          </>
        );
      },
    },
    {
      field: 'dueDate',
      headerName: accomplishmentsView ? 'Date' : 'Due Date',
      flex: 1,
      sortable: true,
      maxWidth: 125,
      renderCell: (params: GridRenderCellParams<string, CompetencyRow>) => {
        if (!params.value) {
          return null;
        }

        const dueDate = params.value;

        const { resourceTypeId } = params?.row.title || {};
        const isMeeting = resourceTypeId === ResourceType.Meeting;
        const isMeetingCompleted = moment(dueDate).isBefore(new Date());
        const statusId = params.row.status.id as unknown as CompetencyResourceStatusEnum;
        const isCompleted = statusId === CompetencyResourceStatusEnum.Complete
          || statusId === CompetencyResourceStatusEnum.Completed
          || (isMeeting && isMeetingCompleted);

        let itemStatus: ItemStatus = 'active';
        if (isCompleted) {
          itemStatus = 'complete';
        }

        return (
          <JoshDueDate showIcon={false} dueDate={dueDate} itemStatus={itemStatus} />
        );
      },
    },
    {
      field: 'status',
      sortable: true,
      headerName: 'Status',
      flex: 1,
      maxWidth: 150,
      headerAlign: 'left',
      hide: !isDesktop || accomplishmentsView,
      renderCell: (params: GridRenderCellParams<CompetencyResourceStatus, CompetencyRow>) => {
        if (!params.value) {
          return null;
        }

        const { resourceTypeId } = params?.row.title || {};

        let status = params.value;

        if (resourceTypeId === ResourceType.Meeting) {
          const isMeetingCompleted = moment(params.row.dueDate).isBefore(moment());
          if (isMeetingCompleted) {
            status = {
              description: CompetencyResourceStatusDescriptionType.Completed,
              id: CompetencyResourceStatusEnum.Completed,
            };
          } else {
            status = {
              description: CompetencyResourceStatusDescriptionType.NotStarted,
              id: CompetencyResourceStatusEnum.NotStarted,
            };
          }
        }
        return (
          <PersonalDevelopmentStatus
            status={status}
            resourceType={resourceTypeId}
            isResource
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      flex: 1,
      maxWidth: 50,
      sortable: false,
      hide: !isDesktop,
      renderCell: (params: GridRenderCellParams<number, CompetencyRow>) => {
        if (!params.value) {
          return null;
        }
        const canUnlink = Array.isArray(permissions) ? permissions.includes(PDPPermissions.CanEdit) : false;
        return (
          <>
            {canUnlink && (
            <PersonalDevelopmentActionMenu
              permissions={[PDPPermissions.CanUnlink]}
              tooltipText="Competency Actions"
              thinMenu
              params={params}
              showUnlink
            />
            )}
          </>
        );
      },
    },
  ];

  const rows: CompetencyRow[] = useMemo(() => (competencyResources?.map((resource) => {
    const competencyFound = findCompetencyInfo(competencies, resource.id);

    return {
      id: resource.id,
      title: {
        title: resource.contentTitle,
        resourceTypeId: resource.contentType.id,
      },
      competency: competencyFound,
      dueDate: resource.contentDueDate,
      status: resource.status,
      actions: resource.id,
      owner: {
        userId: currentPdpDetails?.owner?.userId ?? '',
        orgUserId: currentPdpDetails?.owner?.orgUserId ?? '',
      },
      resourceContentId: resource.contentId,
    };
  }) ?? []), [competencies, competencyResources, currentPdpDetails]);

  const {
    openViewResourceModal,
    setPdpId,
  } = useAddResourceModalStore((state) => ({
    openViewResourceModal: state.openViewResourceModal,
    setPdpId: state.setPdpId,
  }));

  useEffect(() => {
    setPdpId(pdpId);
  }, [pdpId, setPdpId]);

  const { openDrawer: openResourceDetailsDrawer } = useResourceDetailsDrawer();
  const handleCellClickEvent: GridEventListener<'cellClick'> = (params: GridCellParams<GridRowParams, CompetencyRow>) => {
    if (params.field !== 'actions') {
      const {
        competency: {
          id: competencyId,
        },
        title: {
          resourceTypeId,
        },
        resourceContentId,
        owner,
      } = params.row;

      const strippedContentId = resourceContentId.replace(/,/g, '');

      switch (resourceTypeId) {
        case ResourceType.Meeting:
          openInNewTab(`/meetings?orgId=0x2f7fbc&meetingId=${strippedContentId}`);
          break;
        case ResourceType.Accomplishment:
          openViewResourceModal(resourceTypeId, competencyId, strippedContentId, true);
          break;
        default:
          openResourceDetailsDrawer({
            resourceType: resourceTypeId,
            subjectUid: strippedContentId,
            ownerId: owner.userId ?? '',
            ownerOrgID: owner.orgUserId ?? '',
          });
      }
    }
  };

  const hookProps = {
    competencyResources,
    columns: tableColumnHeaders,
    rows,
    tableColumnHeaders,
    handleCellClickEvent,
    isFetching,
    showSkeleton,
    sortByField,
    sortByOrder,
    onSortModelChange,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
