import { IconDefinition, faCircle, faSquare } from '@fortawesome/pro-solid-svg-icons';
import { Goals } from '@josh-hr/types';
import { ReactNode } from 'react';
import {
  palette, colors, PaletteObject,
} from '~Common/styles/colors';

import { palette as paletteRedesign } from '~Common/styles/colorsRedesign';
import { MeetingFrequency } from '~Meetings/const/meetingsInterfaces';
/**
 * RequireSome allows picking specific props of a type
 * usefully while reusing components and
 * differences of data returned from endpoints versions.
 * ie. v3: Goals.statusUpdates (Object[]) vs v4: GoalsV4.currentStatusUpdate (Object)
 *
 * @example
 * ```typescript
 * type Example = RequireSome<{ a: string, b: string }, 'a'>;
 * // { a: string }
 * ```
 *
 * @template T - The type to be modified
 * @template K - The keys of T to be required, string
 * @returns A type that is a partial of T and a pick of K
*/
export type RequireSome<T, K extends keyof T> = Partial<T> & Pick<T, K>

export interface GoalDetailsParams {
  goalId: string,
}

export enum ViewPerspective {
  Open = 'open',
  Completed = 'completed',
  Create = 'create',
}
export interface GoalTypeOption<T extends string | number> {
  value: T,
  text: string,
}

export function getGoalStatusIcon(status: Goals.GoalStatus): IconDefinition {
  if (Goals.isGoalStatusComplete(status)) {
    return faSquare;
  }

  return faCircle;
}

export const GoalStatusColor: Record<Goals.GoalStatus, string> = {
  [Goals.GoalStatus.OnTrack]: palette.brand.green,
  [Goals.GoalStatus.Caution]: palette.brand.orange,
  [Goals.GoalStatus.Behind]: palette.brand.red,
  [Goals.GoalStatus.Blocked]: palette.neutrals.gray600,

  [Goals.GoalStatus.Completed]: palette.brand.green,
  [Goals.GoalStatus.PartiallyCompleted]: palette.brand.orange,
  [Goals.GoalStatus.Partial]: palette.brand.orange,
  [Goals.GoalStatus.Missed]: palette.brand.red,
  [Goals.GoalStatus.Canceled]: palette.neutrals.gray600,
  [Goals.GoalStatus.NeedsAttention]: palette.brand.orange,
  [Goals.GoalStatus.AtRisk]: palette.brand.red,
  [Goals.GoalStatus.OnHold]: paletteRedesign.utility.gray[400],
};

export const getGoalStatusColorPaletteObject = (status: Goals.GoalStatus): PaletteObject => {
  switch (status) {
    case Goals.GoalStatus.OnTrack:
    case Goals.GoalStatus.Completed:
      return colors.success;
    case Goals.GoalStatus.Caution:
    case Goals.GoalStatus.PartiallyCompleted:
    case Goals.GoalStatus.NeedsAttention:
      return colors.warning;
    case Goals.GoalStatus.Behind:
    case Goals.GoalStatus.Missed:
    case Goals.GoalStatus.AtRisk:
      return colors.error;
    case Goals.GoalStatus.Canceled:
    case Goals.GoalStatus.OnHold:
      return colors.gray;
    default:
      return colors.gray;
  }
};

export const OpenGoalStatuses: Goals.GoalStatus[] = [
  Goals.GoalStatus.OnTrack,
  Goals.GoalStatus.NeedsAttention, // Once we're on v4, we can add this back
  Goals.GoalStatus.AtRisk, // v4
  Goals.GoalStatus.OnHold,

] as Goals.GoalStatus[];

export const OpenGoalStatusesV3: Goals.GoalStatus[] = [
  Goals.GoalStatus.OnTrack,
  Goals.GoalStatus.Caution, // v3 // Once we're on v4, we can remove this
  Goals.GoalStatus.Behind, // v3
  Goals.GoalStatus.OnHold,

] as Goals.GoalStatus[];

export const OpenGoalStatusFilters: (Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[] = [
  ...OpenGoalStatuses,
  Goals.AdditionalGoalStatusFilters.Exceeded,
];

export const ClosedGoalStatuses: Goals.GoalStatus[] = [
  Goals.GoalStatus.Completed,
  Goals.GoalStatus.PartiallyCompleted,
  Goals.GoalStatus.Missed,
  Goals.GoalStatus.Canceled,
] as Goals.GoalStatus[];

export const GoalStates: Goals.GoalStatus[] = [
  Goals.GoalStatus.OnTrack,
  // Goals.GoalStatus.Caution, // Once we're on v4, we can remove this
  Goals.GoalStatus.NeedsAttention, // Once we're on v4, we can add this back
  Goals.GoalStatus.Behind,
  Goals.GoalStatus.Completed,
  Goals.GoalStatus.PartiallyCompleted,
  Goals.GoalStatus.Missed,
  Goals.GoalStatus.Canceled,
] as Goals.GoalStatus[];

export const ClosedGoalStatusFilters: (Goals.GoalStatus | Goals.AdditionalGoalStatusFilters)[] = [
  Goals.AdditionalGoalStatusFilters.Exceeded,
  ...ClosedGoalStatuses,
];

export type SelectOption = {
  label: string,
  value: string,
  profileImage: string | undefined,
  jobTitle: string | undefined,
  showIcon?: boolean,
  leftIcon?: ReactNode,
}

export type ValidationErrors = {
  errors: string[];
};

export interface GoalAssignee {
  orgUserId: string,
  imgUrl?: string,
  name: string,
}
export interface GoalProgress {
  percentage: number,
  status: Goals.GoalStatus,
  measurementScale: Goals.MeasurementScale,
  isAchieved: AchievedNotToggleType | null,
}
export interface GoalProgressV4 {
  percentage: number,
  status: Goals.GoalStatus,
  measurementScale: Goals.CondensedMeasurementScale,
  isAchieved: AchievedNotToggleType | null,
  value: Goals.GoalStatusUpdate['value'] | Goals.MeasurementScale['currentValue'];
  statusUpdate: Goals.CondensedStatusUpdate;
  isComplete: Goals.GoalV4['isCompleted'] | boolean;
}

export interface GoalRow {
  category?: Goals.GoalCategory,
  contextName?: string,
  contextType: Goals.GoalContextType,
  endDate: number,
  id: string,
  isPrivate: boolean,
  owner: GoalAssignee,
  priority: string,
  progress: GoalProgress,
  role: string,
  startDate: number,
  subText?: string,
  title: string,
  totalChildGoals?: number,
}

export interface GoalRowV4 {
  category?: Goals.GoalCategory,
  contextName?: string,
  contextType: Goals.GoalContextType,
  endDate: number,
  goal: Goals.GoalV4,
  id: Goals.GoalV4['goalId'] | string,
  isPrivate: boolean,
  owner: GoalAssignee,
  permissions: Goals.GoalPermission[];
  priority: Record<Goals.GoalPriority, string>;
  progress: GoalProgressV4,
  role: Goals.GoalParticipantRole,
  subText?: string,
  title: Goals.GoalV4['title'],
  totalChildGoals?: number,
}

export interface CascadingGoalRow extends GoalRow {
  path: string[],
  totalChildGoals: number,
}

export interface CascadingGoalRowV4 extends GoalRowV4 {
  path: string[],
  totalChildGoals: number,
}

export enum LinkedGoalType {
  Parent = 'Parent',
  Supporting = 'Supporting',
}

export interface BackInformation {
  backText: string,
  location: string,
}

// NOTE These enums are reflected in the backend
export enum MeasurementScaleMetadataType {
  InitialValue = 1,
  TargetValue = 2,
}

export enum CurrentGoalValueType {
  CurrentValue = 3,
}

// FEATURE: Refactor with useGetMeasurementScaleTypes?
export enum MeasurementScaleType {
  IncreaseTo = 1,
  DecreaseTo = 2,
  AchievedOrNot = 3,
  KeepAbove = 4,
  KeepBelow = 5,
}

export enum AboveBelowType {
  Above = 'Above',
  Below = 'Below',
  Target = 'At Target',
}

export enum SystemMeasurementUnitType {
  Percentage = 1,
  Dollars = 2,
}

export type MeasurementUnitPosition = 1 | 2; // 'Prefix', 'Suffix'

export const AchievedNotToggle = {
  Achieved: true,
  NotAchieved: false,
} as const;

export type AchievedNotToggleType = typeof AchievedNotToggle[keyof typeof AchievedNotToggle];

export interface GoalCurrentMetadata {
  currentValue: Goals.GoalStatusUpdate['value'] | Goals.MeasurementScale['currentValue'];
  measurementUnitType: Goals.MeasurementUnit;
  targetValue?: Goals.MeasurementScaleMetadataValue['value'];
}

export enum MeasurementUnitOwnershipId {
  System = 1,
  Organization = 2,
  User = 3
}

export interface CreateCustomUnitRequestPayload {
  displayLabel: string;
  labelPositionId: Goals.LabelPositionId | number;
  organizationId: string;
  orgUserId: string;
  organizationOwned: boolean;
}

export enum unitTypeOwnershipIds {
  System = 1,
  Organization = 2,
}

export interface AutoCompleteOption {
  inputValue?: string;
  title: string;
  value: string;
  matchFrom?: 'any' | 'start';
  ignoreCase?: boolean;
}

export interface CurrencyUnit {
  name: string;
  displayLabel: string;
  labelPositionId: Goals.LabelPositionId;
}

export interface GetIsCurrencyProps {
  displayLabel: string,
  labelPositionId: Goals.LabelPositionId,
}

// FEATURE Update to use from types package when available
export interface GoalCardInfo {
  goalId: string;
  title: string;
  owner: {
    orgUserId: string;
    fullName: string;
    profileImageUrl: string;
  };
  currentStatusUpdate: {
    status: Goals.GoalStatus;
    statusCommentary: string;
    statusCommentarySummary: string;
    value: number | null;
    isAchieved: boolean | null;
    completionPercentage: number;
    createdAtInMillis: number;
  };
  category: Goals.GoalCategory;
  totalChildGoals: number;
  endTimeInMillis: number;
  measurementScale: Goals.CondensedMeasurementScale;
  context: {
    contextType: Goals.GoalContextType;
    contextId?: string;
  };// double check this goes here
}

export interface MeetingCardInfo {
  meetingFactoryId: string;
  attendees: {
    orgUserId: string;
    firstName: string;
    lastName: string;
    profileImageUrl: string;
  }[];
  nextMeetingInstance: {
    title: string;
    startTimeInMillis: number;
    recurrence?: MeetingFrequency
    agendaItemCount: number;
  };
}
