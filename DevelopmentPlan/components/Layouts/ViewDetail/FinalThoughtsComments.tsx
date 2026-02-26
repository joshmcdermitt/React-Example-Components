import { css } from '@emotion/react';
import { OrgUser } from '@josh-hr/types';
import { FinalThoughtComment } from '~DevelopmentPlan/components/Shared/FinalThoughtComment';
import { DEFAULT_COMMENT } from '~DevelopmentPlan/const/defaults';
import { analyzeFinalThoughts } from '~DevelopmentPlan/const/functions';
import { PDP, Comment } from '~DevelopmentPlan/const/types';

const styles = {
  commentsWrapper: (isOpened: boolean) => css({
    width: '100%',
    display: 'flex',
    gap: '1rem',
    height: isOpened ? 'auto' : 0,
    overflow: 'hidden',
    transition: 'height 0.5s ease-in-out',
  }),
};

interface ViewProps {
  finalThoughts?: Comment[],
  ownerId: string,
  isOpened: boolean,
  showBlankState: boolean,
  missingPerson?: OrgUser,
  mentorId: string,
}

const View = ({
  finalThoughts,
  ownerId,
  isOpened,
  showBlankState,
  missingPerson,
  mentorId,
}: ViewProps): JSX.Element => (
  <>
    <div
      css={styles.commentsWrapper(isOpened)}
    >
      {finalThoughts && finalThoughts.map((comment) => (
        <FinalThoughtComment
          key={comment.id}
          comment={comment}
          ownerId={ownerId}
          mentorId={mentorId}
        />
      ))}
      {showBlankState && (
      <FinalThoughtComment
        comment={DEFAULT_COMMENT as Comment}
        ownerId={ownerId}
        missingPerson={missingPerson}
        showBlankState
        mentorId={mentorId}
      />
      )}
    </div>
  </>
);

export interface FinalThoughtsCommentsProps {
  isOpened: boolean,
  finalThoughts: Comment[] | undefined,
  plan: PDP | undefined,
}

export const FinalThoughtsComments = ({
  isOpened,
  finalThoughts,
  plan,
}: FinalThoughtsCommentsProps): JSX.Element => {
  const { owner, mentor } = plan || {};
  const ownerId = owner?.orgUserId ?? '';
  const mentorId = mentor?.orgUserId ?? '';

  const {
    showBlankState,
    missingPerson,
  } = analyzeFinalThoughts(finalThoughts, mentor, owner);

  const hookProps = {
    finalThoughts,
    ownerId,
    isOpened,
    showBlankState,
    missingPerson,
    mentorId,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
