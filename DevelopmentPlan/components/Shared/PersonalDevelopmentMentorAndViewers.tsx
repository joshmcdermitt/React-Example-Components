import { css } from '@emotion/react';
import { OrgUser } from '@josh-hr/types';
import CareCardAvatar from '~Common/V3/components/CareCardAvatar';
import SkeletonLoader from '~Common/components/SkeletonLoader';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import AvatarMaybeMultipleMaybeNot from '~Common/V3/AvatarMaybeMultipleMaybeNot';
import OverflowAvatar, { OverflowAvatarProps } from '~Common/V3/AvatarMaybeMultipleMaybeNot/OverflowAvatar';
import { PersonDisplayInformation } from '~Common/const/interfaces';
import { palette } from '~Common/styles/colors';
import { baseballCardDrawerTemplate } from '~People/BaseballCard/Drawers/BaseballCardDrawer';
import { useDrawerActions } from '~Common/hooks/useDrawers';

const styles = {
  containerWrapper: css({
    display: 'flex',
    gap: '1.875rem',
  }),
  avatars: css({
    display: 'flex',
    gap: '.25rem',
  }),
  timelineSubtitle: css({
    fontSize: '.875rem',
    fontWeight: 400,
    color: palette.neutrals.gray800,
    width: '100%',
  }),
  mentorName: css({
    fontWeight: 500,
    marginLeft: '.5rem',
    width: 'auto',
  }),
  mentorWrapper: css({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  }),
};

interface ViewProps {
  mentorOrgId: string,
  mentorName: string,
  viewers: OrgUser[] | undefined,
  numberOfUsersAssigned: number,
  onPersonClick: (orgUserId: string | undefined) => void,
}

const View = ({
  mentorOrgId,
  mentorName,
  viewers,
  numberOfUsersAssigned,
  onPersonClick,
}: ViewProps): JSX.Element => (
  <>
    <div
      css={styles.containerWrapper}
    >
      {mentorOrgId && (
        <>
          <div
            css={styles.mentorWrapper}
          >
            <div
              css={styles.timelineSubtitle}
            >
              Mentor
            </div>
            <CareCardAvatar
              id={mentorOrgId}
              noBackdrop
              renderAvatar={(imageUrl, fullName, isDeactivated, email, id) => (
                <BaseAvatar
                  orgUserId={id ?? null}
                  avatarSize={22}
                />
              )}
              renderSkeletonLoader={() => (
                <SkeletonLoader
                  width={22}
                  height={22}
                  variant="rectangular"
                  renderComponent={() => <div />}
                />
              )}
            />
            <span
              css={[styles.timelineSubtitle, styles.mentorName]}
            >
              {mentorName}
            </span>
          </div>
          {viewers && viewers.length > 0 && (
          <div>
            <div
              css={styles.timelineSubtitle}
            >
              Viewers
            </div>
            <AvatarMaybeMultipleMaybeNot
              css={styles.avatars}
              usersInfo={viewers as PersonDisplayInformation[]}
              numberOfUsers={numberOfUsersAssigned}
              numberOfUsersToShow={4}
              avatarHeight={22}
              avatarWidth={22}
              renderAvatar={({ user }) => (
                <div
                  onClick={() => onPersonClick(user?.orgUserId)}
                  onKeyDown={() => onPersonClick(user?.orgUserId)}
                  role="button"
                  tabIndex={0}
                >
                  <BaseAvatar
                    orgUserId={user.orgUserId ?? null}
                    avatarSize={22}
                  />
                </div>
              )}
              renderOverflowAvatar={(overflowAvatarProps: OverflowAvatarProps) => (
                <OverflowAvatar
                  {...overflowAvatarProps}
                />
              )}
            />
          </div>
          )}
        </>
      )}
    </div>
  </>
);

interface PersonalDevelopmentMentorAndViewersProps {
  mentor: OrgUser | undefined,
  viewers: OrgUser[] | undefined,
}

const PersonalDevelopmentMentorAndViewers = ({
  mentor,
  viewers,
}: PersonalDevelopmentMentorAndViewersProps): JSX.Element => {
  const mentorOrgId = mentor?.orgUserId ?? '';
  const mentorName = `${mentor?.firstName ?? ''} ${mentor?.lastName ?? ''}`;
  const numberOfUsersAssigned = viewers?.length ?? 0;
  const { pushDrawer } = useDrawerActions();

  const onPersonClick = (orgUserId: string | undefined): void => {
    if (orgUserId !== undefined && orgUserId.trim() !== '') {
      pushDrawer({
        drawer: {
          ...baseballCardDrawerTemplate,
          args: {
            id: orgUserId,
          },
        },
      });
    }
  };

  const hookProps = {
    viewers,
    mentorOrgId,
    mentorName,
    numberOfUsersAssigned,
    onPersonClick,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default PersonalDevelopmentMentorAndViewers;
