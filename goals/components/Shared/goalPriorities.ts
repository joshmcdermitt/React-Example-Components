import { Goals } from '@josh-hr/types';
import { GoalPriorityLabels } from '~Goals/const/defaults';
import { GoalTypeOption } from '~Goals/const/types';

export const GoalPriorities: GoalTypeOption<number>[] = [
  {
    value: Goals.GoalPriority.Highest,
    text: GoalPriorityLabels[Goals.GoalPriority.Highest],
  },
  {
    value: Goals.GoalPriority.High,
    text: GoalPriorityLabels[Goals.GoalPriority.High],
  },
  {
    value: Goals.GoalPriority.Medium,
    text: GoalPriorityLabels[Goals.GoalPriority.Medium],
  },
  {
    value: Goals.GoalPriority.Low,
    text: GoalPriorityLabels[Goals.GoalPriority.Low],
  },
  {
    value: Goals.GoalPriority.Lowest,
    text: GoalPriorityLabels[Goals.GoalPriority.Lowest],
  },
];
