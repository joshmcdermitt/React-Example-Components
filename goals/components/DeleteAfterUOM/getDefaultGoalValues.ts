import { getOrganizationUserId } from '~Common/utils/localStorage';
import { CreateEditGoalFormValues } from '~Goals/components/DeleteAfterUOM/useGetCreateEditGoalFormResolver';
import moment from 'moment-timezone';
import { Goals } from '@josh-hr/types';

const DEFAULT_TEAM_ID = 'noTeamSelected';

/*
  Since we are setting the owner participant using the orgUserId from local storage, we need this to be a function
  This is because on first login, getOrganizationUserId will return null and local storage is not reactive, so we need to evaluate this in usage,
    instead of just making a static object
*/

export const getDefaultGoalValues = (): CreateEditGoalFormValues => ({
  title: '',
  description: '',
  participants: [{
    orgUserId: getOrganizationUserId()!,
    role: Goals.GoalParticipantRole.Owner,
  }],
  priority: Goals.GoalPriority.Medium,
  context: {
    contextType: Goals.GoalContextType.Personal,
    contextId: DEFAULT_TEAM_ID,
  },
  category: Goals.GoalCategory.Objective,
  externalLink: '',
  isPrivate: false,
  startTimeInMillis: moment().valueOf(),
  endTimeInMillis: moment().add(90, 'day').valueOf(),
  measurementScaleTypeId: 1,
  measurementUnitTypeId: 1,
});
