import { css } from '@emotion/react';
import { OrgUser } from '@josh-hr/types';
import JoshCard from '~Common/V3/components/JoshCard';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';
import { palette } from '~Common/styles/colors';
import { withLineClamp } from '~Common/styles/mixins';
import { OwnerArea } from '~DevelopmentPlan/components/Shared/OwnerArea';
import PersonalDevelopmentActionMenu from '~DevelopmentPlan/components/Shared/PersonalDevelopmentActionMenu';
import PersonalDevelopmentTimelineStatusAndParticipants from '~DevelopmentPlan/components/Shared/PersonalDevelopmentTimelineStatusAndParticipants';
import { ProgressBarTimeline } from '~DevelopmentPlan/components/Shared/ProgressBarTimeline';
import { PDP, PDPPermissions, PDPStatus } from '~DevelopmentPlan/const/types';

const styles = {
  planTitle: css({
    fontSize: '1.5rem',
    fontWeight: 600,
    color: palette.neutrals.gray800,
  }, withLineClamp(1)),
  avatar: css({
    width: '2rem',
    height: '2rem',
  }),
  detailsTitleWrapper: (isMobileView: boolean) => css({
    display: 'flex',
    alignItems: 'center',
    gap: '.5rem',
    justifyContent: 'space-between',
  }, isMobileView && {
    flexDirection: 'column',
  }),
  titleArea: (isMobileView: boolean) => css({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    maxWidth: '60%',
  }, isMobileView && {
    maxWidth: '100%',
    width: '100%',
  }),
};

interface ViewProps {
  name: string | undefined,
  createdBy: OrgUser | undefined,
  permissions: PDPPermissions[],
  mentor: OrgUser | undefined,
  viewers: OrgUser[] | undefined,
  status: PDPStatus | undefined,
  planIsLoading: boolean,
}

const View = ({
  name,
  createdBy,
  permissions,
  mentor,
  viewers,
  status,
  planIsLoading,
}: ViewProps): JSX.Element => {
  const isDesktop = useIsDesktopQuery();
  return (
    <>
      <JoshCard>
        <div
          css={styles.detailsTitleWrapper(!isDesktop)}
        >
          <div
            css={styles.titleArea(!isDesktop)}
          >
            <OwnerArea
              id={createdBy?.orgUserId}
            />
            <div
              css={styles.planTitle}
            >
              {name}
            </div>
            {!planIsLoading && (
            <PersonalDevelopmentActionMenu
              permissions={permissions}
            />
            )}
          </div>
          <PersonalDevelopmentTimelineStatusAndParticipants
            mentor={mentor}
            viewers={viewers}
            status={status}
            isMobileView={!isDesktop}
          />
        </div>
        <ProgressBarTimeline />
      </JoshCard>
    </>
  );
};

interface PersonalDevelopmentTimelineProps {
  plan: PDP | undefined,
  planIsLoading: boolean,
}

export const PersonalDevelopmentTimeline = ({
  plan,
  planIsLoading,
}: PersonalDevelopmentTimelineProps): JSX.Element => {
  const {
    name, createdBy, permissions, mentor, viewers, status,
  } = plan ?? {} as PDP;

  const hookProps = {
    name,
    createdBy,
    permissions,
    mentor,
    viewers,
    status,
    planIsLoading,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
