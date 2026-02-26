import { palette } from '~Common/styles/colors';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { getOrganizationUserId } from '~Common/utils/localStorage';
import { OrgUser } from '@josh-hr/types';
import {
  PDPStatusEnum, PersonalDevelopmentTypeOption, TabType,
  Accomplishment, NextResource, PDPRole,
  CompetencyResourceStatusDescriptionType,
} from './types';

export const PERSONAL_DEVELOPMENT_MY_PLANS_PAGE_SIZE = 1000;
export const PERSONAL_DEVELOPMENT_OTHER_PLANS_PAGE_SIZE = 12;
export const COMPETENCY_RESOURCE_PAGE_SIZE = 8;
export const MEETING_LIST_PAGE_SIZE = 25;
export const TIMELINE_THRESHOLD = 5;
export const TIMELINE_ITEM_WIDTH = 1.75;
export const TIMELINE_ITEM_WIDTH_GROUPED = 3.75;
export const TIMELINE_FADE_PERCENTAGE = 0.5;
export const GOALS_PAGE_SIZE = 100;
export const ACTION_ITEMS_PAGE_SIZE = 100;
export const DEFAULT_OPACITY = 0.45;
export const OPTIMISTIC_ID = 99999999999;
export const DEFAULT_ID = 0;
export const DEFAULT_RESOURCE_TITLE = 'Resource was not saved properly';
export const DEFAULT_DATE = new Date(1986, 2, 11);
export const DUPLICATE_RESOURCE_TEXT = 'You already have this resource linked to this competency. Please select another competency.';
export const DEFAULT_TRUNCATE_TIMELINE_TITLE_LENGTH = 15;
export const DEFAULT_PDP_PATHNAME = 'development-plans';

export const personalDevelopmentStatusColor: Record<string, string> = {
  [CompetencyResourceStatusDescriptionType.Incompleted]: palette.neutrals.gray600,
  [CompetencyResourceStatusDescriptionType.OnHold]: palette.neutrals.gray600,
  [CompetencyResourceStatusDescriptionType.ToDo]: palette.neutrals.gray600,
  [CompetencyResourceStatusDescriptionType.Cancelled]: palette.neutrals.gray600,

  [CompetencyResourceStatusDescriptionType.NotStarted]: palette.brand.green, // also 'On track', was gray600
  [CompetencyResourceStatusDescriptionType.InProgress]: palette.brand.green, // 'On track'
  [CompetencyResourceStatusDescriptionType.Complete]: palette.brand.green,
  [CompetencyResourceStatusDescriptionType.OnTrack]: palette.brand.green,
  [CompetencyResourceStatusDescriptionType.Completed]: palette.brand.green,

  [CompetencyResourceStatusDescriptionType.NeedsAttention]: palette.brand.orange, // 'Caution'
  [CompetencyResourceStatusDescriptionType.PartiallyCompleted]: palette.brand.orange,
  [CompetencyResourceStatusDescriptionType.Caution]: palette.brand.orange,

  [CompetencyResourceStatusDescriptionType.Blocked]: palette.brand.red,
  [CompetencyResourceStatusDescriptionType.AtRisk]: palette.brand.red,
  [CompetencyResourceStatusDescriptionType.OffTrack]: palette.brand.red,
  [CompetencyResourceStatusDescriptionType.Missed]: palette.brand.red,
  [CompetencyResourceStatusDescriptionType.Behind]: palette.brand.red,
};

export type LabelType = Record<number | string, string>;

export const PersonalDevelopmentStatusLabels = {
  [PDPStatusEnum.Active]: 'Active',
  [PDPStatusEnum.Completed]: 'Completed',
  [PDPStatusEnum.Draft]: 'Draft',
  [PDPStatusEnum.PendingReview]: 'Pending Review',
  [PDPStatusEnum.Closed]: 'Closed',
};

export const pdpStatusColor: Record<number, string> = {
  [PDPStatusEnum.Active]: palette.brand.green,
  [PDPStatusEnum.Completed]: palette.brand.green,
  [PDPStatusEnum.Draft]: palette.neutrals.gray600,
  [PDPStatusEnum.PendingReview]: palette.brand.orange,
  [PDPStatusEnum.Closed]: palette.brand.red,
};

export const PersonalDevelopmentStatuses: PersonalDevelopmentTypeOption[] = [
  {
    value: PDPStatusEnum.Active,
    text: PersonalDevelopmentStatusLabels[PDPStatusEnum.Active],
  },
  {
    value: PDPStatusEnum.Completed,
    text: PersonalDevelopmentStatusLabels[PDPStatusEnum.Completed],
  },
  {
    value: PDPStatusEnum.Draft,
    text: PersonalDevelopmentStatusLabels[PDPStatusEnum.Draft],
  },
  {
    value: PDPStatusEnum.PendingReview,
    text: PersonalDevelopmentStatusLabels[PDPStatusEnum.PendingReview],
  },
  {
    value: PDPStatusEnum.Closed,
    text: PersonalDevelopmentStatusLabels[PDPStatusEnum.Closed],
  },
];

export const PERSONAL_DEVELOPMENT_TABS_LABELS = {
  Plan: {
    Label: 'Plans',
    Value: TabType.Plan,
  },
};

export const PERSONAL_DEVELOPMENT_TABS = [
  {
    label: PERSONAL_DEVELOPMENT_TABS_LABELS.Plan.Label,
    value: PERSONAL_DEVELOPMENT_TABS_LABELS.Plan.Value,
    toObject: {
      pathname: DevelopmentPlanRoutes?.OtherPlans,
      search: `?tab=${PERSONAL_DEVELOPMENT_TABS_LABELS.Plan.Value}`,
    },
    'data-test-id': 'personalDevelopmentTab',
  },
];

export const COMPETENCY_RESOURCE_TABS_LABELS = {
  Steps: {
    Label: 'Steps',
    Value: TabType.Steps,
  },
  Accomplishments: {
    Label: 'Accomplishments',
    Value: TabType.Accomplishments,
  },
};

export const COMPETENCY_RESOURCE_TABS = [
  {
    label: COMPETENCY_RESOURCE_TABS_LABELS.Steps.Label,
    value: COMPETENCY_RESOURCE_TABS_LABELS.Steps.Value,
    toObject: {
      pathname: DevelopmentPlanRoutes?.OtherPlans,
      search: `?tab=${COMPETENCY_RESOURCE_TABS_LABELS.Steps.Value}`,
    },
    'data-test-id': 'personalStepsTab',
  },
  {
    label: COMPETENCY_RESOURCE_TABS_LABELS.Accomplishments.Label,
    value: COMPETENCY_RESOURCE_TABS_LABELS.Accomplishments.Value,
    toObject: {
      pathname: DevelopmentPlanRoutes?.OtherPlans,
      search: `?tab=${COMPETENCY_RESOURCE_TABS_LABELS.Accomplishments.Value}`,
    },
    'data-test-id': 'personalAccomplishmentsTab',
  },
];

export const DEFAULT_USER = {
  orgUserId: getOrganizationUserId() ?? '',
  firstName: '',
  lastName: '',
  profileImageUrl: '',
  jobTitle: '',
};
export const DEFAULT_COMPETENCY = {
  id: 0,
  name: '',
  description: '',
  createdBy: DEFAULT_USER,
  createdDate: new Date(),
  modifiedDate: new Date(),
  isDeleted: false,
};

export const DEFAULT_COMMENT = {
  id: 0,
  content: '',
  createdDate: new Date(),
  modifiedDate: new Date(),
  isDeleted: false,
  createdBy: DEFAULT_USER,
  isSystemGenerated: false,
  isApprovalComment: false,
  isFinalThought: false,
  pdpId: 0,
};

export const DEFAULT_STATUS = {
  id: PDPStatusEnum.Draft,
  description: 'Draft',
};

const currentDate = new Date();
const futureDate = new Date();
futureDate.setDate(currentDate.getDate() + 90);

export const DEFAULT_PDP = {
  id: 0,
  name: '',
  summary: '',
  startDate: currentDate,
  endDate: futureDate,
  mentor: undefined as unknown as OrgUser,
  status: DEFAULT_STATUS,
  owner: DEFAULT_USER,
  milestonesCompleted: 0,
  milestonesTotal: 0,
  isCompleted: false,
  role: {} as PDPRole,
  nextResource: {} as NextResource,
  viewers: [],
  createdDate: currentDate,
  modifiedDate: currentDate,
  isDeleted: false,
  createdBy: DEFAULT_USER,
  competencies: [DEFAULT_COMPETENCY],
  permissions: [],
};

export const DEFAULT_RESOURCE_COMPETENCY = {
  competencyId: 0,
  contentTypeId: 1,
  contentId: '',
};

export const DEFAULT_ACCOMPLISHMENT: Accomplishment = {
  id: 0,
  date: new Date(),
  title: '',
  description: '',
  orgUserId: '',
};

// Using this as I can see this growing over time so wanted to make it global
export const CompletedStatuses = [
  CompetencyResourceStatusDescriptionType.Complete,
  CompetencyResourceStatusDescriptionType.Completed,
];
