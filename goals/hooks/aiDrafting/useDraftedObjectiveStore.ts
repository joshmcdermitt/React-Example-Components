import { Goals } from '@josh-hr/types';
import { create } from 'zustand';

export const useDraftedObjectiveStore = create<DraftedObjectivesStore>((set) => ({
  draftedObjective: null,
  setDraftedObjective: (objective: DraftedObjective | null) => set(() => ({
    draftedObjective: objective,
  })),
  removeDraftedObjective: () => set(() => ({
    draftedObjective: null,
  })),
}));

export type DraftedObjective = Omit<Goals.Goal, 'goalId'> & {
  customUnit?: string;
  customLabelPosition?: Goals.LabelPositionId;
  measurementUnitTypeId?: number;
};

export type DraftedObjectivesStore = {
  draftedObjective: DraftedObjective | null;
  setDraftedObjective: (objective: DraftedObjective | null) => void;
  removeDraftedObjective: () => void;
};
