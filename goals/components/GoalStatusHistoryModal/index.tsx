import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { css } from '@emotion/react';
import { faPlus } from '@fortawesome/pro-light-svg-icons';
import { Goals } from '@josh-hr/types';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import JoshModal from '~Common/V3/components/JoshModal';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { palette } from '~Common/styles/colors';
import { usePrevious } from '~Deprecated/hooks/usePrevious';
import { HttpCallReturn } from '~Deprecated/services/HttpService';
import { GetGoalByIdReturn, useGetGoalById } from '~Goals/hooks/useGetGoalById';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import useOpenGoalStatusUpdateModal from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/useOpenGoalStatusUpdateModalDeprecated';
import { sortGoalStatusUpdates } from '~Goals/utils/sortGoalStatusUpdates';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import { forMobileObject } from '~Common/styles/mixins';
import { LeftPanel } from './LeftPanel';
import RightPanel from './RightPanel';

const styles = {
  container: css({
    display: 'flex',
    border: `1px solid ${palette.neutrals.gray200}`,
    height: '100%',
    minHeight: 0,
  }),
  leftPanel: css({
    flexBasis: '25%',
    overflowY: 'auto',
  }, forMobileObject({
    flexBasis: '100%',
  })),
  rightPanel: css({
    borderLeft: `1px solid ${palette.neutrals.gray200}`,
    flex: 1,
    overflowY: 'auto',
  }),
  modalBody: css({
    flex: 1,
  }),
  title: css({
    color: palette.brand.indigo,
  }),
  addUpdateButton: css({
    fontWeight: 400,
  }),
};

interface ViewProps {
  onClose: () => void,
  statusId: string,
  transitionToUpdateModal: () => void,
  isMobile: boolean,
  canEditGoalStatus: boolean,
  goal: Goals.Goal | undefined,
  isModalVisible: boolean,
  featureNamesText: FeatureNamesText,
  handleStatusClick: (statusId: string) => void,
  showLeftPanel: boolean,
  setShowLeftPanel: (show: boolean) => void,
}

const View = ({
  onClose,
  statusId,
  transitionToUpdateModal,
  isMobile,
  canEditGoalStatus,
  goal,
  isModalVisible,
  featureNamesText,
  handleStatusClick,
  showLeftPanel,
  setShowLeftPanel,
}: ViewProps): JSX.Element => (
  <JoshModal
    open={isModalVisible}
    onClose={onClose}
  >
    <JoshModal.Header>
      <JoshModal.Title css={styles.title}>
        {`${featureNamesText.goals.singular} History`}
      </JoshModal.Title>
    </JoshModal.Header>
    {goal && (
      <JoshModal.Body css={styles.modalBody}>
        <div css={styles.container}>
          {((isMobile && showLeftPanel) || !isMobile) && (
            <LeftPanel
              css={styles.leftPanel}
              statusId={statusId}
              goalId={goal.goalId}
              measurementScale={goal.measurementScale}
              handleStatusClick={handleStatusClick}
            />
          )}
          {((isMobile && !showLeftPanel) || !isMobile) && (
            <RightPanel
              css={styles.rightPanel}
              statusId={statusId}
              goal={goal}
              showBackButton={isMobile}
              handleBackClick={() => setShowLeftPanel(true)}
            />
          )}
        </div>
      </JoshModal.Body>
    )}
    {canEditGoalStatus && (
      <JoshModal.Footer>
        <JoshButton
          data-test-id="goalHistoryModalAddUpdate"
          onClick={transitionToUpdateModal}
          size="small"
          css={styles.addUpdateButton}
        >
          <JoshButton.IconAndText
            icon={faPlus}
            text="Add Update"
          />
        </JoshButton>
      </JoshModal.Footer>
    )}
  </JoshModal>
);

export interface GoalStatusHistoryModalProps {
  goalId: string,
  displayedStatusId?: string,
  shouldAffectUrl?: boolean,
}

const GoalStatusHistoryModal = ({
  goalId,
  displayedStatusId,
  shouldAffectUrl = true,
}: GoalStatusHistoryModalProps): JSX.Element => {
  const { data: goal } = useGetGoalById({
    goalId,
    select: useCallback((tempData: HttpCallReturn<GetGoalByIdReturn>) => sortGoalStatusUpdates(tempData.response), []),
  });

  const history = useHistory();
  const isMobile = useIsMobileQuery();
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const { openGoalStatusUpdateModal } = useOpenGoalStatusUpdateModal();
  const {
    show: openModal,
    hide: closeModal,
    visible: isModalVisible,
  } = useModal();

  const statusUpdatesIds = useMemo(() => goal?.statusUpdates.map((statusUpdate) => statusUpdate.statusId) ?? [], [goal]);
  const [statusId, setStatusId] = useState(displayedStatusId ?? statusUpdatesIds[0]);
  const previousDisplayedStatusId = usePrevious(displayedStatusId);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  useEffect(() => {
    if (displayedStatusId !== previousDisplayedStatusId) {
      setStatusId(displayedStatusId);
    }
  }, [displayedStatusId, previousDisplayedStatusId]);

  const transitionToUpdateModal = (): void => {
    const lastStatusUpdate = goal?.statusUpdates?.[0];
    void closeModal();

    if (goal) {
      openGoalStatusUpdateModal({
        modalProps: {
          isEdit: false,
          goal,
          status: lastStatusUpdate?.status ?? Goals.GoalStatus.OnTrack,
          completionPercentage: lastStatusUpdate?.completionPercentage ?? 0,
          statusCommentary: '',
          statusCommentarySummary: '',
          measurementScale: goal.measurementScale,
          onCloseCallback: () => {
            void openModal({
              goalId,
              displayedStatusId,
              shouldAffectUrl,
            });
          },
        },
      });
    }
  };

  const handleStatusClick = (newStatusId: string): void => {
    if (shouldAffectUrl) {
      history.push(goalRoutes.GoalStatusById.replace(':goalId', goal?.goalId ?? '').replace(':statusId', newStatusId));
    } else {
      setStatusId(newStatusId);
    }
    setShowLeftPanel(false);
  };

  const onClose = (): void => {
    void closeModal();
    if (shouldAffectUrl) {
      const backUrl = goalRoutes.ViewById.replace(':goalId', goal?.goalId ?? '');
      history.push(backUrl);
    }
  };

  if (statusUpdatesIds.length === 0 || !statusUpdatesIds.find((id) => id === statusId)) return <></>;

  const canEditGoalStatus = !!goal?.permissions.includes(Goals.GoalPermission.CanEditGoalStatus);

  const hookProps = {
    onClose,
    statusId,
    transitionToUpdateModal,
    isMobile,
    canEditGoalStatus,
    goal,
    isModalVisible,
    featureNamesText,
    handleStatusClick,
    showLeftPanel,
    setShowLeftPanel,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export default NiceModal.create(GoalStatusHistoryModal);
