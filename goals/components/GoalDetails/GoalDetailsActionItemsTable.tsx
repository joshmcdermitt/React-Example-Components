import { css } from '@emotion/react';
import {
  MouseEvent,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { faCircleCheck } from '@fortawesome/pro-solid-svg-icons';
import { faCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '~Common/components/Tooltip';
import {
  DataGrid,
  DataGridProps,
  GridColumns,
  GridRenderCellParams,
  GridRowParams,
} from '@mui/x-data-grid';
import { usePagination } from '~Common/hooks/usePagination';
import { palette } from '~Common/styles/colors';
import {
  ActionItem, NewActionItemStatus,
} from '~ActionItems/const/interfaces';
import ActionItemStatus from '~ActionItems/components/ActionItemStatus';
import Pagination, { PaginationProps } from '~Common/V3/components/Pagination';
import { createEditActionItemTemplate } from '~ActionItems/components/Drawers/CreateEditActionItemDrawer';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { useEditActionItem } from '~ActionItems/hooks/useEditActionItem';
import { faArrowsRepeat, faMessage } from '@fortawesome/pro-light-svg-icons';
import { getDateString } from '~Common/utils/dateString';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import {
  SelectChangeEvent,
} from '@mui/material';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { CardSkeleton } from '~Common/V3/components/Card';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import { Goals } from '@josh-hr/types';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { useDrawerActions } from '~Common/hooks/useDrawers';

const ACTION_ITEMS_PAGE_SIZE = 25;

const styles = {
  actionItemsTable: css({
    color: palette.neutrals.gray800,
    border: 0,
    marginBottom: '1.5rem',
    borderBottom: `1px solid ${palette.neutrals.gray300} !important`,

    // :nth-child' unsafe server-side rendering
    '.MuiDataGrid-cell:nth-of-type(-n+2)': {
      paddingLeft: 0,
    },
    '.MuiDataGrid-columnSeparator': {
      display: 'none',
    },

    '.MuiDataGrid-columnHeaders': {
      display: 'none',
    },
    '.MuiDataGrid-root, .MuiDataGrid-cell:focus-within': {
      outline: 'none !important',
    },
    '.MuiDataGrid-virtualScroller ': {
      marginTop: '.5rem !important',
      borderTop: `1px solid ${palette.neutrals.gray300} !important`,
    },
  }),
  completedIconButton: css({
    backgroundColor: 'transparent',
    padding: 0,
    border: 0,

    // Flex needed to align the icon vertically
    display: 'flex',
  }),
  completedIcon: (isComplete: boolean) => css({
    height: '1.25rem',
    width: '1.25rem',
    color: isComplete ? palette.brand.indigo : palette.neutrals.gray400,
  }),
  assigneeField: css({
    display: 'flex',
    alignItems: 'center',
  }),
  dueDate: (hasDueDate?: boolean, isPastDue?: boolean, isSoon?: boolean, isCompleted?: boolean) => {
    let color = 'inherit';

    if (!hasDueDate) {
      color = palette.neutrals.gray300;
    } else if (isCompleted) {
      color = palette.neutrals.gray700;
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
  recurrenceIcon: css({
    color: palette.neutrals.gray500,
  }),
  skeleton: css({
    width: '100%',
    maxWidth: '100%',
    height: '5rem',
    transform: 'initial',
  }),
  commentIcon: css({
    marginRight: '0.25rem',
  }),
  descritionWrap: (isMobile: boolean) => css({
    display: 'flex',
    flexDirection: 'column',
    gap: 0,

  }, isMobile && ({
    width: '150px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  })),
  description: css({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
  skellyLoader: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '.25rem',
    marginTop: '.75rem',
    marginBottom: '1.5rem',
  }),
  cardSkeleton: css({
    maxWidth: '100%',
    height: '3.125rem',
  }),
};

export interface ActionItemRowAssignee {
  orgUserId: string,
}

export interface ActionItemRowDueDate {
  dueDate: number,
  isRecurring: boolean,
  isCompleted: boolean,
}

interface ActionItemRowCompleted {
  completed: boolean,
  creatorId: string,
  assigneeId: string,
  goalOwnerId: string,
}

export interface ActionItemRow {
  id: string,
  completed: ActionItemRowCompleted,
  text: string,
  assignee: ActionItemRowAssignee,
  dueDate: ActionItemRowDueDate,
  status: NewActionItemStatus,
}

export interface ViewProps extends Omit<DataGridProps<ActionItemRow>, 'page' | 'onPageChange'>, Omit<PaginationProps, 'onError' | 'onResize'> {
  showSkeleton: boolean,
  handlePageChange: (event: SelectChangeEvent<number>) => void,
}

const View = ({
  showSkeleton,
  rows,
  columns,
  pageSize,
  page,
  handlePageChange,
  numberOfPages,
  onPreviousClick,
  onNextClick,
  onRowClick,
}: ViewProps): JSX.Element => (
  <>
    {showSkeleton && (
      <MultipleSkeletonLoaders
        css={styles.skellyLoader}
        numberOfSkeletons={5}
        renderSkeletonItem={() => (
          <CardSkeleton css={styles.cardSkeleton} />
        )}
      />
    )}

    {!showSkeleton && (
      <>
        {rows.length > 0 && (
          <>
            <DataGrid
              css={styles.actionItemsTable}
              page={page - 1}
              autoHeight
              columns={columns}
              disableColumnFilter
              disableColumnMenu
              disableSelectionOnClick
              headerHeight={0}
              rowHeight={56}
              hideFooter
              pageSize={pageSize}
              rows={rows}
              onRowClick={onRowClick}
            />
            {numberOfPages > 1 && (
            <Pagination
              page={page}
              onPageChange={handlePageChange}
              numberOfPages={numberOfPages}
              onPreviousClick={onPreviousClick}
              onNextClick={onNextClick}
            />
            )}
          </>
        )}
      </>
    )}
  </>
);

interface GoalDetailsActionItemsTableProps {
  actionItems: ActionItem[] | undefined,
  isLoading: boolean,
  page: number,
  setPage: (page: number) => void,
  goalCreatorId: string,
  goalOwnerId: string | undefined,
  participants: Goals.GoalParticipant[] | undefined,
}

const GoalDetailsActionItemsTable = ({
  actionItems,
  isLoading,
  page,
  setPage,
  goalCreatorId,
  goalOwnerId,
  participants,
}: GoalDetailsActionItemsTableProps): JSX.Element => {
  const { pushDrawer } = useDrawerActions();
  const [showSkeleton] = useSkeletonLoaders(isLoading);
  const { mutate: doEditActionItem } = useEditActionItem({});
  const isMobile = useIsMobileQuery();
  // will use this when we do mobile styling
  // const isTablet = useIsTabletQuery();

  const usePaginationProps = usePagination({
    totalCount: actionItems?.length ?? 0,
    pageSize: ACTION_ITEMS_PAGE_SIZE,
    page,
    setPage,
  });

  const [paginationModel, setPaginationModel] = useState({
    pageSize: ACTION_ITEMS_PAGE_SIZE,
    page,
  });

  useEffect(() => {
    setPaginationModel({
      pageSize: ACTION_ITEMS_PAGE_SIZE,
      page,
    });
  }, [page]);

  const handlePageChange = (event: SelectChangeEvent<number>): void => {
    setPage(event.target.value as number);
  };

  const onClick = useCallback((e: MouseEvent, id: string, status: NewActionItemStatus) => {
    // Prevent the click event from bubbling to the row and opening the edit drawer
    e.stopPropagation();

    if (id) {
      doEditActionItem({
        id,
        actionItem: {
          status: status === NewActionItemStatus.Completed ? NewActionItemStatus.ToDo : NewActionItemStatus.Completed,
        },
      });
    }
  }, [doEditActionItem]);

  const tableColumnHeaders: GridColumns<ActionItemRow> = [
    {
      field: 'completed',
      headerName: '',
      width: 40,
      sortable: false,
      align: 'left',
      renderCell: (params: GridRenderCellParams<ActionItemRowCompleted, ActionItemRow>) => {
        const completed = params.value?.completed;
        if (params.value === undefined) {
          return null;
        }
        const canComplete = params.value.creatorId === getOrganizationUserId()
        || params.value.goalOwnerId === getOrganizationUserId()
        || params.value.assigneeId === getOrganizationUserId();

        return (
          <>
            {!canComplete && (
            <Tooltip content="You do not have permission to complete this action item.">
              <div>
                <button
                  css={styles.completedIconButton}
                  type="button"
                  onClick={(e) => onClick(e, params.row.id, params.row.status)}
                  data-test-id="actionItemsCompleteButton"
                  disabled={!canComplete}
                >
                  <FontAwesomeIcon
                    css={styles.completedIcon(completed ?? false)}
                    icon={completed ? faCircleCheck : faCircle}
                  />
                </button>
              </div>
            </Tooltip>
            )}
            {canComplete && (
            <button
              css={styles.completedIconButton}
              type="button"
              onClick={(e) => onClick(e, params.row.id, params.row.status)}
              data-test-id="actionItemsCompleteButton"
              disabled={!canComplete}
            >
              <FontAwesomeIcon
                css={styles.completedIcon(completed ?? false)}
                icon={completed ? faCircleCheck : faCircle}
              />
            </button>
            )}

          </>
        );
      },
    },
    {
      field: 'text',
      headerName: 'Action Item',
      flex: 1,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<string, ActionItemRow>) => {
        if (!params.value) {
          return null;
        }

        return (
          <div css={styles.descritionWrap(isMobile)}>
            <div css={styles.description}>
              {params.value}
            </div>
            {isMobile && (
              <ActionItemStatus status={params.row.status} />
            )}
          </div>
        );
      },
    },
    {
      field: 'commentCount',
      headerName: '',
      maxWidth: 75,
      sortable: false,
      hide: isMobile,
      renderHeader: () => (
        <FontAwesomeIcon
          icon={faMessage}
        />
      ),
      renderCell: (params: GridRenderCellParams<ActionItemRowAssignee, ActionItemRow>) => {
        if (!params.value) {
          return '';
        }

        return (
          <>
            <FontAwesomeIcon
              icon={faMessage}
              css={styles.commentIcon}
            />
            {params.value}
          </>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      hide: isMobile,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<NewActionItemStatus>) => {
        if (!params.value) {
          return null;
        }

        return (
          <ActionItemStatus status={params.value} />
        );
      },
    },
    {
      field: 'dueDate',
      headerName: 'Date Completed',
      minWidth: 175,
      renderCell: (params: GridRenderCellParams<ActionItemRowDueDate, ActionItemRow>) => {
        const { dueDate = 0, isRecurring = false, isCompleted } = params.value ?? {};
        const {
          dateString,
          isPast,
          isToday,
          isTomorrow,
        } = getDateString({ timestamp: dueDate });

        const hasDueDate = dueDate > 0;
        return (
          <div>
            <div css={styles.dueDate(hasDueDate, !!isPast, isToday || isTomorrow, isCompleted)}>
              { dateString ?? 'No due date' }
              {isRecurring && (
                <FontAwesomeIcon css={styles.recurrenceIcon} icon={faArrowsRepeat} flip="horizontal" />
              )}
            </div>
          </div>
        );
      },
    },
    {
      field: 'assignee',
      headerName: 'Assignee',
      maxWidth: 50,
      flex: 1,
      sortable: false,
      hide: isMobile,
      renderCell: (params: GridRenderCellParams<ActionItemRowAssignee, ActionItemRow>) => {
        if (!params.value) {
          return null;
        }

        const {
          orgUserId,
        } = params.value;

        return (
          <BaseAvatar
            orgUserId={orgUserId ?? null}
            avatarSize={30}
          />
        );
      },
    },
  ];

  const rows: ActionItemRow[] = useMemo(() => actionItems?.map((actionItem: ActionItem) => ({
    id: actionItem.id,
    completed: {
      completed: actionItem.status === NewActionItemStatus.Completed,
      creatorId: actionItem.creatorId,
      assigneeId: actionItem.assigneeId,
      goalOwnerId: goalOwnerId ?? '',
    },
    text: actionItem.text,
    assignee: {
      orgUserId: actionItem.assigneeId,
    },
    dueDate: { dueDate: actionItem.dueDateInMillis, isRecurring: actionItem.isRecurring, isCompleted: actionItem.status === NewActionItemStatus.Completed },
    completedDate: { dueDate: actionItem.completedInMillis, isRecurring: actionItem.isRecurring },
    status: actionItem.status,
    commentCount: actionItem.commentCount,
  })) ?? [], [actionItems, goalOwnerId]);

  const { isAdmin } = useUserPermissions();

  const onActionItemSelection = useCallback((params: GridRowParams<ActionItemRow>) => {
    const currentUserOrgId = getOrganizationUserId();
    const hasAdminPermission = goalCreatorId === currentUserOrgId || goalOwnerId === currentUserOrgId;
    const canDeleteActionItemsOnly = isAdmin && !hasAdminPermission;
    const { assigneeId } = params.row.completed;
    const collaborators = participants
      ?.filter((participant) => participant.role === Goals.GoalParticipantRole.Collaborator)
      ?.map((participant) => participant.orgUserId);
    const currentUserIsCollaborator = collaborators?.includes(currentUserOrgId as string);
    const canComment = hasAdminPermission
    || assigneeId === currentUserOrgId
    || currentUserIsCollaborator
    || isAdmin;

    pushDrawer({
      drawer: {
        ...createEditActionItemTemplate,
        args: {
          id: params.row.id,
          hasAdminPermission,
          canDeleteActionItemsOnly,
          canComment,
        },
      },
    });
  }, [goalCreatorId, goalOwnerId, isAdmin, participants, pushDrawer]);

  const onCreateActionItemClick = useCallback(() => {
    pushDrawer({
      drawer: {
        ...createEditActionItemTemplate,
      },
    });
  }, [pushDrawer]);

  const hookProps = {
    rows,
    columns: tableColumnHeaders,
    pageSize: ACTION_ITEMS_PAGE_SIZE,
    onRowClick: onActionItemSelection,
    onCreateActionItemClick,
    page,
    showSkeleton,
    handlePageChange,
    paginationModel,
    setPaginationModel,
    ...usePaginationProps,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default GoalDetailsActionItemsTable;
