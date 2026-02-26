import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { useGetLinkedGoalsById } from '~Goals/hooks/linkGoals/useGetLinkedGoalsById';
import { Goals } from '@josh-hr/types';
import { ShowLinkGoalModalProps, useShowLinkGoalModal } from '~Goals/hooks/utils/useShowLinkGoalModal';
import { UseLinkGoalWithExistingGoalLinksReturn, useLinkGoalWithExistingGoalLinks } from '~Goals/hooks/utils/useLinkGoalWithExistingGoalLinks';
import { queryClient } from '~Common/const/queryClient';
import { goalKeys } from '~Goals/const/queryKeys';
import { homeQueryKeys } from '~Home/hooks/queryKeys';
import { getOrganizationId } from '~Common/utils/localStorage';
import LinkedGoalModal from './LinkGoalModal';
import ParentGoal from './ParentGoal';
import SupportingGoals from './SupportingGoals';

const styles = {
  linkedGoals: css({
    display: 'grid',
    gridTemplateColumns: '1fr auto auto auto',
    gridTemplateRows: '1fr',
  }),
  parentGoal: css({
    borderBottom: `1px solid ${palette.neutrals.gray300}`,
    paddingBottom: '1.125rem',
    marginBottom: '1.125rem',
  }),
};

interface ViewProps extends Pick<UseLinkGoalWithExistingGoalLinksReturn, 'linkParentGoal' | 'linkSupportingGoals'> {
  parentGoal: Goals.LinkedGoal | undefined,
  supportingGoals: Goals.LinkedGoal[] | undefined,
  canLinkParentGoal: boolean,
  canLinkSupportingGoals: boolean,
  showModal: boolean,
  goalId: string,
  modalProps: ShowLinkGoalModalProps,
  isDrawer?: boolean,
}

const View = ({
  parentGoal,
  supportingGoals,
  canLinkParentGoal,
  canLinkSupportingGoals,
  showModal,
  goalId,
  modalProps,
  linkParentGoal,
  linkSupportingGoals,
  isDrawer,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.linkedGoals}
    {...props}
  >
    <ParentGoal
      css={styles.parentGoal}
      parentGoal={parentGoal}
      canLinkGoal={canLinkParentGoal}
      goalId={goalId}
      isDrawer={isDrawer}
    />
    <SupportingGoals
      supportingGoals={supportingGoals}
      canLinkGoal={canLinkSupportingGoals}
      goalId={goalId}
      isDrawer={isDrawer}
    />
    {showModal && (
      <LinkedGoalModal
        showModal={showModal}
        goalId={goalId}
        linkParentGoal={linkParentGoal}
        linkSupportingGoals={linkSupportingGoals}
        {...modalProps}
      />
    )}
  </div>
);

interface LinkedGoalsProps extends Pick<ViewProps, 'canLinkParentGoal' | 'canLinkSupportingGoals' | 'isDrawer'> {
  goal: Goals.Goal,
}

const LinkedGoals = ({
  goal,
  ...props
}: LinkedGoalsProps): JSX.Element => {
  const { data } = useGetLinkedGoalsById({ goalId: goal.goalId });
  const { useIsModalOpen, useGetModalProps, closeModal } = useShowLinkGoalModal();
  const showModal = useIsModalOpen();
  const modalProps = useGetModalProps();

  const { linkParentGoal, linkSupportingGoals } = useLinkGoalWithExistingGoalLinks({
    goalId: goal.goalId,
    onSuccess: async () => {
      closeModal();
      void queryClient.invalidateQueries({ queryKey: homeQueryKeys.homeGoals(getOrganizationId() ?? '') });
      await queryClient.invalidateQueries({ queryKey: goalKeys.all });
    },
  });

  const hookProps = {
    parentGoal: data?.response.parentGoal,
    supportingGoals: data?.response.childGoals,
    showModal,
    goalId: goal.goalId,
    modalProps,
    linkParentGoal,
    linkSupportingGoals,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default LinkedGoals;
