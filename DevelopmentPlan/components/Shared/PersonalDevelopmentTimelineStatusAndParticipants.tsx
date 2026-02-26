import { css } from '@emotion/react';
import { OrgUser } from '@josh-hr/types';
import { PDPStatus } from '~DevelopmentPlan/const/types';
import PersonalDevelopmentStatus from './PersonalDevelopmentStatus';
import PersonalDevelopmentMentorAndViewers from './PersonalDevelopmentMentorAndViewers';

const styles = {
  viewerParticipantContainer: (isMobileView: boolean) => css({
    display: 'flex',
    gap: '1.875rem',
  }, isMobileView && {
    width: '100%',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  }),
};

interface PersonalDevelopmentTimelineParticipantsProps {
  mentor: OrgUser | undefined,
  viewers: OrgUser[] | undefined,
  status: PDPStatus | undefined,
  isMobileView: boolean,
}

const PersonalDevelopmentTimelineStatusAndParticipants = ({
  mentor,
  viewers,
  status,
  isMobileView,
}: PersonalDevelopmentTimelineParticipantsProps): JSX.Element => (
  <>
    <div
      css={styles.viewerParticipantContainer(isMobileView)}
    >
      {status && (
        <PersonalDevelopmentStatus
          status={status}
        />
      )}
      <PersonalDevelopmentMentorAndViewers
        mentor={mentor}
        viewers={viewers}
      />
    </div>
  </>
);

export default PersonalDevelopmentTimelineStatusAndParticipants;
