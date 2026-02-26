import { css } from '@emotion/react';
import { CardSkeleton } from '~Common/V3/components/Card';
import { BasicPdp } from '~DevelopmentPlan/const/types';
import { useGetPDPForMeetings } from '~DevelopmentPlan/hooks/useGetPDPForMeetings';
import MeetingSectionCard from '~Meetings/components/shared/MeetingSectionCard';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import MeetingPdpTimeline from './MeetingPdpTimeline';
import PdpDropdown from './PdpDropdown';

const styles = {
  joshCard: css({
    marginBottom: '1.5rem',
  }),
  cardSkeleton: css({
    maxWidth: '100%',
  }),
};

interface ViewProps {
  isLoading: boolean,
  pdps: BasicPdp[] | undefined,
}

const View = ({
  pdps,
  isLoading,
  ...props
}: ViewProps): JSX.Element => (
  <div {...props}>
    {isLoading && (
      <CardSkeleton css={styles.cardSkeleton} />
    )}
    {!isLoading && pdps && pdps?.length > 0 && (
      <MeetingSectionCard>
        <MeetingSectionCard.Header>
          <MeetingSectionCard.Title>
            Development Plan
          </MeetingSectionCard.Title>
          <PdpDropdown
            name="meetingPdpIdSelect"
            pdps={pdps}
          />
        </MeetingSectionCard.Header>
        <MeetingSectionCard.Body>
          <MeetingPdpTimeline />
        </MeetingSectionCard.Body>
      </MeetingSectionCard>
    )}
  </div>
);

interface MeetingPDPProps {
  otherUserInMeeting: string,
}

export const MeetingPDP = ({
  otherUserInMeeting,
  ...props
}: MeetingPDPProps): JSX.Element => {
  const { data: pdps, isLoading: arePdpsLoading } = useGetPDPForMeetings({ id: otherUserInMeeting });

  const [isLoading] = useSkeletonLoaders(arePdpsLoading);

  const hookProps = {
    pdps,
    isLoading,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};
