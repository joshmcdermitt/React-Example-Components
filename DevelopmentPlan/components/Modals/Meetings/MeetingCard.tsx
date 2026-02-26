/* eslint-disable max-len */
import { css } from '@emotion/react';
import { ChangeEvent, useMemo } from 'react';
import { palette } from '~Common/styles/colors';
import { useFrequencyString } from '~Meetings/hooks/useFrequencyString';
import { Person, PersonDisplayInformation } from '~Common/const/interfaces';
import AvatarMaybeMultipleMaybeNot, { isNonLeadrUser } from '~Common/V3/AvatarMaybeMultipleMaybeNot';
import OverflowAvatar, { OverflowAvatarProps } from '~Common/V3/AvatarMaybeMultipleMaybeNot/OverflowAvatar';
import { useGetPeople } from '~Common/hooks/people/useGetPeople';
import BaseAvatar from '~Common/components/Users/Avatars/v2/BaseAvatar';
import { NonLeadrUser } from '~Common/const/classes';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { modalExistingItemStyles } from '~DevelopmentPlan/const/pageStyles';
import { CompetencyResourceStatusEnum, Meeting } from '~DevelopmentPlan/const/types';
import moment from 'moment';
import { DEFAULT_DATE } from '~DevelopmentPlan/const/defaults';
import DrawerDropdown from '~Deprecated/ui/components/Inputs/DrawerDropdown';
import Tooltip from '~Common/components/Tooltip';

type MeetingInstanceOption = {
  text: string;
  value: string;
};

const styles = {
  ...modalExistingItemStyles,
  meetingResource: css({
    maxHeight: 'unset !important',
  }),
  resourcOverWrite: (isSelected: boolean) => css({
  }, isSelected && {
    border: `1px solid ${palette.brand.blue}`,
    color: palette.brand.blue,

    ':hover': {
      border: `1px solid ${palette.brand.blue}`,
      color: palette.brand.blue,
    },
  }),
  resourceMeeting: css({
    width: '100%',
  }),
  joshCard: (isSelected: boolean) => css({
    cursor: 'pointer',
    flexWrap: 'wrap',
    background: 'none !important',
    boxShadow: 'none',
    marginBottom: '.5rem',
    border: `1px solid ${palette.neutrals.gray100} !important`,
  }, isSelected && {
    border: `1px solid ${palette.brand.blue} !important`,
    color: palette.brand.blue,

    ':hover': {
      border: `1px solid ${palette.brand.red} !important`,
      color: palette.brand.red,

      button: {
        background: 'none',
      },
    },
  }),
  avatarContainer: css({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  }),
  avatar: css({
    '&:not(:last-child)': {
      marginRight: '.25rem',
    },
  }),
  cardBody: css({
    marginTop: '0.75rem',
    width: '100%',
  }),
  subText: css({
    fontWeight: 400,
  }),
  tooltipText: css({
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    display: 'inline-block',
  }),
  tooltipcontentspace: css({
    marginBottom: '0.75rem',
  }),
};

const numberOfMeetingAttendeesToShow = 4;

interface ViewProps {
  title: string,
  avatarList: (PersonDisplayInformation | NonLeadrUser)[],
  owner: Person | undefined,
  meetingFrequency: string,
  numberOfMeetingAttendees: number,
  isSelected: boolean,
  meetingFactoryId: string,
  meetingInstanceOptions: MeetingInstanceOption[],
  onMeetingInstanceSelect: (e: ChangeEvent<HTMLInputElement>) => void,
  onMeetingClick: (meetingId: string) => void,
}

const View = ({
  title,
  avatarList,
  owner,
  meetingFrequency,
  numberOfMeetingAttendees,
  isSelected,
  meetingFactoryId,
  meetingInstanceOptions,
  onMeetingInstanceSelect,
  onMeetingClick,
}: ViewProps): JSX.Element => (
  <>
    {owner && (
      <div
        css={[styles.resource(isSelected, true), styles.resourcOverWrite(isSelected)]}
        key="dad"
      >
        <div
          css={styles.resourceMeeting}
        >
          <div css={styles.avatarContainer}>
            <AvatarMaybeMultipleMaybeNot
              usersInfo={avatarList}
              numberOfUsers={numberOfMeetingAttendees}
              numberOfUsersToShow={numberOfMeetingAttendeesToShow}
              avatarHeight={35}
              avatarWidth={35}
              renderAvatar={({ user }) => (
                <>
                  {isNonLeadrUser(user) && (
                  <BaseAvatar
                    css={styles.avatar}
                    orgUserId={null}
                    userData={user}
                    avatarSize={35}
                    isNonLeadrUser
                  />
                  )}
                  {!isNonLeadrUser(user) && (
                  <BaseAvatar
                    css={styles.avatar}
                    orgUserId={user.orgUserId ?? null}
                    avatarSize={35}
                  />
                  )}
                </>
              )}
              renderOverflowAvatar={(overflowAvatarProps: OverflowAvatarProps) => (
                <OverflowAvatar
                  css={styles.avatar}
                  {...overflowAvatarProps}
                />
              )}
            />
          </div>
          <div css={styles.cardBody}>
            <div css={styles.title(isSelected)} data-test-id="meetingCardTitle">
              {title}
            </div>
            <div css={styles.subText}>
              {meetingFrequency}
            </div>
          </div>
          {isSelected && (
          <>
            {/* TODO: Flippin' switch this one out */}
            <DrawerDropdown
              name="meetingId"
              items={meetingInstanceOptions}
              label="Date"
              value=""
              onChange={onMeetingInstanceSelect}
              showEmptyOption
              variant="standard"
              className={undefined}
              size={undefined}
              validation={undefined}
              disabled={undefined}
              fontAwesomeIcon={undefined}
              labelStyles={undefined}
              getItems={undefined}
              renderItem={undefined}
            />
            <Tooltip
              content={(
                <>
                  <p css={styles.tooltipcontentspace}>Josh currently shows 1-2 instances ahead of the current date (e.g. a monthly meeting will show an instance next month and in 2 months).</p>
                  <p>We recommend creating a one-time 1:1 meeting if you need to set a meeting further in advance.</p>
                </>
              )}
            >
              <p
                css={styles.tooltipText}
              >
                Not Seeing Meeting Instance?
              </p>
            </Tooltip>
          </>
          )}
        </div>

        {!isSelected && (
        <JoshButton
          css={styles.button(isSelected)}
          onClick={() => onMeetingClick(meetingFactoryId)}
          size="small"
          data-test-id="selectResource"
        >
          Select
        </JoshButton>
        )}
      </div>
    )}
  </>
);

interface MeetingCardProps {
  onResourceClick: (resourceId: string, resourceContentTitle: string,
    resourceContentDueDate: Date, resourceContentStatusId: CompetencyResourceStatusEnum) => void,
  meeting: Meeting,
  meetingIdSelected: string[],
  onMeetingClick: (meetingId: string) => void,
}

const MeetingCard = ({
  onResourceClick,
  meeting,
  meetingIdSelected,
  onMeetingClick,
}: MeetingCardProps): JSX.Element => {
  const firstInstanceMeeting = meeting.meetingInstances[0];
  const params = {
    frequency: meeting.frequency,
    daysOfWeek: meeting.daysOfWeek,
    startTimeInMillis: firstInstanceMeeting.startTimeInMillis ?? moment(DEFAULT_DATE).valueOf(),
    includeTime: true,
  };
  const { meetingFactoryId, meetingInstances } = meeting;

  const meetingInstanceOptions = useMemo(() => (
    meetingInstances.map((instance) => ({
      text: moment(instance.startTimeInMillis ?? 0).format('MMMM Do YYYY'),
      value: instance.meetingInstanceId as string ?? '',
    }))
  ), [meetingInstances]);
  const onMeetingInstanceSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    const meetingSelected = meetingInstances.find(
      (meetingInstance) => meetingInstance.meetingInstanceId === value,
    );

    const meetingStartDateInMillis = meetingSelected?.startTimeInMillis as number ?? 0;
    const todaysDate = moment().valueOf();
    const isCompleted = meetingStartDateInMillis < todaysDate;
    const resourceContentStatusId = isCompleted ? CompetencyResourceStatusEnum.Complete : CompetencyResourceStatusEnum.NotStarted;

    onResourceClick(
      e.target.value,
      firstInstanceMeeting.title as string,
      moment(meetingSelected?.startTimeInMillis ?? 0).toDate(),
      resourceContentStatusId,
    );
  };
  const meetingFrequency = useFrequencyString(params);
  const attendeeList = meeting.meetingAttendees ?? [];
  const people = useGetPeople();
  const numberOfMeetingAttendees = attendeeList.length;
  const isSelected = meetingIdSelected.includes(meetingFactoryId);

  // Only need to get the first 6 attendees to display their avatars
  const pickedAttendeeOrgUserIds = attendeeList.slice(0, numberOfMeetingAttendeesToShow);
  const avatarList = useMemo(
    // At least in alpha, there are some users that are undefined, so assigning them empty objects, so that the avatar list doesn't break
    () => pickedAttendeeOrgUserIds.map(
      (attendee) => people.data?.response.items.find((person) => person.orgUserId === attendee.orgUserId) || {} as Person,
    ),
    [pickedAttendeeOrgUserIds, people.data?.response.items],
  );

  const owner = meeting.seriesOwner[0] as Person ?? [];
  const title = meeting.meetingInstances[0].title as string ?? '';

  const hookProps = {
    title,
    avatarList,
    owner,
    meetingFrequency,
    numberOfMeetingAttendees,
    isSelected,
    meetingFactoryId,
    meetingInstanceOptions,
    onMeetingInstanceSelect,
    onMeetingClick,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default MeetingCard;
