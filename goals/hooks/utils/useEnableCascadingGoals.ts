import { useOrgDetailsContext } from '~Common/V3/components/OrgDetailsContext';
import { useUserLevelEnableCascadingGoals } from '~Goals/stores/useUserLevelEnableCascadingGoals';

interface UseEnableCascadingGoalsReturn {
  orgLevelEnableCascadingGoals: boolean,
  userLevelEnableCascadingGoals: boolean,
}

export const useEnableCascadingGoals = (): UseEnableCascadingGoalsReturn => {
  const { orgSettings } = useOrgDetailsContext();
  const orgLevelEnableCascadingGoals = orgSettings.enableCascadingGoals;
  const userLevelEnableCascadingGoals = useUserLevelEnableCascadingGoals();

  return {
    orgLevelEnableCascadingGoals,
    userLevelEnableCascadingGoals,
  };
};
