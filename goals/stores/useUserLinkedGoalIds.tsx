import { useCallback, useMemo, useState } from 'react';

export interface UseUserLinkedGoalIdsReturn {
  userLinkedGoalIds: string[],
  addLinkedGoalIds: (goalIds: string[]) => void,
  removeLinkedGoalIds: (goalIds: string[]) => void,
  replaceLinkedGoalIds: (linkedGoalIds: string[]) => void,
  hasUnsavedLinkedGoals: boolean,
}

const useUserLinkedGoalIds = (initialLinkedGoalIds: string[]): UseUserLinkedGoalIdsReturn => {
  const [userLinkedGoalIds, setUserLinkedGoals] = useState<string[]>(initialLinkedGoalIds);

  const addLinkedGoalIds = useCallback((goalIds: string[]) => setUserLinkedGoals([...userLinkedGoalIds, ...goalIds]), [userLinkedGoalIds]);
  const removeLinkedGoalIds = useCallback(
    (goalIds: string[]) => setUserLinkedGoals(userLinkedGoalIds.filter((id) => !goalIds.includes(id))),
    [userLinkedGoalIds],
  );
  const replaceLinkedGoalIds = useCallback((linkedGoalIds: string[]): void => setUserLinkedGoals(linkedGoalIds), []);

  const hasUnsavedLinkedGoals = useMemo(() => {
    const hasAddedGoals = userLinkedGoalIds.some((id) => !initialLinkedGoalIds.includes(id));
    const hasRemovedGoals = initialLinkedGoalIds.some((id) => !userLinkedGoalIds.includes(id));
    return hasAddedGoals || hasRemovedGoals;
  }, [initialLinkedGoalIds, userLinkedGoalIds]);

  return {
    userLinkedGoalIds,
    addLinkedGoalIds,
    removeLinkedGoalIds,
    replaceLinkedGoalIds,
    hasUnsavedLinkedGoals,
  };
};

export default useUserLinkedGoalIds;
