import NiceModal from '@ebay/nice-modal-react';
import { Goals } from '@josh-hr/types';
import { useCallback } from 'react';
import CreateEditGoalStatusUpdateModal from '~Goals/components/CreateEditGoalStatusUpdateModal';
import { formatStatusCase } from '~Goals/const/functions';

type ModalProps = {
  goal: Goals.GoalV4 | Goals.GoalV4Cascading,
  status: Goals.GoalStatus,
  statusCommentary: string,
  onCloseCallback?: () => void,
  statusId: string,
  isEdit: boolean,
  measurementScale?: Goals.CondensedMeasurementScale,
  value?: number,
  isAchieved?: boolean,
}

interface OpenModalProps {
  modalProps: ModalProps,
}

interface UseOpenGoalStatusUpdateModalReturn {
  openGoalStatusUpdateModal: (props: OpenModalProps) => void,
}

const useOpenGoalStatusUpdateModal = (): UseOpenGoalStatusUpdateModalReturn => {
  /*
    This is setup a little bit more complicated than I wish it was
    That is because the BE made flag off changes to the payload required when creating/updating a status
    This is setup in order to support both the old and new modals as well as not increase the testing footprint too much
    Once we remove the objectivesUnitOfMeasure feature flag, we can update the modalProps to just take in the props from CreateEditGoalStatusUpdateModal
  */
  const openGoalStatusUpdateModal = useCallback(({
    modalProps: {
      goal,
      isAchieved,
      isEdit,
      measurementScale,
      onCloseCallback,
      status,
      statusCommentary,
      statusId,
      value,
    },
  }: OpenModalProps): void => {
    void NiceModal.show(CreateEditGoalStatusUpdateModal, {
      goal,
      isEdit,
      statusId,
      measurementScale,
      initialValues: {
        status: formatStatusCase(status) as Goals.GoalStatus,
        // As of phase 1 this can only be a number, we can remove this once we have other values
        value,
        statusCommentary,
        isAchieved,
      },
      onCloseCallback,
    });
  }, []);

  return {
    openGoalStatusUpdateModal,
  };
};

export default useOpenGoalStatusUpdateModal;
