import { css } from '@emotion/react';
import { OrgUser } from '@josh-hr/types';
import moment from 'moment';
import CareCardAvatar from '~Common/V3/components/CareCardAvatar';
import HTMLRenderer from '~Common/V3/components/HTML/HTMLRenderer';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { palette } from '~Common/styles/colors';
import { Comment } from '~DevelopmentPlan/const/types';

const styles = {
  commentContainer: css({
    width: '100%',
    gap: '1rem',
    borderRadius: '.3125rem',
    padding: '1.5rem',
    backgroundColor: palette.neutrals.white,
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
    height: '100%',
  }),
  nameContainer: css({
    display: 'flex',
    color: palette.neutrals.gray800,
    fontSize: '.875rem',
    fontWeight: 500,
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'column',
    lineHeight: '1rem',
  }),
  commentorType: css({
    color: palette.neutrals.gray700,
    fontWeight: 400,
  }),
  created: css({
    color: palette.neutrals.gray700,
    width: '100%',
    fontStyle: 'italic',
    fontSize: '.875rem',
    marginTop: '.75rem',
    fontWeight: 400,
  }),
  comment: css({
    fontSize: '1rem',
    color: palette.neutrals.gray800,
    fontWeight: 500,
    width: '100%',
  }),
  icon: css({
    color: palette.brand.green,
    marginRight: '.25rem',
    fontSize: '.75rem',
  }),
  creatorContainer: css({
    display: 'flex',
    gap: '.5rem',
    marginTop: '.5rem',
    alignSelf: 'flex-end',
  }),
};

interface ViewProps {
  comment: Comment,
  created: string,
  name: string,
  showBlankState: boolean,
  missingPerson?: OrgUser,
  returnPersonPostion: (id: string) => string,
}

const View = ({
  comment,
  created,
  name,
  showBlankState,
  missingPerson,
  returnPersonPostion,
}: ViewProps): JSX.Element => (
  <>
    <div
      css={styles.commentContainer}
    >
      <div
        css={styles.commentBody}
      >
        {comment.content.length > 0 && (
          <HTMLRenderer css={styles.comment} htmlText={comment.content} />
        )}
        {comment.content.length === 0 && (
          <div css={styles.comment}>Waiting for response</div>
        )}
        {!showBlankState && (
        <div
          css={styles.created}
        >
          {created}
        </div>
        )}
        <div
          css={styles.creatorContainer}
        >
          <CareCardAvatar
            id={showBlankState ? missingPerson?.orgUserId : comment.createdBy.orgUserId}
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
            css={styles.nameContainer}
          >
            <div>
              {name}
            </div>
            <div
              css={styles.commentorType}
            >
              {showBlankState && (
                returnPersonPostion(missingPerson?.orgUserId ?? '')
              )}
              {!showBlankState && (
                returnPersonPostion(comment.createdBy.orgUserId)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

interface FinalThoughtCommentProps {
  comment: Comment,
  ownerId: string,
  showBlankState?: boolean,
  missingPerson?: OrgUser,
  mentorId: string,
}

export const FinalThoughtComment = ({
  comment,
  ownerId,
  showBlankState = false,
  missingPerson,
  mentorId,
}: FinalThoughtCommentProps): JSX.Element => {
  const created = moment.utc(comment.createdDate).local().format('MMMM Do YYYY [at] h:mm:ss a');
  const commentName = `${comment.createdBy.firstName} ${comment.createdBy.lastName}`;
  const missingPersonName = `${missingPerson?.firstName ?? ''} ${missingPerson?.lastName ?? ''}`;
  const name = showBlankState ? missingPersonName : commentName;

  const returnPersonPostion = (id: string): string => {
    if (id === ownerId) {
      return 'Plan Owner';
    }
    if (id === mentorId) {
      return 'Mentor';
    }
    return '';
  };

  const hookProps = {
    comment,
    created,
    name,
    showBlankState,
    missingPerson,
    returnPersonPostion,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
