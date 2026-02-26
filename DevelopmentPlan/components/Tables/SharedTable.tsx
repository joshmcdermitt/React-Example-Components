import { css } from '@emotion/react';
import { useMemo, useCallback } from 'react';
import {
  DataGrid,
  DataGridProps,
  GridColumns,
  GridRenderCellParams,
  GridRowParams,
  GridSortModel,
} from '@mui/x-data-grid';
import { PaginationProps } from '~Common/V3/components/Pagination';
import { OrgUser } from '@josh-hr/types';
import Tooltip from '~Common/components/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import { useHistory } from 'react-router';
import {
  GetPersonalDevelopmentSortBy, GetPersonalDevelopmentSortOrder, ItemsCompleted,
  NextResource, PDPList, PDPRoleType, PDPStatus, PersonalDevelopmentRow,
} from '~DevelopmentPlan/const/types';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { tableStyles } from '~DevelopmentPlan/const/pageStyles';
import { COMPETENCY_RESOURCE_TABS } from '~DevelopmentPlan/const/defaults';
import { CustomNoRowsOverlay } from '~Common/V3/components/MUI/DataGridNoRowsDisplay';
import { useIsMobileQuery, useIsTabletQuery } from '~Common/hooks/useMediaListener';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import emptyPersonalDevelopmentPlan from '~DevelopmentPlan/assets/images/emptyPersonalDevelopmentPlan.svg?url';
import PersonalDevelopmentStatus from '../Shared/PersonalDevelopmentStatus';
import PersonalDevelopmentNextItemDue from '../Shared/PersonalDevelopmentNextItemDue';

const styles = {
  ...tableStyles,
  assigneeField: css({
    display: 'flex',
    alignItems: 'center',
  }),
  avatar: css({
    marginRight: '.5rem',
  }),
  italics: css({
    fontStyle: 'italic',
  }),
};

export const personalDevelopmentSortColumnField: Record<string, GetPersonalDevelopmentSortBy> = {
  name: GetPersonalDevelopmentSortBy.Name,
  status: GetPersonalDevelopmentSortBy.Status,
};

const convertPersonalDevelopmentSortColumnField = (field: GetPersonalDevelopmentSortBy): string => {
  switch (field) {
    case GetPersonalDevelopmentSortBy.Name:
      return 'name';
    case GetPersonalDevelopmentSortBy.Status:
      return 'status';
    default:
      return 'name';
  }
};

export interface ViewProps extends Omit<DataGridProps<PersonalDevelopmentRow>, 'page' | 'onPageChange' | 'onError'>,
Omit<PaginationProps, 'page' | 'onPageChange' | 'numberOfPages' | 'onPreviousClick' | 'onNextClick' | 'onResize'> {
  sortByField: GetPersonalDevelopmentSortBy | undefined,
  sortByOrder: GetPersonalDevelopmentSortOrder | undefined,
  isFetching: boolean,
}

const View = ({
  rows,
  columns,
  pageSize,
  onSortModelChange,
  onRowClick,
  sortByField,
  sortByOrder,
  isFetching,
}: ViewProps): JSX.Element => (
  <>
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
      onRowClick={onRowClick}
      components={{
        LoadingOverlay: LinearProgress,
        NoRowsOverlay: CustomNoRowsOverlay,
      }}
      componentsProps={{
        noRowsOverlay: {
          altText: 'Development Plans Found',
          bodyText: 'Development Plans Found',
          image: emptyPersonalDevelopmentPlan,
        },
      }}
      loading={isFetching}
      sortModel={[
        {
          field: convertPersonalDevelopmentSortColumnField(sortByField ?? GetPersonalDevelopmentSortBy.Name),
          sort: sortByOrder === GetPersonalDevelopmentSortOrder.Ascending ? 'asc' : 'desc',
        },
      ]}
    />
  </>
);

interface SharedTableProps {
  data: PDPList[],
  onSortModelChange: (sortModel: GridSortModel) => void,
  sortByField: GetPersonalDevelopmentSortBy | undefined,
  sortByOrder: GetPersonalDevelopmentSortOrder | undefined,
  isFetching: boolean,
}

const SharedTable = ({
  data,
  onSortModelChange,
  sortByField,
  sortByOrder,
  isFetching,
}: SharedTableProps): JSX.Element => {
  const isMobile = useIsMobileQuery();
  const isTablet = useIsTabletQuery();
  const tableColumnHeaders: GridColumns<PersonalDevelopmentRow> = [
    {
      field: 'owner',
      sortable: false,
      headerName: 'Plan Owner',
      align: 'left',
      maxWidth: 225,
      flex: isMobile ? 2 : 1,
      renderCell: (params: GridRenderCellParams<OrgUser, PersonalDevelopmentRow>) => {
        if (params.value?.firstName === '') {
          return <></>;
        }
        const {
          orgUserId,
          firstName,
          lastName,
        } = params.value || {};
        const name = `${firstName ?? ''} ${lastName ?? ''}`;

        return (
          <Tooltip content={name}>
            <div css={styles.assigneeField}>
              <BaseAvatar
                css={styles.avatar}
                orgUserId={orgUserId ?? null}
                avatarSize={22}
              />
              <div>{name}</div>
            </div>
          </Tooltip>
        );
      },
    },
    {
      field: 'name',
      sortable: true,
      headerName: 'Development Plan',
      flex: 2,
    },
    {
      field: 'itemsCompleted',
      sortable: false,
      hide: isMobile,
      headerName: 'Items Completed',
      flex: 1,
      renderCell: (params: GridRenderCellParams<ItemsCompleted, PersonalDevelopmentRow>) => {
        if (!params.value) {
          return null;
        }

        return (
          <>
            <div>
              {params.value.milestonesTotal === 0 && (
                <>
                  <span css={styles.italics}>No resources added</span>
                </>
              )}
              {params.value.milestonesTotal > 0 && (
                <>
                  {`${params.value.milestonesCompleted} of ${params.value.milestonesTotal}`}
                </>
              )}
            </div>
          </>
        );
      },
    },
    {
      field: 'itemDue',
      sortable: false,
      headerName: 'Next Item Due',
      flex: 1,
      maxWidth: 200,
      hide: isTablet || isMobile,
      headerAlign: 'left',
      renderCell: (params: GridRenderCellParams<NextResource, PersonalDevelopmentRow>) => {
        if (!params.value) {
          return 'N/A';
        }

        return (
          <>
            <PersonalDevelopmentNextItemDue
              resource={params.value}
            />
          </>
        );
      },
    },
    {
      field: 'role',
      sortable: false,
      headerName: 'Role',
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      maxWidth: 100,
      hide: isMobile,
    },
    {
      field: 'status',
      sortable: true,
      maxWidth: 200,
      hide: isTablet || isMobile,
      flex: 1,
      headerName: 'Status',
      headerAlign: 'left',
      renderCell: (params: GridRenderCellParams<PDPStatus, PersonalDevelopmentRow>) => {
        if (!params.value) {
          return null;
        }
        return (
          <>
            <PersonalDevelopmentStatus
              status={params.row.status}
            />
          </>
        );
      },
    },
  ];
  const rows: PersonalDevelopmentRow[] = useMemo(() => data?.map((personalDevelopmentPlan) => ({
    id: personalDevelopmentPlan.id.toString(),
    owner: personalDevelopmentPlan.owner,
    name: personalDevelopmentPlan.name,
    itemsCompleted: {
      milestonesCompleted: personalDevelopmentPlan.milestonesCompleted,
      milestonesTotal: personalDevelopmentPlan.milestonesTotal,
    },
    itemDue: personalDevelopmentPlan.nextResource,
    role: personalDevelopmentPlan.role ? personalDevelopmentPlan.role?.description : 'N/A' as PDPRoleType,
    status: personalDevelopmentPlan.status,
  })) ?? [], [data]);

  const history = useHistory();
  const onRowClick = useCallback((params: GridRowParams<PersonalDevelopmentRow>) => {
    const phpId = params.id as string;
    const url = `${DevelopmentPlanRoutes.ViewById.replace(':pdpId', phpId)}?tab=${COMPETENCY_RESOURCE_TABS[0].value}`;
    history.push(url);
  }, [history]);

  const hookProps = {
    rows,
    columns: tableColumnHeaders,
    onRowClick,
    onSortModelChange,
    sortByField,
    sortByOrder,
    isFetching,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default SharedTable;
