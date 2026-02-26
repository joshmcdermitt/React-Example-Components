import { css } from '@emotion/react';
import { CommentBlock } from '~DevelopmentPlan/components/Shared/CommentBlock';
import { Comment, PDPPermissions } from '~DevelopmentPlan/const/types';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { CardSkeleton } from '~Common/V3/components/Card';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import AddComment from './AddComment';

const styles = {
  createCommentButton: css({
    marginTop: '.75rem',
  }),
  cardSkeleton: css({
    height: '3.3125rem',
    maxWidth: '100%',
    marginBottom: '.75rem',
  }),
  commentWrapper: css({
    maxHeight: '22.5rem',
    overflowY: 'hidden',
    overflowX: 'hidden',
    gap: '0.25rem',
    display: 'flex',
    flexDirection: 'column',

    ':hover': {
      overflowY: 'auto',
    },
  }),
};

interface ViewProps {
  filteredComments: Comment[] | undefined,
  showSkeleton: boolean,
  canComment: boolean,
}

const View = ({
  filteredComments,
  showSkeleton,
  canComment,
}: ViewProps): JSX.Element => (
  <>
    {showSkeleton && (
    <MultipleSkeletonLoaders
      numberOfSkeletons={5}
      renderSkeletonItem={() => (
        <CardSkeleton css={styles.cardSkeleton} />
      )}
    />
    )}
    <div
      id="commentWrapper"
      css={styles.commentWrapper}
    >
      {!showSkeleton && filteredComments && filteredComments.map((comment) => (
        <CommentBlock
          key={comment.id}
          comment={comment}
        />
      ))}
    </div>
    {!showSkeleton && canComment && (
    <AddComment />
    )}
  </>
);

interface CommentsAreaProps {
  comments: Comment[] | undefined,
  showSkeleton: boolean,
}

export const CommentsArea = ({
  comments,
  showSkeleton,
}: CommentsAreaProps): JSX.Element => {
  const {
    planPermissions,
  } = useStoreParams((state) => ({
    planPermissions: state.planPermissions,
  }));

  const canComment = planPermissions.includes(PDPPermissions.CanComment);
  const filteredComments = comments?.filter((comment) => comment.isFinalThought !== true);

  const hookProps = {
    filteredComments,
    showSkeleton,
    canComment,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
