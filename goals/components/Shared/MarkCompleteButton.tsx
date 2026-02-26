import { Goals } from '@josh-hr/types';
import JoshButton, { JoshButtonProps } from '~Common/V3/components/JoshButtons/JoshButton';
import useOpenGoalStatusUpdateModal from '~Goals/components/DeleteAfterGoalsV4/ResolveDependencies/useOpenGoalStatusUpdateModalDeprecated';

interface ViewProps extends Omit<JoshButtonProps<'button'>, 'data-test-id' | 'onClick'> {
  handleMarkComplete: () => void,
}

const View = ({
  handleMarkComplete,
  ...props
}: ViewProps): JSX.Element => (
  <JoshButton
    data-test-id="goalsMarkGoalComplete"
    onClick={handleMarkComplete}
    {...props}
  >
    Mark Complete
  </JoshButton>
);

interface MarkCompleteButtonProps extends Omit<ViewProps, 'handleMarkComplete'> {
  goal: Goals.Goal,
}

const MarkCompleteButton = ({
  goal,
  ...props
}: MarkCompleteButtonProps): JSX.Element => {
  const { openGoalStatusUpdateModal } = useOpenGoalStatusUpdateModal();

  const handleMarkComplete = (): void => {
    const lastStatusUpdate = goal.statusUpdates?.[0];
    openGoalStatusUpdateModal({
      modalProps: {
        goal,
        status: Goals.GoalStatus.Completed,
        completionPercentage: lastStatusUpdate?.completionPercentage ?? 0,
        statusCommentary: lastStatusUpdate?.statusCommentary ?? '',
        statusCommentarySummary: lastStatusUpdate?.statusCommentarySummary ?? '',
        measurementScale: goal.measurementScale,
      },
    });
  };

  const hookProps = {
    handleMarkComplete,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default MarkCompleteButton;
