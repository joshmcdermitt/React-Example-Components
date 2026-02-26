import { css } from '@emotion/react';
import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { palette } from '~Common/styles/colors';
import { PDP, PDPStatusEnum, Comment } from '~DevelopmentPlan/const/types';
import Tooltip from '~Common/components/Tooltip';
import { convertStringToAddSpacesToCapitalLetters } from '~DevelopmentPlan/const/functions';
import { CardSkeleton } from '~Common/V3/components/Card';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { FinalThoughtBanner } from '../Layouts/ViewDetail/FinalThoughtBanner';

const styles = {
  bannerWrap: css({
    background: palette.brand.indigo,
    color: palette.neutrals.white,
    borderRadius: '0.5rem',
    padding: '.75rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  bannerFocusText: css({
    fontSize: '1.125rem',
    fontWeight: 600,
  }),
  icon: css({
    color: palette.neutrals.white,
    fontSize: '1.125rem',
    cursor: 'pointer',
  }),
  cardSkeleton: css({
    maxWidth: '100%',
    height: '3.1875rem',
  }),
  nonFocusText: css({
    fontWeight: 400,
  }),
};

interface ViewProps {
  isPendingReview: boolean,
  statusText: string,
  mentorName: string,
  showSkeleton: boolean,
  isMentor: boolean,
  ownersName: string,
  isCompleted: boolean | undefined,
  hasFinalThought: boolean,
  plan: PDP | undefined,
  finalThoughts: Comment[] | undefined,
}

const View = ({
  isPendingReview,
  statusText,
  mentorName,
  showSkeleton,
  isMentor,
  ownersName,
  isCompleted,
  hasFinalThought,
  plan,
  finalThoughts,
}: ViewProps): JSX.Element => (
  <>
    {showSkeleton && (
    <CardSkeleton css={styles.cardSkeleton} />
    )}
    {!showSkeleton && (
      <>
        {isCompleted && !hasFinalThought && (
        <div css={styles.bannerWrap}>
          <div css={styles.bannerFocusText}>
            Development Plan Completed
            {' '}
            <span css={styles.nonFocusText}>- Submit Final Thoughts</span>
          </div>
          <div>
            <Tooltip content="Please submit your final thoughts.">
              <div>
                <FontAwesomeIcon
                  css={styles.icon}
                  icon={faCircleInfo}
                />
              </div>
            </Tooltip>
          </div>
        </div>
        )}
        {isPendingReview && (
        <div css={styles.bannerWrap}>
          <div css={styles.bannerFocusText}>
            {isMentor && (
            <>
              Pending Your Review
            </>
            )}
            {!isMentor && (
              <>
                { convertStringToAddSpacesToCapitalLetters(statusText) }
              </>
            )}
          </div>
          <div>
            <Tooltip content={isMentor ? `Please review ${ownersName}'s plan to continue` : `Please have ${mentorName} review your plan to continue`}>
              <div>
                <FontAwesomeIcon
                  css={styles.icon}
                  icon={faCircleInfo}
                />
              </div>
            </Tooltip>
          </div>
        </div>
        )}
        {hasFinalThought && (
          <FinalThoughtBanner
            plan={plan}
            finalThoughts={finalThoughts}
          />
        )}
      </>
    )}
  </>
);

export interface PersonalDevelopmentStatusBannerProps {
  plan: PDP | undefined,
  showSkeleton: boolean,
  finalThoughts: Comment[] | undefined,
}

export const PersonalDevelopmentStatusBanner = ({
  plan,
  showSkeleton,
  finalThoughts,
}: PersonalDevelopmentStatusBannerProps): JSX.Element => {
  const { status, mentor, createdBy } = plan || {};
  const isPendingReview = status?.id === PDPStatusEnum.PendingReview;
  const isCompleted = status?.id === PDPStatusEnum.Completed;
  const statusText = status?.description ?? '';
  const mentorName = `${mentor?.firstName ?? ''} ${mentor?.lastName ?? ''}`;
  const ownersName = `${createdBy?.firstName ?? ''} ${createdBy?.lastName ?? ''}`;
  const userId = getOrganizationUserId() ?? '';
  const isMentor = mentor?.orgUserId === userId;
  const hasFinalThought = finalThoughts ? finalThoughts.length > 0 : false;

  const hookProps = {
    isPendingReview,
    statusText,
    mentorName,
    showSkeleton,
    isMentor,
    ownersName,
    isCompleted,
    finalThoughts,
    hasFinalThought,
    plan,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
