import { createShowModalStore } from '~Common/stores/ShowThingStore/createShowModalStore';
import { LinkedGoalModalProps } from '~Goals/components/GoalDetails/LinkedGoals/LinkGoalModal';

export type ShowLinkGoalModalProps = Pick<LinkedGoalModalProps, 'linkedGoalType'>;

export const useShowLinkGoalModal = createShowModalStore<ShowLinkGoalModalProps>('linkGoal');
