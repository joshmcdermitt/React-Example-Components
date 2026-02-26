import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { ApprovePlanModal } from '~DevelopmentPlan/components/Modals/ApprovePlanModal';
import { PDP, PDPStatusEnum } from '~DevelopmentPlan/const/types';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';

interface ViewProps {
  showApprovalButtons: boolean,
  handleApprovePlan: () => void,
  planOwnerName: string,
}

const View = ({
  showApprovalButtons,
  handleApprovePlan,
  planOwnerName,
}: ViewProps): JSX.Element => (
  <>
    <ContextButtons
      portalIds={['contextButtonsViewDetails']}
      renderContents={() => (
        <>
          {showApprovalButtons && (
          <JoshButton
            onClick={handleApprovePlan}
            data-test-id="personalDevelopmentCompletePlanReview"
          >
            Complete Plan Review
          </JoshButton>
          )}
        </>
      )}
    />
    <ApprovePlanModal
      planOwnerName={planOwnerName}
    />
  </>
);

interface PersonalDevelopmentPlanApprovalProps {
  plan: PDP | undefined,
}

export const PersonalDevelopmentPlanApproval = ({
  plan,
}: PersonalDevelopmentPlanApprovalProps): JSX.Element => {
  const { mentor, owner } = plan ?? {};
  const isMentor = mentor?.orgUserId === getOrganizationUserId();
  const isPendingReview = plan?.status.id === PDPStatusEnum.PendingReview;
  const showApprovalButtons = isMentor && isPendingReview;
  const planOwnerName = owner?.firstName ?? '';

  const {
    openApprovePlanModal,
  } = useAddResourceModalStore((state) => ({
    openApprovePlanModal: state.openApprovePlanModal,
  }));

  const handleApprovePlan = (): void => {
    openApprovePlanModal();
  };

  const hookProps = {
    showApprovalButtons,
    handleApprovePlan,
    planOwnerName,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
