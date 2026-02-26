import { css } from '@emotion/react';
import { Accomplishment, ResourceType } from '~DevelopmentPlan/const/types';
import { useAddResourceModalStore } from '~DevelopmentPlan/stores/useAddResourceModalStore';
import { DEFAULT_ACCOMPLISHMENT } from '~DevelopmentPlan/const/defaults';
import { existingResourceStyles } from '~DevelopmentPlan/const/pageStyles';
import { useGetAccomplishmentById } from '~DevelopmentPlan/hooks/useGetAccomplishmentById';
import { palette } from '~Common/styles/colors';
import { CardSkeleton } from '~Common/V3/components/Card';
import MultipleSkeletonLoaders from '~Common/components/MultipleSkeletonLoaders';
import { AccomplishmentDetails } from './Details';

const styles = {
  ...existingResourceStyles,
  accomplishmentWrap: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
  }),
  sectionTitle: css({
    fontSize: '.75rem',
    color: palette.neutrals.gray700,
    fontWeight: 400,
    display: 'block',
    letterSpacing: '.5px',
    lineHeight: '.5rem',
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
  skellyWrapper: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
  }),
  cardSkeleton: css({
    maxWidth: '100%',
    maxHeight: '2rem',
  }),
};

interface ViewProps {
  accomplishment: Accomplishment | undefined,
  isViewingAccomplishment: boolean,
  isLoading: boolean,
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
}

const View = ({
  accomplishment,
  isViewingAccomplishment,
  isLoading,
  runAddResourceValidations,
}: ViewProps): JSX.Element => (
  <>
    <div css={styles.resourceWrapper}>
      {isLoading && (
        <MultipleSkeletonLoaders
          css={styles.skellyWrapper}
          numberOfSkeletons={4}
          renderSkeletonItem={() => (
            <CardSkeleton css={styles.cardSkeleton} />
          )}
        />
      )}
      {!isLoading && (
      <AccomplishmentDetails
        accomplishment={accomplishment ?? DEFAULT_ACCOMPLISHMENT}
        isViewingAccomplishment={isViewingAccomplishment}
        runAddResourceValidations={runAddResourceValidations}
        isEditing={Boolean(accomplishment)}
      />
      )}
    </div>
  </>
);

interface AccomplishmentModalBodyProps {
  runAddResourceValidations: (resourceIdClicked: ResourceType, contentId: string | number) => void,
}

export const AccomplishmentModalBody = ({
  runAddResourceValidations,
}: AccomplishmentModalBodyProps): JSX.Element => {
  const {
    isViewing,
    resourceContentId,
  } = useAddResourceModalStore((state) => ({
    isViewing: state.isViewing,
    resourceContentId: state.resourceContentId,
  }));

  const isViewingAccomplishment = isViewing ?? false;
  const resourceIdToUse = resourceContentId?.toString() ?? '';
  const { data, isLoading } = useGetAccomplishmentById({ id: resourceIdToUse });
  const accomplishment = data?.response;

  const hookProps = {
    accomplishment,
    runAddResourceValidations,
    isViewingAccomplishment,
    isLoading,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default AccomplishmentModalBody;
