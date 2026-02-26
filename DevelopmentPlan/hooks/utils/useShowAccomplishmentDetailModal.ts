import { createShowModalStore } from '~Common/stores/ShowThingStore/createShowModalStore';
import { AccomplishmentDetailModalProps } from '~DevelopmentPlan/components/Modals/Accomplishment/AccomplishmentDetailModal';

export type ShowAccomplishmentDetailModalProps = Pick<AccomplishmentDetailModalProps, 'accomplishmentId' | 'renderBottomButton'>;

export const useShowAccomplishmentModal = createShowModalStore<ShowAccomplishmentDetailModalProps>('accomplishmentDetail');
