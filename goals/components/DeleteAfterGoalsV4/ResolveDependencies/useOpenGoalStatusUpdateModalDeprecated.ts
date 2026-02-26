import NiceModal from '@ebay/nice-modal-react';
import { Goals } from '@josh-hr/types';
import { useCallback } from 'react';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import CreateEditGoalStatusUpdateModal from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/CreateEditGoalStatusUpdateModal';
import CreateEditGoalStatusUpdateModalOld from '~Goals/components/DeleteAfterUOM/CreateEditGoalStatusUpdateModal';

type ModalProps = {
  goal: Goals.Goal,
  status: Goals.GoalStatus,
  completionPercentage: number,
  statusCommentary: string,
  statusCommentarySummary: string,
  onCloseCallback?: () => void,
  statusId?: string,
  isEdit?: boolean,
  measurementScale?: Goals.MeasurementScale,
}

interface OpenModalProps {
  modalProps: ModalProps,
}

interface UseOpenGoalStatusUpdateModalReturn {
  openGoalStatusUpdateModal: (props: OpenModalProps) => void,
}

/**
 *
 * @deprecated Use useOpenGoalStatusUpdateModal from ~Goals/hooks/utils/useOpenGoalStatusUpdateModal
 */

const useOpenGoalStatusUpdateModal = (): UseOpenGoalStatusUpdateModalReturn => {
  const objectivesUnitOfMeasure = useFeatureFlag('objectivesUnitOfMeasure');

  /*
    This is setup a little bit more complicated than I wish it was
    That is because the BE made flag off changes to the payload required when creating/updating a status
    This is setup in order to support both the old and new modals as well as not increase the testing footprint too much
    Once we remove the objectivesUnitOfMeasure feature flag, we can update the modalProps to just take in the props from CreateEditGoalStatusUpdateModal
  */
  const openGoalStatusUpdateModal = useCallback(({
    modalProps: {
      goal,
      status,
      completionPercentage,
      statusCommentary,
      onCloseCallback,
      statusId,
      isEdit,
      measurementScale,
    },
  }: OpenModalProps): void => {
    if (objectivesUnitOfMeasure && measurementScale) {
      void NiceModal.show(CreateEditGoalStatusUpdateModal, {
        goal,
        isEdit,
        statusId,
        measurementScale,
        initialValues: {
          status,
          // As of phase 1 this can only be a number, we can remove this once we have other values
          value: measurementScale.currentValue as number,
          statusCommentary,
        },
        onCloseCallback,
      });
    } else {
      void NiceModal.show(CreateEditGoalStatusUpdateModalOld, {
        goal,
        isEdit,
        statusId,
        initialValues: {
          status,
          completionPercentage,
          statusCommentary,
        },
        onCloseCallback,
      });
    }
  }, [objectivesUnitOfMeasure]);

  return {
    openGoalStatusUpdateModal,
  };
};

export default useOpenGoalStatusUpdateModal;
