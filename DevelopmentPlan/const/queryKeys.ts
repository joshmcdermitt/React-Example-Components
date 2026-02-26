import { getOrganizationId } from '~Common/utils/localStorage';
import { GetCompetencyResourceSearchParams, GetMeetingsParams, GetPDPSearchParams } from './types';

export const pdpPlanMainKey = {
  all: [getOrganizationId() ?? '', 'pdps'] as const,
};

export const pdpPlanKeys = {
  all: [...pdpPlanMainKey.all] as const,
  lists: () => [...pdpPlanKeys.all, 'lists'] as const, // Basically the landing page
  list: (filters: GetPDPSearchParams) => [...pdpPlanKeys.lists(), 'list', filters] as const,
  details: () => [...pdpPlanKeys.all, 'details'] as const,
  detail: (id: string) => [...pdpPlanKeys.details(), id?.toLocaleString()] as const,
  comments: (id: string) => [...pdpPlanKeys.detail(id), 'comments', id?.toLocaleString()] as const,
  progressBar: (id: string) => [...pdpPlanKeys.detail(id), 'progressBar', id?.toLocaleString()] as const,
  // eslint-disable-next-line max-len
  competencyResources: (id: string, filters?: GetCompetencyResourceSearchParams) => {
    if (filters) {
      return [...pdpPlanKeys.detail(id), 'competencyResources', id?.toLocaleString(), filters] as const;
    }
    return [...pdpPlanKeys.detail(id), 'competencyResources', id?.toLocaleString()] as const;
  },
  competencies: (id: string) => [...pdpPlanKeys.detail(id), 'competencies', id?.toLocaleString()] as const,
  finalThoughts: (id: string) => [...pdpPlanKeys.detail(id), 'finalThoughts', id?.toLocaleString()] as const,
  meetings: (id: string, filters?: GetMeetingsParams) => [...pdpPlanKeys.detail(id), 'meetings', id?.toLocaleString(), filters] as const,
  oneOnOneMeetings: (id: string) => [...pdpPlanKeys.detail(id), 'oneOnOneMeetings', id?.toLocaleString()] as const,
};
