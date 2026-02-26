import { css } from '@emotion/react';
import {
  faCircleCheck, faEllipsisVertical, faPencil, faTrash,
} from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import {
  useCallback, useState, MouseEvent, SyntheticEvent,
} from 'react';
import IconButton from '~Common/V3/components/Buttons/IconButton';
import CareCardAvatar from '~Common/V3/components/CareCardAvatar';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { HoverState, useHoverStateById } from '~Common/hooks/useHoverStateById';
import { hexToRGBA, palette } from '~Common/styles/colors';
import { OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { Comment } from '~DevelopmentPlan/const/types';
import ActionMenu, { MenuItem, useActionMenu } from '~Meetings/components/shared/ActionMenu';
import DeleteConfirmationPopover, { useDeleteConfirmationPopover } from '~Common/V3/components/DeleteConfirmation/DeleteConfirmationPopover';
import DeleteConfirmationButtons from '~Common/V3/components/DeleteConfirmation/DeleteConfirmationButtons';
import { useDeleteComment } from '~DevelopmentPlan/hooks/useDeleteComment';
import { useParams } from 'react-router-dom';
import { queryClient } from '~Common/const/queryClient';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import HTMLRenderer from '~Common/V3/components/HTML/HTMLRenderer';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import { isHTMLText } from '~Common/utils/isHTMLText';
import AddComment from '../Layouts/ViewDetail/AddComment';
import { PersonalDevelopmentPlanDetailsParams } from '../Layouts/ViewDetail/PersonalDevelopmentPlanDetails';

const styles = {
  commentContainer: (isSystemComment: boolean, isOptimisticComment: boolean) => css({
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    gap: '.75rem',
    opacity: isOptimisticComment ? 0.8 : 1,
    backgroundColor: isSystemComment ? hexToRGBA(palette.brand.indigo, 0.05) : 'transparent',
    borderRadius: '.3125rem',
    padding: '.25rem',
    position: 'relative',
  }),
  avatar: css({
    width: '2rem',
    height: '2rem',
  }),
  commentBody: css({
    display: 'flex',
    gap: '.125rem',
    flexDirection: 'row',
    flexWrap: 'wrap',
  }),
  nameContainer: css({
    display: 'flex',
    alignItems: 'center',
    color: palette.neutrals.gray700,
    fontSize: '.75rem',
    fontWeight: 700,
    gap: '.3125rem',
    width: '100%',
  }),
  created: css({
    color: palette.neutrals.gray500,
  }),
  commentWrapper: css({
    width: '100%',
  }),
  comment: (isSystemGenerated: boolean) => css({
    fontSize: '.875rem',
    color: palette.neutrals.gray800,
    fontWeight: 500,
    fontStyle: isSystemGenerated ? 'italic' : 'normal',
    display: 'inline-block',
  }),
  icon: css({
    color: palette.brand.green,
    marginRight: '.25rem',
    fontSize: '.75rem',
  }),
  editIcon: css({
    color: palette.neutrals.gray700,
    marginLeft: '.5rem',
    cursor: 'pointer',
    fontSize: '.875rem',
    display: 'flex',
    background: palette.neutrals.white,

    svg: {
      width: '.75rem !important',
      height: '1.125rem !important',
    },
  }),
  formContainer: css({
    margin: '.25rem 0',
  }),
  actionMenuContainer: css({
    position: 'absolute',
    top: '0',
    right: '.625rem',
  }),
  editedNote: css({
    fontSize: '.75rem',
    color: palette.neutrals.gray500,
    fontWeight: 400,
    fontStyle: 'italic',
    display: 'inline-block',
    marginLeft: '.25rem',
  }),
};

interface ViewProps extends HoverState {
  comment: Comment,
  created: string,
  name: string,
  getsBackgroundTreatment: boolean,
  isSystemGenerated: boolean,
  isApprovalComment: boolean,
  showCommentActionMenu: boolean,
  menuItems: MenuItem[][],
  doOpen: (event: React.MouseEvent<HTMLElement>) => void,
  actionMenuProps: {
    anchorEle: HTMLElement | null;
    onClose: () => void;
  },
  onClickCallback: () => void,
  isEditing: boolean,
  setCommentIdToEdit: (commentId: number) => void,
  anchorEl: HTMLElement | null,
  closeConfirmationPopover: (event: SyntheticEvent<HTMLElement, Event>) => void
  isOpen: boolean,
  popoverId: string | undefined,
  handleConfirmDeletion: () => void,
  onUpdateSuccess: () => void,
  isOptimisticComment: boolean,
  isEdited: boolean,
  editedString: () => string,
}

const View = ({
  comment,
  created,
  name,
  getsBackgroundTreatment,
  isSystemGenerated,
  isApprovalComment,
  handleMouseEnter,
  handleMouseLeave,
  showCommentActionMenu,
  actionMenuProps,
  menuItems,
  doOpen,
  onClickCallback,
  isEditing,
  setCommentIdToEdit,
  anchorEl,
  closeConfirmationPopover,
  isOpen,
  popoverId,
  handleConfirmDeletion,
  onUpdateSuccess,
  isOptimisticComment,
  isEdited,
  editedString,
}: ViewProps): JSX.Element => (
  <>
    {isEditing && (
      <>
        <div
          css={styles.formContainer}
        >
          <AddComment
            isEditing
            comment={comment}
            setCommentIdToEdit={setCommentIdToEdit}
            onUpdateSuccess={onUpdateSuccess}
          />
        </div>
      </>
    )}
    {!isEditing && (
    <div
      css={styles.commentContainer(getsBackgroundTreatment, isOptimisticComment)}
      onMouseEnter={() => handleMouseEnter(comment.id.toString())}
      onMouseLeave={handleMouseLeave}
    >
      <CareCardAvatar
        id={comment.createdBy.orgUserId}
        noBackdrop
        containerStyle={styles.avatar}
        renderAvatar={(imageUrl, fullName, isDeactivated, email, id) => (
          <BaseAvatar
            orgUserId={id ?? null}
            avatarSize={35}
          />
        )}
        renderSkeletonLoader={() => (
          <SkeletonLoader
            width={35}
            height={35}
            variant="rectangular"
            renderComponent={() => <div />}
          />
        )}
      />
      <div
        css={styles.commentBody}
      >
        <div
          css={styles.nameContainer}
        >
          <span>
            {name}
          </span>
          <span
            css={styles.created}
          >
            {created}
          </span>
        </div>
        <div css={styles.commentWrapper}>
          {isSystemGenerated && (
            <div css={styles.comment(isSystemGenerated && !isApprovalComment)}>
              {comment.content}
            </div>
          )}
          {!isSystemGenerated && (
            <>
              {isHTMLText(comment.content) && (
              <HTMLRenderer css={styles.comment(isSystemGenerated && !isApprovalComment)} htmlText={comment.content} />
              )}
              {!isHTMLText(comment.content) && (
                <div css={styles.comment(isSystemGenerated && !isApprovalComment)}>
                  {comment.content}
                </div>
              )}
            </>
          )}
          {isEdited && (
          <div css={styles.editedNote}>{editedString()}</div>
          )}
        </div>
        {isApprovalComment && comment.pdpId !== OPTIMISTIC_ID && (
        <div>
          <FontAwesomeIcon
            css={styles.icon}
            icon={faCircleCheck}
          />
          Plan Reviewed
        </div>
        )}
      </div>
      {showCommentActionMenu && !isOptimisticComment && (
      <div
        css={styles.actionMenuContainer}
      >
        <IconButton
          onClick={doOpen}
          data-test-id="personalDevelopmentCommentsMenu"
          tooltip="Comment Options"
          type="button"
          icon={faEllipsisVertical}
          size="large"
          css={styles.editIcon}
        />
        <ActionMenu
          menuItems={menuItems}
          onClick={onClickCallback}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          {...actionMenuProps}
        />
        <DeleteConfirmationPopover
          closeConfirmationPopover={closeConfirmationPopover}
          open={isOpen}
          popoverId={popoverId}
          anchorEl={anchorEl}
          renderConfirmationButtons={({
            informationStyles,
            optionStyles,
            popoverButtonStyles,
          }) => (
            <DeleteConfirmationButtons
              informationStyles={informationStyles}
              optionStyles={optionStyles}
              popoverButtonStyles={popoverButtonStyles}
              onDelete={handleConfirmDeletion}
            />
          )}
        />
      </div>
      )}
    </div>
    )}
  </>
);

interface CommentBlockProps {
  comment: Comment,
}

export const CommentBlock = ({
  comment,
}: CommentBlockProps): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const {
    isSystemGenerated,
    isApprovalComment,
    createdBy,
    createdDate,
    modifiedDate,
  } = comment;
  const createdStart = moment(createdDate).format('MMM Do');
  const createdEnd = moment(createdDate).format('h:mma');
  const created = `${createdStart} • ${createdEnd}`;
  const name = `${createdBy.firstName} ${createdBy.lastName.charAt(0)}. •`;
  const creatorId = createdBy.orgUserId;
  const isOptimisticComment = comment.id === OPTIMISTIC_ID;
  const isEdited = modifiedDate !== createdDate && !isSystemGenerated;
  const editedString = (): string => {
    const fromNowString = moment(modifiedDate).fromNow();
    if (isOptimisticComment) {
      return '';
    }
    return `(edited ${fromNowString})`;
  };

  const getsBackgroundTreatment = isApprovalComment || isSystemGenerated;

  const [resourceToBeDeleted, setResourceToBeDeleted] = useState<number>(OPTIMISTIC_ID);
  const {
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
    isHoveringId,
  } = useHoverStateById();

  const isFetchingComments = useIsFetching({ queryKey: pdpPlanKeys.comments(pdpId) });
  const isMutatingComments = useIsMutating({ mutationKey: pdpPlanKeys.comments(pdpId) });
  const mutatingComments = isFetchingComments || isMutatingComments;

  const isCommentHovered = isHovering && isHoveringId === comment.id.toString();

  const isCommentCreatedByUser = creatorId === getOrganizationUserId();
  const { isAdmin } = useUserPermissions();
  const showCommentActionMenu = isCommentHovered && !isSystemGenerated && !mutatingComments && (isCommentCreatedByUser || isAdmin);
  const isAdminAndNotCommentor = isCommentHovered && !isSystemGenerated && !mutatingComments && !isCommentCreatedByUser && isAdmin;

  const [commentIdToEdit, setCommentIdToEdit] = useState<number>(0);
  const isEditing = commentIdToEdit === comment.id;

  const {
    anchorEl,
    openConfirmationPopover,
    closeConfirmationPopover,
    isOpen,
    popoverId,
  } = useDeleteConfirmationPopover('commentDeleteConfirmationPopover');

  const { doOpen, close, ...actionMenuProps } = useActionMenu();
  const onClickCallback = useCallback(() => {
    actionMenuProps.onClose();
  }, [actionMenuProps]);
  const menuItems: MenuItem[][] = [[]];
  if (isCommentCreatedByUser) {
    menuItems[0].push({
      text: 'Edit',
      icon: faPencil,
      onClick: () => setCommentIdToEdit(comment.id),
    });
  }
  if (isAdminAndNotCommentor || isCommentCreatedByUser) {
    menuItems[0].push({
      text: 'Delete',
      icon: faTrash,
      onClick: (event: MouseEvent<HTMLElement>) => handleDeleteClick(event),
    });
  }

  const handleDeleteClick = (event: MouseEvent<HTMLElement>): void => {
    openConfirmationPopover(event);
    setResourceToBeDeleted(comment.id);
  };
  const { mutate: deleteCommentMutation } = useDeleteComment();

  const handleConfirmDeletion = (): void => {
    deleteCommentMutation({ id: pdpId, commentId: resourceToBeDeleted.toString() });
    close();
  };

  const onUpdateSuccess = (): void => {
    void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.comments(pdpId) });
    setCommentIdToEdit?.(0);
  };

  const hookProps = {
    comment,
    created,
    name,
    getsBackgroundTreatment,
    isSystemGenerated,
    isApprovalComment,
    isHovering,
    handleMouseEnter,
    handleMouseLeave,
    isHoveringId,
    showCommentActionMenu,
    actionMenuProps,
    menuItems,
    doOpen,
    onClickCallback,
    isEditing,
    setCommentIdToEdit,
    anchorEl,
    closeConfirmationPopover,
    isOpen,
    popoverId,
    handleConfirmDeletion,
    onUpdateSuccess,
    isOptimisticComment,
    isEdited,
    editedString,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
