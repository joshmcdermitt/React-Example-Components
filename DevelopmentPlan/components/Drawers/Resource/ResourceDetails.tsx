import { SerializedStyles } from '@emotion/react';
import { requestorFeedbackDetailTemplate } from '~Feedback/components/Drawers/RequestorDetail/RequestorDetailDrawer';
import { FeedbackType } from '~Feedback/const/interfaces';
import { viewGoalDetailsTemplate } from '~Goals/components/Drawers/ViewGoalDetailsDrawer';
import { ResourceType } from '~DevelopmentPlan/const/types';
import { createEditActionItemTemplate } from '~ActionItems/components/Drawers/CreateEditActionItemDrawer';
import { receivedLearningDrawerTemplate } from '~Learning/components/ReceivedLearningDashboard/ReceivedLearningDrawer';
import { receivedPlaylistDrawerTemplate } from '~Learning/components/ReceivedLearningDashboard/ReceivedPlaylistDrawer';
import { useDrawerActions } from '~Common/hooks/useDrawers';
import { PushDrawerParams } from '~Common/const/drawers';

interface ActionForReflectionProps {
  resourceType: ResourceType,
  subjectUid: string,
  renderBottomButton?: () => JSX.Element,
  ownerId?: string,
  ownerOrgID: string,
}

function actionForResource({
  resourceType,
  subjectUid,
  renderBottomButton,
  ownerOrgID,
}: ActionForReflectionProps): PushDrawerParams {
  switch (resourceType) {
    case ResourceType.Goal:
      return {
        drawer: {
          ...viewGoalDetailsTemplate,
          args: {
            goalId: subjectUid,
            isReadOnly: true,
            renderBottomButton,
            backInformation: {
              location: window.location.href.replace(window.location.origin, ''),
              backText: 'Development Plan',
            },
          },
        },
      };
    case ResourceType.Feedback:
      return {
        drawer: {
          ...requestorFeedbackDetailTemplate,
          args: {
            id: subjectUid,
            type: FeedbackType.REQUESTED,
            assigneeId: ownerOrgID,
            isReadOnly: true,
            renderBottomButton,
          },
        },
      };
    case ResourceType.ActionItem:
      return {
        drawer: {
          ...createEditActionItemTemplate,
          args: {
            id: subjectUid,
          },
        },
      };

    case ResourceType.Learning:
      return {
        drawer: {
          ...receivedLearningDrawerTemplate,
          args: {
            learningId: subjectUid,
            learningOwnerId: ownerOrgID,
            showAddToMeetingButton: false,
            isReadOnly: true,
          },
        },
      };
    case ResourceType.LearningPlaylist:
      return {
        drawer: {
          ...receivedPlaylistDrawerTemplate,
          args: {
            playlistId: subjectUid,
            learningOwnerId: ownerOrgID,
            isReadOnly: true,
          },
        },
      };
    default:
      // Hopefully we aren't hitting this, if we are then we have some work to do
      return {} as PushDrawerParams;
  }
}

interface OpenDrawerProps {
  resourceType: ResourceType,
  subjectUid: string,
  renderBottomButton?: (bottomButtonStyles?: SerializedStyles) => JSX.Element,
  ownerId: string,
  ownerOrgID: string,
}

interface UseResourceDetailsDrawerReturn {
  openDrawer: (props: OpenDrawerProps) => void,
  closeDrawer: () => void,
}

export function useResourceDetailsDrawer(): UseResourceDetailsDrawerReturn {
  const { pushDrawer, popDrawer } = useDrawerActions();

  const openDrawer = ({
    resourceType,
    subjectUid,
    ownerId,
    ownerOrgID,
    renderBottomButton,
  }: OpenDrawerProps): void => {
    pushDrawer(actionForResource({
      resourceType,
      subjectUid,
      ownerId,
      renderBottomButton,
      ownerOrgID,
    }));
  };

  const closeDrawer = (): void => {
    popDrawer({ popAll: true });
  };

  return {
    openDrawer,
    closeDrawer,
  };
}
