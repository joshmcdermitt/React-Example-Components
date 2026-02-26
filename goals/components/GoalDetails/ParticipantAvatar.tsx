import { css } from '@emotion/react';
import AvatarMaybeMultipleMaybeNot from '~Common/V3/AvatarMaybeMultipleMaybeNot';
import OverflowAvatar, { OverflowAvatarProps } from '~Common/V3/AvatarMaybeMultipleMaybeNot/OverflowAvatar';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { PersonDisplayInformation } from '~Common/const/interfaces';
import { palette } from '~Common/styles/colors';
import { participantViewerTemplate } from '~Meetings/components/drawers/ParticipantViewer';
import { baseballCardDrawerTemplate } from '~People/BaseballCard/Drawers/BaseballCardDrawer';
import { forMobileObject, forTabletObject, withoutDesktopObject } from '~Common/styles/mixins';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { useDrawerActions } from '~Common/hooks/useDrawers';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';

const styles = {
  avatars: (isDrawer: boolean) => css({
    marginTop: '.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
    gridGap: '.5rem',
    minWidth: '22.8125rem',
  }, forTabletObject({
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    minWidth: '11.375rem',
  }), forMobileObject({
    gap: '.25rem',
    minWidth: '18.75rem',
  }), isDrawer && {
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
  }),
  defaultMessage: css({
    color: palette.neutrals.gray700,
    fontSize: '.875rem',
    marginTop: '.5rem',
  }),
  avatarSkelly: css({
    height: '2.1875rem',
    width: '2.1875rem',
  }),
  showAllAttendees: css({
    textTransform: 'uppercase',
    position: 'absolute',
    top: '.9375rem',
    right: 0,
    fontSize: '.6875rem',
    color: palette.brand.indigo,
    fontWeight: 500,
  }, withoutDesktopObject({
    top: '0',
    right: '.3125rem',
  })),
};

interface ParticipantAvatarProps {
  isDrawer: boolean,
  usersInfo: PersonDisplayInformation[],
  usersCount: number,
  numberOfUsersToShow: number,
  onPersonClick: (orgUserId: string) => void,
}

export function ParticipantAvatar({
  isDrawer,
  usersInfo,
  usersCount,
  numberOfUsersToShow,
  onPersonClick,
}: ParticipantAvatarProps): JSX.Element {
  const { pushDrawer } = useDrawerActions();
  const attendees = usersInfo.map((user) => user.orgUserId ?? '');
  const isMobile = useIsMobileQuery();
  const { featureNamesText } = useGetFeatureNamesText();

  const showAllAttendeeClick = (): void => {
    pushDrawer({
      drawer: {
        ...participantViewerTemplate,
        args: {
          onSelect: (participantId: string) => {
            pushDrawer({
              drawer: {
                ...baseballCardDrawerTemplate,
                args: {
                  id: participantId,
                  backdropStyles: css({
                    backdropFilter: 'none',
                    position: 'unset',
                    width: 0,
                    height: 0,
                  }),
                },
              },
            });
          },
          useOrgIds: true,
          allowSelf: true,
          customFilter: attendees,
          title: `${featureNamesText.goals.singular} Participants`,
        },
      },
    });
  };
  return (
    <>
      {usersInfo.length > numberOfUsersToShow && (
      <JoshButton
        css={styles.showAllAttendees}
        onClick={showAllAttendeeClick}
        variant="text"
        data-test-id="show-all-attendees"
      >
        VIEW ALL
      </JoshButton>
      )}
      <AvatarMaybeMultipleMaybeNot
        css={styles.avatars(isDrawer)}
        usersInfo={usersInfo}
        numberOfUsers={usersCount}
        numberOfUsersToShow={numberOfUsersToShow}
        avatarHeight={isMobile ? 30 : 35}
        avatarWidth={isMobile ? 30 : 35}
        renderAvatar={({ user }) => (
          <div
            key={user.orgUserId}
            onClick={() => onPersonClick(user.orgUserId ?? '')}
            onKeyDown={() => onPersonClick(user.orgUserId ?? '')}
            tabIndex={0}
            role="button"
          >
            <BaseAvatar
              orgUserId={user.orgUserId ?? null}
              avatarSize={isMobile ? 30 : 35}
            />
          </div>
        )}
        renderOverflowAvatar={(overflowAvatarProps: OverflowAvatarProps) => (
          <OverflowAvatar
            onClick={showAllAttendeeClick}
            {...overflowAvatarProps}
          />
        )}
      />
    </>
  );
}
