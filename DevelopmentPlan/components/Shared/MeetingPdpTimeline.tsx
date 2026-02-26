import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { css } from '@emotion/react';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';
import { ProgressBarTimeline } from './ProgressBarTimeline';

const styles = {
  viewPlanButton: css({
    fontSize: '0.75rem',
    fontWeight: '500',
  }),
};

interface ViewProps {
  handleViewPlanClick: () => void,
  meetingPdpId: string | undefined,
  isDesktop: boolean,
}

const View = ({
  handleViewPlanClick,
  meetingPdpId,
  isDesktop,
}: ViewProps): JSX.Element => (
  <>
    <ProgressBarTimeline
      idToUse={meetingPdpId}
    />
    {isDesktop && (
    <JoshButton
      data-test-id="viewPDPPlan"
      type="button"
      onClick={handleViewPlanClick}
      variant="text"
      size="small"
      color="primary"
      css={styles.viewPlanButton}
    >
      View Plan
    </JoshButton>
    )}
  </>
);

const MeetingPdpTimeline = (): JSX.Element => {
  const isDesktop = useIsDesktopQuery();
  const {
    meetingPdpId,
  } = useStoreParams((state) => ({
    meetingPdpId: state.meetingPdpId,
  }));

  const handleViewPlanClick = (): void => {
    const viewPlan = DevelopmentPlanRoutes.ViewById.replace(':pdpId', meetingPdpId ?? '');

    window.open(viewPlan, '_blank', 'noreferrer');
  };

  const hookProps = {
    handleViewPlanClick,
    meetingPdpId,
    isDesktop,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default MeetingPdpTimeline;
