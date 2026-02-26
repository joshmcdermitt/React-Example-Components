import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { PDP, Comment } from '~DevelopmentPlan/const/types';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { useState } from 'react';
import CareCardAvatar from '~Common/V3/components/CareCardAvatar';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { FinalThoughtsComments } from './FinalThoughtsComments';

const styles = {
  bannerWrap: css({
    background: palette.brand.indigo,
    color: palette.neutrals.white,
    borderRadius: '0.5rem',
    padding: '.75rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1.125rem',
  }),
  bannerFocusText: css({
    fontSize: '1.125rem',
    fontWeight: 600,
  }),
  icon: css({
    color: palette.neutrals.white,
    fontSize: '2rem',
    cursor: 'pointer',
    fontWeight: 600,
    gap: 'unset',
  }),
  avatar: css({
    width: '2rem',
    height: '2rem',
  }),
  rightSide: css({
    display: 'flex',
    gap: '.625rem',
    alignItems: 'center',
  }),
  avatarWrapper: css({
    display: 'flex',
    gap: '.5rem',
  }),
};

interface ViewProps {
  handleToggleClick: () => void,
  isOpened: boolean,
  finalThoughts: Comment[] | undefined,
  plan: PDP | undefined,
}

const View = ({
  handleToggleClick,
  isOpened,
  finalThoughts,
  plan,
}: ViewProps): JSX.Element => (
  <>
    <div css={styles.bannerWrap}>
      <div css={styles.bannerFocusText}>
        Final Thoughts
      </div>
      <div
        css={styles.rightSide}
      >
        <div
          css={styles.avatarWrapper}
        >
          {finalThoughts && finalThoughts.map((comment) => (
            <CareCardAvatar
              key={comment.id}
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
          ))}
        </div>
        <JoshButton
          name="toggleFinalThoughts"
          data-test-id="toggleFinalThoughts"
          onClick={handleToggleClick}
          variant="icon"
        >
          <JoshButton.IconAndText
            icon={isOpened ? faChevronUp : faChevronDown}
            text=""
            css={styles.icon}
          />
        </JoshButton>
      </div>
      <FinalThoughtsComments
        isOpened={isOpened}
        finalThoughts={finalThoughts}
        plan={plan}
      />
    </div>
  </>
);

export interface FinalThoughtBannerProps {
  plan: PDP | undefined,
  finalThoughts: Comment[] | undefined,
}

export const FinalThoughtBanner = ({
  plan,
  finalThoughts,
}: FinalThoughtBannerProps): JSX.Element => {
  const [isOpened, setIsOpened] = useState(false);

  const handleToggleClick = (): void => {
    setIsOpened(!isOpened);
  };

  const hookProps = {
    handleToggleClick,
    isOpened,
    finalThoughts,
    plan,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
