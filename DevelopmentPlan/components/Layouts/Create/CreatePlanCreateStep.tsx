import { FORM_LAYOUT_STYLES } from '~DevelopmentPlan/const/pageStyles';
import {
  PDP, PDPStatusEnum, ViewPersonalDevelopmentPlanPerspective,
} from '~DevelopmentPlan/const/types';
import { useGetPlanById } from '~DevelopmentPlan/hooks/useGetPlanById';
import { ContextButtons } from '~Reviews/V2/Shared/ContextButtons';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { ProgressBarTimeline } from '~DevelopmentPlan/components/Shared/ProgressBarTimeline';
import { useSubmitPlan } from '~DevelopmentPlan/hooks/useSubmitPlan';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { useHistory } from 'react-router-dom';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { COMPETENCY_RESOURCE_TABS, DEFAULT_DATE } from '~DevelopmentPlan/const/defaults';
import Tooltip from '~Common/components/Tooltip';
import { useEffect } from 'react';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { queryClient } from '~Common/const/queryClient';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { useGetCompetencyList } from '~DevelopmentPlan/hooks/useGetCompetencyList';
import { ConfirmationPlanModal } from '~DevelopmentPlan/components/Modals/ConfirmationPlanModal';
import { useDeletePlan } from '~DevelopmentPlan/hooks/useDeletePlan';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import CreatePlanTitleArea from './CreatePlanTitleArea';
import AddCompetencies from './AddCompetencies';

const styles = {
  ...FORM_LAYOUT_STYLES,
};

interface ViewProps {
  plan: PDP | undefined,
  isDraft: boolean,
  submitForReview: () => void,
  navigateBack: () => void,
  isEditing: boolean,
  hasCompetencies: boolean,
  deletePlan: () => void,
  showDeletePlanModal: boolean,
  closeDeletePlanModal: () => void,
  isMobile: boolean,
}

const View = ({
  plan,
  isDraft,
  submitForReview,
  navigateBack,
  isEditing,
  hasCompetencies,
  deletePlan,
  showDeletePlanModal,
  closeDeletePlanModal,
  isMobile,
}: ViewProps): JSX.Element => (
  <>
    <ContextButtons
      renderContents={() => (
        <>
          <div css={styles.contextButtonsWrap(isMobile)}>
            {!isEditing && (
            <JoshButton
              onClick={navigateBack}
              data-test-id="personalDevelopmentSetupPreviousStep"
              variant="ghost"
            >
              Previous Step
            </JoshButton>
            )}
            {!plan && (
              <Tooltip
                content="Waiting for your plan to load"
              >
                <div>
                  <JoshButton
                    onClick={submitForReview}
                    data-test-id="personalDevelopmentSetupSubmitPlan"
                    disabled
                  >
                    {isEditing ? 'Save Edits' : 'Submit Plan'}
                  </JoshButton>
                </div>
              </Tooltip>
            )}
            {plan && (
              <>
                {!hasCompetencies && (
                <Tooltip
                  content="Please add at least one competency to continue"
                >
                  <div>
                    <JoshButton
                      onClick={submitForReview}
                      data-test-id="personalDevelopmentSetupSubmitPlan"
                      disabled
                    >
                      {isEditing ? 'Save Edits' : 'Submit Plan'}
                    </JoshButton>
                  </div>
                </Tooltip>
                )}
                {hasCompetencies && (
                <JoshButton
                  onClick={submitForReview}
                  data-test-id="personalDevelopmentSetupSubmitPlan"
                >
                  {isEditing ? 'Save Edits' : 'Submit Plan'}
                </JoshButton>
                )}
              </>
            )}
          </div>
        </>
      )}
    />
    <CreatePlanTitleArea
      isDraft={isDraft}
      name={plan?.name ?? 'Loading your plan...'}
      permissions={plan?.id ? plan?.permissions : undefined}
    />
    <ProgressBarTimeline />
    <AddCompetencies />
    <ConfirmationPlanModal
      show={showDeletePlanModal}
      close={closeDeletePlanModal}
      handleConfirmation={deletePlan}
      title="Are you sure you want to delete this development plan?"
      bodyText="Deleting this plan will unlink items and remove it from your plans."
      buttonText="Delete Plan"
    />
  </>
);

interface CreatePlanCreateStepProps {
  pdpId: string,
}

const CreatePlanCreateStep = ({
  pdpId,
}: CreatePlanCreateStepProps): JSX.Element => {
  const { data: plan } = useGetPlanById({ id: pdpId });
  const { data } = useGetCompetencyList({ id: pdpId });
  const competencies = data?.response;
  const hasCompetencies = !!competencies && competencies?.length > 0;
  const history = useHistory();

  const {
    setViewPerspective,
  } = useStoreParams((state) => ({
    setViewPerspective: state.setViewPerspective,
  }));

  const {
    mutate: deletePlanMutation,
  } = useDeletePlan();
  const deletePlan = (): void => {
    deletePlanMutation({ id: pdpId }, { onSuccess: succesfulPlanDeletion });
  };

  const succesfulPlanDeletion = (): void => {
    closeDeletePlanModal();
    history.push(DevelopmentPlanRoutes.Dashboard);
  };

  const { status } = plan || {};

  const {
    setPlanDueDate,
    setPlanStartDate,
    setPdpOwnerId,
    setPdpOwnerUserId,
    showDeletePlanModal,
    openDeletePlanModal,
    closeDeletePlanModal,
  } = useAddResourceModalStore((state) => ({
    setPlanDueDate: state.setPlanDueDate,
    setPlanStartDate: state.setPlanStartDate,
    setPdpOwnerId: state.setPdpOwnerId,
    setPdpOwnerUserId: state.setPdpOwnerUserId,
    showDeletePlanModal: state.showDeletePlanModal,
    openDeletePlanModal: state.openDeletePlanModal,
    closeDeletePlanModal: state.closeDeletePlanModal,
  }));

  useEffect(() => {
    const { endDate, startDate } = plan ?? {};
    setPlanDueDate(endDate ?? DEFAULT_DATE);
    setPlanStartDate(startDate ?? DEFAULT_DATE);
    setPdpOwnerId(plan?.owner.orgUserId ?? '');
    setPdpOwnerUserId(plan?.owner.userId ?? '');
  }, [plan, setPdpOwnerId, setPdpOwnerUserId, setPlanDueDate, setPlanStartDate]);

  const isDraft = status?.id === PDPStatusEnum.Draft;
  const isEditing = history.location.pathname.includes('edit') && !isDraft;

  const navigateBack = (): void => {
    if (isEditing) {
      history.push(DevelopmentPlanRoutes.ViewById.replace(':pdpId', pdpId));
    } else {
      setViewPerspective(ViewPersonalDevelopmentPlanPerspective.Setup);
    }
  };

  const {
    mutate: submitPlanMutation,
  } = useSubmitPlan();

  const submitForReview = (): void => {
    if (isEditing) {
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.detail(pdpId) });
      const backToDetailsUrl = `${DevelopmentPlanRoutes.ViewById.replace(':pdpId', pdpId ?? '')}?tab=${COMPETENCY_RESOURCE_TABS[0].value}`;
      history.push(backToDetailsUrl);
    } else {
      submitPlanMutation({ id: pdpId });
    }
  };

  const isMobile = useIsMobileQuery();

  const hookProps = {
    plan,
    isDraft,
    submitForReview,
    navigateBack,
    isEditing,
    hasCompetencies,
    deletePlan,
    openDeletePlanModal,
    showDeletePlanModal,
    closeDeletePlanModal,
    isMobile,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, CreatePlanCreateStep };
export default CreatePlanCreateStep;
