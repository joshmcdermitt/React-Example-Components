import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserLevelEnableCascadingGoalsStoreState {
  enable: boolean,
  setEnable: (enable: boolean) => void,
}

const useUserLevelEnableCascadingGoalsStore = create<UserLevelEnableCascadingGoalsStoreState>()(
  persist(
    (set) => ({
      enable: false, // default to false for now - will need to update this back later
      setEnable: (enable) => set({ enable }),
    }),
    {
      name: 'enableCascadingGoals',
    },
  ),
);

export const useUserLevelEnableCascadingGoals = (): boolean => useUserLevelEnableCascadingGoalsStore((state) => state.enable);
export const useSetUserLevelEnableCascadingGoals = (): (enable: boolean) => void => useUserLevelEnableCascadingGoalsStore((state) => state.setEnable);
