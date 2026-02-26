import { Goals } from '@josh-hr/types';

export const useGoalSearchField = (
  searchText: string | undefined,
): Goals.GetGoalsSearchField | undefined => (searchText ? Goals.GetGoalsSearchField.Title : undefined);
