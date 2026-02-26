import create from 'zustand';

interface AIDraftingStoreState {
  showObjectivesAIDraftingTool: boolean;
  setShowObjectivesAIDraftingTool: (shouldShow: boolean) => void;
}

const useAIDraftingStore = create<AIDraftingStoreState>((set) => ({
  showObjectivesAIDraftingTool: false,
  setShowObjectivesAIDraftingTool: (shouldShow) => set({ showObjectivesAIDraftingTool: shouldShow }),
}));

export default useAIDraftingStore;
