import { createStore, useStore } from 'zustand';
import { DEFAULT_DATE, DEFAULT_RESOURCE_TITLE, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { CompetencyResourceStatusEnum, ResourceType } from '~DevelopmentPlan/const/types';

interface AddResourceModalState {
  showAddResourceModal: boolean,
  openAddResourceModal: (resourceId: ResourceType, competencyId: number, isEdit?: boolean) => void,
  closeAddResourceModal: () => void,
  showApprovePlanModal: boolean,
  openApprovePlanModal: () => void,
  closeApprovePlanModal: () => void,
  showViewResourceModal: boolean,
  openViewResourceModal: (resourceTypeId: ResourceType, competencyId: number, resourceContentId: string | number, isViewing?: boolean) => void,
  closeViewResourceModal: () => void,
  resourceId?: ResourceType,
  pdpId?: string,
  competencyId?: number,
  setCompetencyId: (id: number) => void,
  setResourceId: (id: number) => void,
  setPdpId: (id: string) => void,
  searchText: string,
  setSearchText: (text: string) => void,
  showAddCompetencyForm: boolean,
  setShowAddCompetencyForm: (show: boolean) => void,
  showAddCommentForm: boolean,
  setShowAddCommentForm: (show: boolean) => void,
  resourceContentTitle?: string,
  setResourceContentTitle: (title: string) => void,
  resourceContentDueDate?: Date,
  setResourceContentDueDate: (date: Date) => void,
  planDueDate: string | Date,
  setPlanDueDate: (date: string | Date) => void,
  planStartDate: string | Date,
  setPlanStartDate: (date: string | Date) => void,
  resourceContentId: string | number,
  setResourceContentId: (resourceContentId: string | number) => void,
  resourceContentStatus: CompetencyResourceStatusEnum,
  setResourceContentStatus: (resourceContentStatus: CompetencyResourceStatusEnum) => void,
  isViewing?: boolean,
  setIsViewing: (state: boolean) => void,
  showDeleteResourceModal: boolean,
  openDeleteResourceModal: () => void,
  closeDeleteResourceModal: () => void,
  showDeletePlanModal: boolean,
  openDeletePlanModal: () => void,
  closeDeletePlanModal: () => void,
  showReopenPlanModal: boolean,
  openReopenPlanModal: () => void,
  closeReopenPlanModal: () => void,
  showPdpMobileModal: boolean,
  openPdpMobileModal: () => void,
  closePdpMobileModal: () => void,
  pdpOwnerId?: string,
  setPdpOwnerId: (id: string) => void,
  pdpOwnerUserId?: string,
  setPdpOwnerUserId: (id: string) => void,
}

export const addResourceModalStore = createStore<AddResourceModalState>()((set) => ({
  searchText: '',
  setSearchText: (text: string) => set(() => ({ searchText: text })),
  setCompetencyId: (id: number) => set(() => ({ competencyId: id })),
  setResourceId: (id: number) => set(() => ({ resourceId: id })),
  setPdpId: (id: string) => set(() => ({ pdpId: id })),
  showAddResourceModal: false,
  openAddResourceModal: (resourceId: ResourceType, competencyId: number, isViewing?: boolean) => {
    set(() => ({
      showAddResourceModal: true,
      resourceId,
      competencyId,
      isViewing: isViewing || false,
    }));
  },
  closeAddResourceModal: () => {
    set(() => ({
      showAddResourceModal: false,
      resourceId: undefined,
      competencyId: undefined,
      searchText: '',
    }));
  },
  showApprovePlanModal: false,
  openApprovePlanModal: () => {
    set(() => ({
      showApprovePlanModal: true,
    }));
  },
  closeApprovePlanModal: () => {
    set(() => ({
      showApprovePlanModal: false,
    }));
  },
  showViewResourceModal: false,
  openViewResourceModal: (resourceId: ResourceType, competencyId: number, resourceContentId: string | number, isViewing?: boolean) => {
    set(() => ({
      showViewResourceModal: true,
      resourceId,
      competencyId,
      resourceContentId,
      isViewing: isViewing || false,
    }));
  },
  closeViewResourceModal: () => {
    set(() => ({
      showViewResourceModal: false,
      resourceId: undefined,
      competencyId: undefined,
      resourceContentId: undefined,
      pdpId: undefined,
    }));
  },
  showAddCompetencyForm: false,
  setShowAddCompetencyForm: (show: boolean) => set(() => ({ showAddCompetencyForm: show })),
  showAddCommentForm: false,
  setShowAddCommentForm: (show: boolean) => set(() => ({ showAddCommentForm: show })),
  resourceContentTitle: DEFAULT_RESOURCE_TITLE,
  setResourceContentTitle: (title: string) => set(() => ({ resourceContentTitle: title })),
  resourceContentDueDate: DEFAULT_DATE,
  setResourceContentDueDate: (date: Date) => set(() => ({ resourceContentDueDate: date })),
  planDueDate: DEFAULT_DATE,
  setPlanDueDate: (date: string | Date) => set(() => ({ planDueDate: date })),
  planStartDate: DEFAULT_DATE,
  setPlanStartDate: (date: string | Date) => set(() => ({ planStartDate: date })),
  resourceContentId: OPTIMISTIC_ID,
  setResourceContentId: (contentId: number | string) => set(() => ({ resourceContentId: contentId })),
  resourceContentStatus: CompetencyResourceStatusEnum.NotStarted,
  setResourceContentStatus: (statusId: CompetencyResourceStatusEnum) => set(() => ({ resourceContentStatus: statusId })),
  setIsViewing: (state: boolean) => set(() => ({ isViewing: state })),
  pdpOwnerId: '',
  setPdpOwnerId: (ownerId: string) => set(() => ({ pdpOwnerId: ownerId })),
  pdpOwnerUserId: '',
  setPdpOwnerUserId: (ownerId: string) => set(() => ({ pdpOwnerUserId: ownerId })),
  showDeleteResourceModal: false,
  openDeleteResourceModal: () => set(() => ({ showDeleteResourceModal: true })),
  closeDeleteResourceModal: () => set(() => ({ showDeleteResourceModal: false })),
  showDeletePlanModal: false,
  openDeletePlanModal: () => set(() => ({ showDeletePlanModal: true })),
  closeDeletePlanModal: () => set(() => ({ showDeletePlanModal: false })),
  showReopenPlanModal: false,
  openReopenPlanModal: () => set(() => ({ showReopenPlanModal: true })),
  closeReopenPlanModal: () => set(() => ({ showReopenPlanModal: false })),
  showPdpMobileModal: false,
  openPdpMobileModal: () => set(() => ({ showPdpMobileModal: true })),
  closePdpMobileModal: () => set(() => ({ showPdpMobileModal: false })),
}));

export function useAddResourceModalStore<T>(
  selector: (state: AddResourceModalState) => T,
  equals?: (a: T, b: T) => boolean,
): T {
  return useStore(addResourceModalStore, selector, equals);
}
