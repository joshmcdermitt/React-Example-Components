import { OrgUser, UserInfo } from '@josh-hr/types';
import { HTMLString } from '~Common/types';
import { MeetingFrequency } from '~Meetings/const/meetingsInterfaces';
import { MeetingInstance } from '~Meetings/const/meetingsSearchInterfaces';

export type SelectOption = {
  label: string,
  value: string,
  profileImage: string | undefined,
  jobTitle: string | undefined,
};

export enum ViewPerspective {
  OtherPlans = 'otherPlans',
  MyPlans = 'myPlans',
}
export enum TabType {
  Plan = 'Plans',
  Steps = 'Steps',
  Accomplishments = 'Accomplishments',
}
export enum PersonalDevelopmentType {
  Active = 'Active',
  Completed = 'Completed',
}

export interface Accomplishment {
  id: number,
  title: string,
  description: string,
  date: Date,
  orgUserId: string
}

export interface AllPDPs {
  Active: PDPList[],
  Completed: PDPList[],
}
export interface PDPList{
  id: number,
  name: string,
  summary: string,
  startDate: string | Date,
  endDate: string | Date,
  mentor: OrgUser,
  status: PDPStatus,
  owner: PDPOwner,
  milestonesCompleted: number,
  milestonesTotal: number,
  isCompleted: boolean,
  role: PDPRole,
  nextResource: NextResource,
}

export interface BasicPdp {
  id: number,
  name: string,
}

export interface PDPOwner {
  id?: number,
  firstName: string,
  jobTitle: string,
  lastName: string,
  orgId?: string,
  orgUserId: string,
  profileImageUrl: string,
  userId?: string,
}

export interface NextResource {
  contentDueDate: Date | string,
  contentId: number,
  contentTitle: string,
  contentType: ContentType,
  createdBy: OrgUser,
  createdDate: Date | string,
  id: number,
  isDeleted: boolean,
  modifiedDate: Date | string,
  role: PDPRole,
  status: PDPStatus,
}

export interface ContentType {
  id: ResourceType,
  description: keyof ResourceType,
}
export interface PDP extends PDPList{
  createdDate: Date | string,
  modifiedDate: Date | string,
  isDeleted: boolean,
  createdBy: OrgUser,
  competencies: Competency[],
  viewers: OrgUser[],
  permissions: PDPPermissions[],
}

export interface CreatePlan {
  name: string,
  summary: string,
  startDate: Date,
  endDate: Date,
  mentorId: string[],
  viewers: string[],
}

export interface Competency{
  createdBy: OrgUser,
  createdDate: Date,
  description: HTMLString,
  id: number,
  isDeleted: boolean,
  modifiedDate: Date,
  name: string,
  resources?: CompetencyResource[],
  pdpId?: number,
}

export interface FoundCompetencyResult {
  name: string;
  id: number;
}

export interface PDPStatus{
  id: PDPStatusEnum,
  description: string,
}

export interface ProgressBar{
  startDate: Date,
  endDate: Date,
  progress: number, // - % of time that has passed between start and end dates - Not to go over 100
  plotPoints: PlotPoint[],
}

export interface PlotPoint{
  percentage: number,
  competencyResource: CompetencyResource,
}

export enum PDPStatusEnum{
  Draft = 1,
  PendingReview = 2,
  Active = 3,
  Completed = 4,
  Closed = 5,
}

export enum PDPMobileModals {
  Discussion = 'Discussion',
  Timeline = 'Timeline',
}

export enum PDPPermissions {
  CanCreate = 'canCreate',
  CanView = 'canView',
  CanEdit = 'canEdit',
  CanComplete = 'canComplete',
  CanDelete = 'canDelete',
  CanUnlink = 'canUnlink',
  CanClose = 'canClose',
  CanComment = 'canComment',
  canReopen = 'canReopen',
}

export enum ActionMenuActions {
  MarkComplete = 'markComplete',
  Unlink = 'unlink',
  ReOpenPlan = 'reOpenPlan',
  EditCompetencies = 'editCompetencies',
  EditDetails = 'editDetails',
  DeletePlan = 'deletePlan',
  ClosePlan = 'closePlan',
}

export interface PersonalDevelopmentTypeOption {
  value: string | number,
  text: string,
}

export enum PDPRoleType{
  Viewer = 'Viewer',
  Mentor = 'Mentor',
}

export interface PDPRole{
  id: number,
  description: PDPRoleType,
}

export enum PersonalDevelopmentTabs {
  Plans = 'Plans',
}

export interface GetPDPSearchParams{
  Search?: string,
  StartDate?: Date,
  EndDate?: Date,
  Index?: number,
  Limit?: number,
  SortDirection?: string,
  SortField?: string,
}

export interface GetCompetencyResourceSearchParams{
  StartDate?: Date,
  EndDate?: Date,
  ContentTypes?: ResourceType[],
  Competency?: number[],
  SortDirection?: string,
  SortField?: string,
  Index?: number,
  Limit?: number,
}
export interface GetMeetingsParams{
  RangeStartInMillis?: number,
  RangeEndInMillis?: number,
  Skip?: number,
  Take?: number,
  TitleContains?: string,
}

export enum GetPersonalDevelopmentSearchField {
  Name = 'name',
  Summary = 'summary',
  OwnerName = 'ownerName',
  MentorName = 'mentorName',
  All = 'all'
}

export enum GetPersonalDevelopmentSortBy {
  Name = 'name',
  Status = 'StatusId',
  DueDate = 'EndDate',
}
export enum GetPersonalDevelopmentResourceSortBy {
  Title = 'contentTitle',
  Status = 'StatusId',
  DueDate = 'ContentDueDate',
}
export enum GetPersonalDevelopmentSortOrder {
  Ascending = 'asc',
  Descending = 'desc'
}

export interface PersonalDevelopmentRow {
  id: string,
  owner: OrgUser,
  name: string,
  itemsCompleted:ItemsCompleted,
  itemDue: NextResource,
  role: PDPRoleType,
  status:PDPStatus,
}

export interface CompetencyRow {
  id: number,
  title: CompetencyTableTitle,
  competency: FoundCompetencyResult,
  dueDate: string,
  status: CompetencyResourceStatus,
  actions: number,
  owner: CompetencyTableOwner,
  resourceContentId: string,
}

export interface CompetencyTableTitle {
  title: string,
  resourceTypeId: number,
}

export interface CompetencyTableOwner {
  userId: string,
  orgUserId: string,
}

export interface CompetencyResource {
  id: number,
  createdDate: Date,
  modifiedDate: Date,
  isDeleted: boolean,
  createdBy: OrgUser,
  contentType: ContentType,
  contentId: string, // FeedbackID, MeetingID ....
  contentTitle: string,
  contentDueDate: string,
  role: PDPRole,
  status: CompetencyResourceStatus,
  competencyName: string, // This links the name to the parent
  competencies?: Competency[],
}

export enum ResourceType {
  All = 1,
  Goal = 2,
  Learning = 3,
  Feedback = 4,
  ActionItem = 5,
  Recognition = 6,
  Accomplishment = 7,
  Meeting = 8,
  LearningPlaylist = 9,
}
export interface CompetencyResourceStatus {
  id: CompetencyResourceStatusEnum,
  description: CompetencyResourceStatusDescriptionType,
}

// These come from the Backend
export enum CompetencyResourceStatusDescriptionType {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Complete = 'Complete',
  Incompleted = 'Incomplete',
  ToDo = 'To Do',
  Blocked = 'Blocked',
  OnTrack = 'On track',
  AtRisk = 'At risk',
  OffTrack = 'Off track',
  Completed = 'Completed',
  PartiallyCompleted = 'Partially completed',
  Missed = 'Missed',
  Cancelled = 'Cancelled',
  Behind = 'Behind',
  Caution = 'Caution',
  OnHold = 'On hold',
  NeedsAttention = 'Needs attention',
}

export enum CompetencyResourceStatusEnum {
  NotStarted = 1,
  InProgress = 2,
  Complete = 3,
  Incompleted = 4,
  ToDo = 5,
  Blocked = 6,
  OnTrack = 7,
  AtRisk = 8,
  OffTrack = 9,
  Completed = 10,
  PartiallyCompleted = 11,
  Missed = 12,
  Cancelled = 13,
  Behind = 14,
  Caution = 15,
}

// These are FE defined labels to display to the user
export const CompetencyResourceStatusLabels = {
  [CompetencyResourceStatusEnum.NotStarted]: 'Not Started',
  [CompetencyResourceStatusEnum.InProgress]: 'In Progress',
  [CompetencyResourceStatusEnum.Complete]: 'Complete',
  [CompetencyResourceStatusEnum.Incompleted]: 'Incomplete',
  [CompetencyResourceStatusEnum.ToDo]: 'To Do',
  [CompetencyResourceStatusEnum.Blocked]: 'Blocked',
  [CompetencyResourceStatusEnum.OnTrack]: 'On track',
  [CompetencyResourceStatusEnum.AtRisk]: 'Needs attention',
  [CompetencyResourceStatusEnum.OffTrack]: 'At risk',
  [CompetencyResourceStatusEnum.Completed]: 'Completed',
  [CompetencyResourceStatusEnum.PartiallyCompleted]: 'Partially completed',
  [CompetencyResourceStatusEnum.Missed]: 'Missed',
  [CompetencyResourceStatusEnum.Cancelled]: 'Cancelled',
  [CompetencyResourceStatusEnum.Behind]: 'Behind',
  [CompetencyResourceStatusEnum.Caution]: 'Needs attention',
};

export interface ItemsCompleted {
  milestonesCompleted: number,
  milestonesTotal: number,
}

export interface Comment {
  id: number,
  content: HTMLString,
  createdDate: Date,
  modifiedDate: Date,
  isDeleted: boolean,
  createdBy: OrgUser,
  isSystemGenerated: boolean,
  isApprovalComment: boolean,
  isFinalThought: boolean,
  pdpId: number,
}

export interface Meeting {
  daysOfWeek: number[],
  frequency: MeetingFrequency,
  meetingFactoryId: string,
  meetingFactoryType: string,
  meetingInstances: MeetingInstance[],
  seriesOwner: UserInfo[],
  meetingAttendees: UserInfo[],
}

export enum ViewPersonalDevelopmentPlanPerspective {
  Setup = 'setup',
  Create_Plan = 'plan',
  Submit_for_Review = 'submit',
}

export const PersonalDevelopmentPlanSteps = {
  [ViewPersonalDevelopmentPlanPerspective.Setup]: 0,
  [ViewPersonalDevelopmentPlanPerspective.Create_Plan]: 1,
  [ViewPersonalDevelopmentPlanPerspective.Submit_for_Review]: 2,
};

export type TextItem = {
  error: string;
  success: string;
};
export type ResourceToastText = Record<number, TextItem>;

export interface AnalyzeFinalThoughtsProps {
  showBlankState: boolean;
  hasOwner: boolean;
  hasMentor: boolean;
  missingPerson: OrgUser | undefined;
}
