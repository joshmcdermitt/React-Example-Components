import { Goals } from '@josh-hr/types';
import { AboveBelowType } from './types';

export function formatGoalsFilters(priority: string | string[]): string {
  // Replace '^' with ','
  return String(priority).replace(/\^/g, ',');
}

export interface UpdateGoalPayloads {
  goalPayload: Goals.Requests.UpdateGoalRequestPayload,
  participantsPayload: Goals.Requests.UpdateGoalParticipantsRequestPayload,
}

export const setupPayloads = (formDataToSetup: Goals.Requests.CreateGoalRequestPayload): UpdateGoalPayloads => {
  const { participants, ...goalPayload } = formDataToSetup;
  // Should never come to this but just in case I wanted to have a fallback so we're not wiping out the participants
  const filteredParticipants = participants?.filter((participant) => !!participant.role) ?? [];
  const participantsPayload = { participants: filteredParticipants };
  return { participantsPayload, goalPayload };
};

export const getAboveBelowStatus = (
  currentValue: number,
  targetValue: number,
): AboveBelowType => {
  if (currentValue > targetValue) return AboveBelowType.Above;
  if (currentValue < targetValue) return AboveBelowType.Below;
  return AboveBelowType.Target;
};

export const formatStatusCase = (str: string): string => {
  if (!str) return ''; // Handle empty or null strings
  const lowercasedStr = str.toLowerCase();
  return lowercasedStr.charAt(0).toUpperCase() + lowercasedStr.slice(1);
};

export const formatStatusCaseCapitalize = (str: string): string => {
  if (!str) return ''; // Handle empty or null strings
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
