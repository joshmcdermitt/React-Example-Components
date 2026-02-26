import { Goals } from '@josh-hr/types';
import PriorityCriticalIcon from '~Assets/icons/components/PriorityCriticalIcon';
import PriorityHighIcon from '~Assets/icons/components/PriorityHighIcon';
import PriorityLowestIcon from '~Assets/icons/components/PriorityLowestIcon';
import PriorityLowIcon from '~Assets/icons/components/PriorityLowIcon';
import PriorityMediumIcon from '~Assets/icons/components/PriorityMediumIcon';
import { DropdownItem } from '~Goals/components/Shared/CreateEditGoalForm/Shared/Dropdown/Dropdown';

export const GOAL_OWNER_LIMIT = 1;
export const GOALS_PAGE_SIZE = 10;
export const DEFAULT_TEAM_ID = 'noTeamSelected';

export const GoalPriorityLabels = {
  [Goals.GoalPriority.Lowest]: 'Lowest',
  [Goals.GoalPriority.Low]: 'Low',
  [Goals.GoalPriority.Medium]: 'Medium',
  [Goals.GoalPriority.High]: 'High',
  [Goals.GoalPriority.Highest]: 'Highest',
};

export const GoalPriorities: DropdownItem<Goals.GoalPriority>[] = [
  {
    leftIcon: <PriorityCriticalIcon />,
    value: Goals.GoalPriority.Highest,
    text: GoalPriorityLabels[Goals.GoalPriority.Highest],
  },
  {
    leftIcon: <PriorityHighIcon />,
    value: Goals.GoalPriority.High,
    text: GoalPriorityLabels[Goals.GoalPriority.High],
  },
  {
    leftIcon: <PriorityMediumIcon />,
    value: Goals.GoalPriority.Medium,
    text: GoalPriorityLabels[Goals.GoalPriority.Medium],
  },
  {
    leftIcon: <PriorityLowIcon />,
    value: Goals.GoalPriority.Low,
    text: GoalPriorityLabels[Goals.GoalPriority.Low],
  },
  {
    leftIcon: <PriorityLowestIcon />,
    value: Goals.GoalPriority.Lowest,
    text: GoalPriorityLabels[Goals.GoalPriority.Lowest],
  },
];

export const PARTICIPANT_TABS = [
  {
    label: Goals.GoalParticipantRole.Collaborator,
    value: Goals.GoalParticipantRole.Collaborator,
    'data-test-id': 'collaboratorTab',
  },
  {
    label: Goals.GoalParticipantRole.Viewer,
    value: Goals.GoalParticipantRole.Viewer,
    'data-test-id': 'ViewerTab',
  },
];

export const DEFAULT_OWNER = {
  orgUserId: '',
  jobTitle: '',
  profileImageUrl: '',
  firstName: 'Deactivated',
  lastName: 'User',
  role: Goals.GoalParticipantRole.Owner,
};

export const DEFAULT_CUSTOM_UNIT_TYPE_ID = 0;

export const DEFAULT_CUSTOM_UNIT_TYPE: Goals.MeasurementUnit = {
  id: DEFAULT_CUSTOM_UNIT_TYPE_ID,
  displayLabel: '',
  ownership: {
    id: Goals.MeasurementUnitOwnershipId.Organization as number,
    description: 'Organization',
  },
  labelPosition: {
    id: Goals.LabelPositionId.Suffix as number,
    description: 'Suffix',
  },
};
