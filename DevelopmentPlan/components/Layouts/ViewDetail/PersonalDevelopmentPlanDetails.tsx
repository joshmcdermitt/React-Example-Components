import { css } from '@emotion/react';
import { useParams } from 'react-router';
import { useGetPlanById } from '~DevelopmentPlan/hooks/useGetPlanById';
import { Comment, PDP, PDPPermissions } from '~DevelopmentPlan/const/types';
import { PersonalDevelopmentStatusBanner } from '~DevelopmentPlan/components/Shared/PersonalDevelopmentStatusBanner';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { useEffect } from 'react';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { useHistory } from 'react-router-dom';
import { AddResourceModal } from '~DevelopmentPlan/components/Modals/AddResourceModal';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { DEFAULT_DATE } from '~DevelopmentPlan/const/defaults';
import { useGetFinalThoughts } from '~DevelopmentPlan/hooks/useGetFinalThoughts';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { ConfirmationPlanModal } from '~DevelopmentPlan/components/Modals/ConfirmationPlanModal';
import { useDeletePlan } from '~DevelopmentPlan/hooks/useDeletePlan';
import { useReOpenPlan } from '~DevelopmentPlan/hooks/useReOpenPlan';
import { PersonalDevelopmentTimeline } from './PersonalDevelopmentTimeline';
import { PersonalDevelopmentCompetencyArea } from './PersonalDevelopmentCompetencyArea';
import { PersonalDevelopmentSummary } from './PersonalDevelopmentSummary';
import { PersonalDevelopmentComments } from './PersonalDevelopmentComments';
import { PersonalDevelopmentPlanApproval } from './PersonalDevelopmentPlanApproval';
import { FinalThoughtsForm } from './FinalThoughtsForm';

const styles = {
  detailsWrapper: css({
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: '1.25rem',
    marginTop: '1.25rem',
    marginBottom: '4rem',
  }),
  subSection: (isMobile: boolean) => css({
    display: 'grid',
    gridTemplateColumns: '4fr 1fr',
    gridColumnGap: '1.5rem',
    gridTemplateAreas: '"content sideBar"',
    gap: '.625rem',
  }, isMobile && {
    gridTemplateColumns: '1fr',
    gridTemplateAreas: '"sideBar""content" ',
  }),
  sidebar: (isMobile: boolean) => css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    gridArea: 'sideBar',
    alignItems: 'flex-start',
    minWidth: '20.3125rem',
    maxWidth: '20.3125rem',

    '.Mui-expanded': {
      margin: '0 !important',
    },
  }, isMobile && {
    maxWidth: '100%',
  }),
  contentWrap: css({
    gridArea: 'content',
    alignSelf: 'self-start',
    gap: '.625rem',
    display: 'flex',
    flexDirection: 'column',
  }),
};

interface ViewProps {
  plan: PDP | undefined,
  showSkeleton: boolean,
  planIsLoading: boolean,
  finalThoughts: Comment[] | undefined,
  isMobile: boolean,
  deletePlan: () => void,
  showDeletePlanModal: boolean,
  closeDeletePlanModal: () => void,
  closeReopenPlanModal: () => void,
  showReopenPlanModal: boolean,
  reopenPlan: () => void,
}

const View = ({
  plan,
  showSkeleton,
  planIsLoading,
  finalThoughts,
  isMobile,
  deletePlan,
  showDeletePlanModal,
  closeDeletePlanModal,
  closeReopenPlanModal,
  showReopenPlanModal,
  reopenPlan,
}: ViewProps): JSX.Element => (
  <>
    <div css={styles.detailsWrapper}>
      <PersonalDevelopmentStatusBanner
        plan={plan}
        showSkeleton={showSkeleton}
        finalThoughts={finalThoughts}
      />
      <PersonalDevelopmentTimeline
        plan={plan}
        planIsLoading={planIsLoading}
      />
      <div css={styles.subSection(isMobile)}>
        <div
          css={styles.contentWrap}
        >
          <FinalThoughtsForm
            finalThoughts={finalThoughts}
            planStatus={plan?.status}
            showSkeleton={showSkeleton}
          />
          <PersonalDevelopmentCompetencyArea />
        </div>
        <div css={styles.sidebar(isMobile)}>
          <PersonalDevelopmentSummary
            plan={plan}
            showSkeleton={showSkeleton}
          />
          {!isMobile && (
          <PersonalDevelopmentComments />
          )}
        </div>
      </div>
    </div>
    <PersonalDevelopmentPlanApproval
      plan={plan}
    />
    <AddResourceModal
      pdpId={plan?.id.toString() ?? ''}
    />
    <ConfirmationPlanModal
      show={showDeletePlanModal}
      close={closeDeletePlanModal}
      handleConfirmation={deletePlan}
      title="Are you sure you want to delete this development plan?"
      bodyText="Deleting this plan will unlink items and remove it from your plans."
      buttonText="Delete Plan"
    />
    <ConfirmationPlanModal
      show={showReopenPlanModal}
      close={closeReopenPlanModal}
      handleConfirmation={reopenPlan}
      title="Are you sure you want to reopen plan?"
      bodyText="All Final Thoughts will be deleted."
      buttonText="Reopen Plan"
      displayTextInBlue
    />
  </>
);

export interface PersonalDevelopmentPlanDetailsParams {
  pdpId: string,
}

export const PersonalDevelopmentPlanDetails = (): JSX.Element => {
  const { pdpId } = useParams<PersonalDevelopmentPlanDetailsParams>();
  const {
    data: plan, isLoading: planIsLoading, isError,
  } = useGetPlanById({ id: pdpId });
  const { data: finalThoughts, isError: finalThoughtsError } = useGetFinalThoughts({ id: pdpId });
  const [showSkeleton] = useSkeletonLoaders(planIsLoading);
  const history = useHistory();
  const isMobile = useIsMobileQuery();

  const {
    setPlanPermissions,
  } = useStoreParams((state) => ({
    setPlanPermissions: state.setPlanPermissions,
  }));

  const {
    setPlanDueDate,
    setPlanStartDate,
    setPdpOwnerId,
    setPdpOwnerUserId,
    showDeletePlanModal,
    closeDeletePlanModal,
    setPdpId,
    closeReopenPlanModal,
    showReopenPlanModal,
  } = useAddResourceModalStore((state) => ({
    setPlanDueDate: state.setPlanDueDate,
    setPlanStartDate: state.setPlanStartDate,
    setPdpOwnerId: state.setPdpOwnerId,
    setPdpOwnerUserId: state.setPdpOwnerUserId,
    showDeletePlanModal: state.showDeletePlanModal,
    closeDeletePlanModal: state.closeDeletePlanModal,
    setPdpId: state.setPdpId,
    closeReopenPlanModal: state.closeReopenPlanModal,
    showReopenPlanModal: state.showReopenPlanModal,
  }));

  useEffect(() => {
    if (pdpId) {
      setPdpId(pdpId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdpId]);

  useEffect(() => {
    const { permissions, endDate, startDate } = plan ?? {};
    if ((!plan?.permissions.includes(PDPPermissions.CanView) && !planIsLoading)) {
      history.push(DevelopmentPlanRoutes?.PermissionsDenied);
    }
    if (isError || finalThoughtsError) {
      history.push(DevelopmentPlanRoutes?.PermissionsDenied);
    }
    setPlanPermissions(permissions ?? []);
    setPlanDueDate(endDate ?? DEFAULT_DATE);
    setPlanStartDate(startDate ?? DEFAULT_DATE);
    setPdpOwnerId(plan?.owner.orgUserId ?? '');
    setPdpOwnerUserId(plan?.owner.userId ?? '');
  }, [plan, planIsLoading, history, setPlanPermissions, setPlanDueDate, setPlanStartDate, isError, finalThoughtsError, setPdpOwnerId, setPdpOwnerUserId]);

  const {
    mutate: deletePlanMutation,
  } = useDeletePlan();
  const deletePlan = (): void => {
    deletePlanMutation({ id: pdpId }, { onSuccess: succesfulPlanDeletion });
  };

  const {
    mutate: reOpenPlanMutation,
  } = useReOpenPlan();
  const reopenPlan = (): void => {
    reOpenPlanMutation({ id: pdpId }, { onSuccess: succesfulPlanReopen });
  };

  const succesfulPlanDeletion = (): void => {
    closeDeletePlanModal();
    history.push(DevelopmentPlanRoutes.Dashboard);
  };
  const succesfulPlanReopen = (): void => {
    closeReopenPlanModal();
  };

  const hookProps = {
    plan,
    showSkeleton,
    planIsLoading,
    finalThoughts,
    isMobile,
    deletePlan,
    showDeletePlanModal,
    closeDeletePlanModal,
    closeReopenPlanModal,
    showReopenPlanModal,
    reopenPlan,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
