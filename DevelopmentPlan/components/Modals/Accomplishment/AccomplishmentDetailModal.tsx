import { css } from '@emotion/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment-timezone';
import { palette } from '~Common/styles/colors';
import JoshModal from '~Common/V3/components/JoshModal';
import { faCalendar } from '@fortawesome/pro-light-svg-icons';
import { useGetAccomplishmentById } from '~DevelopmentPlan/hooks/useGetAccomplishmentById';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { Accomplishment } from '~DevelopmentPlan/const/types';
import { useShowAccomplishmentModal } from '~DevelopmentPlan/hooks/utils/useShowAccomplishmentDetailModal';
import HTMLRenderer from '~Common/V3/components/HTML/HTMLRenderer';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import SkeletonLoader from '~Common/components/SkeletonLoader';

const styles = {
  header: css({
    color: palette.brand.indigo,
    fontSize: '1.125rem',
    fontWeight: 600,
  }),
  body: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }),
  sectionTitle: css({
    fontSize: '.75rem',
    color: palette.neutrals.gray700,
    fontWeight: 400,
    display: 'block',
  }),
  dateIcon: css({
    color: palette.neutrals.gray700,
    marginRight: '.5rem',
  }),
  data: css({
    color: palette.neutrals.gray800,
    fontSize: '1rem',
    fontWeight: 500,
  }),
  skeletonLoader: css({
    minWidth: '12.5rem',
  }),
};

interface ViewProps {
  open: boolean,
  closeModal: () => void,
  isLoading: boolean,
  accomplishment?: Accomplishment,
  renderBottomButton?: () => JSX.Element,
}

const View = ({
  open,
  closeModal,
  isLoading,
  accomplishment,
  renderBottomButton,
}: ViewProps): JSX.Element => (
  <JoshModal
    open={open}
    onClose={closeModal}
  >
    <JoshModal.Header css={styles.header}>
      Accomplishment
    </JoshModal.Header>
    {isLoading && (
      <MultipleSkeletonLoaders
        numberOfSkeletons={3}
        renderSkeletonItem={() => (
          <SkeletonLoader
            css={styles.skeletonLoader}
            renderComponent={() => <></>}
          />
        )}
      />
    )}
    {!isLoading && accomplishment && (
      <>
        <JoshModal.Body css={styles.body}>
          <div>
            <span css={styles.sectionTitle}>Date</span>
            <span css={styles.data}>
              <FontAwesomeIcon
                css={styles.dateIcon}
                icon={faCalendar}
              />
              {moment(accomplishment.date).format('LL')}
            </span>
          </div>
          <div>
            <span css={styles.sectionTitle}>Title</span>
            <span css={styles.data}>{accomplishment?.title}</span>
          </div>
          <div>
            <span css={styles.sectionTitle}>Description</span>
            {accomplishment.description && (
              <HTMLRenderer css={styles.data} htmlText={accomplishment.description} />
            )}
          </div>
        </JoshModal.Body>
        {renderBottomButton && (
          <JoshModal.Footer>
            {renderBottomButton()}
          </JoshModal.Footer>
        )}
      </>
    )}
  </JoshModal>
);

export interface AccomplishmentDetailModalProps extends Pick<ViewProps, 'renderBottomButton'> {
  accomplishmentId: string,
}

const AccomplishmentDetailModal = ({
  accomplishmentId,
  ...props
}: AccomplishmentDetailModalProps): JSX.Element => {
  const { closeModal, useIsModalOpen } = useShowAccomplishmentModal();
  const open = useIsModalOpen();
  const { data, isLoading: isAccomplishmentLoading } = useGetAccomplishmentById({ id: accomplishmentId });
  const accomplishment = data?.response;

  const [isLoading] = useSkeletonLoaders(isAccomplishmentLoading);

  const hookProps = {
    isLoading,
    accomplishment,
    closeModal,
    open,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default AccomplishmentDetailModal;
