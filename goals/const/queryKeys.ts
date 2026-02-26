import { getOrganizationId } from '~Common/utils/localStorage';
import { Goals } from '@josh-hr/types';

export const goalMainKey = {
  all: [getOrganizationId() ?? '', 'goals'] as const,
};

export const goalKeys = {
  all: [...goalMainKey.all] as const,
  lists: () => [...goalKeys.all, 'lists'] as const, // Basically the landing page
  list: (filters: Goals.Requests.GetGoalsRequestQueryParameters
    | Goals.Requests.GetGoalsRequestBody) => [...goalKeys.lists(), 'list', filters] as const,
  forCoaching: (
    meetingFactoryId: string,
    queryParameters?: Goals.Requests.GetGoalsForOneOnOneMeetingRequestQueryParameters,
  ) => [...goalKeys.all, 'coaching', meetingFactoryId, queryParameters] as const,
  forTeam: (teamId: string) => [...goalKeys.all, 'team', teamId] as const,
  details: () => [...goalKeys.lists(), 'details'] as const,
  detail: (id: string) => [...goalKeys.details(), id?.toLocaleString()] as const,
  linkedGoals: (id: string) => [...goalKeys.detail(id), 'linkedGoals'] as const,
  linkableGoals: (id: string) => [...goalKeys.detail(id), 'linkableGoals'] as const,
  linkableParentGoals: (
    id: string,
    queryParams?: Goals.Requests.GetLinkableParentGoalsRequestQueryParameters,
  ) => [...goalKeys.linkableGoals(id), 'parent', queryParams] as const,
  linkableChildGoals: (
    id: string,
    queryParams?: Goals.Requests.GetLinkableChildGoalsRequestQueryParameters,
  ) => [...goalKeys.linkableGoals(id), 'child', queryParams] as const,
  scaleTypes: () => [getOrganizationId() ?? '', 'scaleTypes'] as const,
  unitTypes: () => [getOrganizationId() ?? '', 'unitTypes'] as const,
  performanceSnapshots: () => [...goalKeys.all, 'performanceSnapshots'] as const,
  performanceSnapshot: (
    filters: Goals.Requests.GetPerformanceSnapshotRequestBody,
  ) => [...goalKeys.performanceSnapshots(), 'snapshot', filters] as const,
  historicalPerformanceSnapshot: (
    filters: Goals.Requests.GetPerformanceSnapshotRequestBody,
  ) => [...goalKeys.performanceSnapshots(), 'historical', filters] as const,
};
