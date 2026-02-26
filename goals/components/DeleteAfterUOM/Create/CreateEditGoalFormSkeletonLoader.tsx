import { css } from '@emotion/react';
import { CardSkeleton } from '~Common/V3/components/Card';
import { JoshCardSkeleton } from '~Common/V3/components/JoshCard';
import { forMobileObject } from '~Common/styles/mixins';
import { InteriorTopBar } from '~Goals/components/GoalsTopBar/InteriorTopBar';

const styles = {
  topBarSkeleton: css({
    display: 'flex',
  }),
  rightSide: css({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }),
  buttonSkeleton: css({
    height: '2.5rem',
  }),
  joshCardSkeleton: css({
    height: 'calc(100vh - 8rem)',
    minWidth: '80%',
    margin: '1rem auto',
  }, forMobileObject({
    minWidth: '100%',
  })),
};

const CreateEditGoalFormSkeletonLoader = (): JSX.Element => (
  <div>
    <InteriorTopBar
      css={styles.topBarSkeleton}
      renderLeftSide={() => (
        <CardSkeleton css={styles.buttonSkeleton} />
      )}
      renderRightSide={() => (
        <div css={styles.rightSide}>
          <CardSkeleton css={styles.buttonSkeleton} />
          <CardSkeleton css={styles.buttonSkeleton} />
        </div>
      )}
    />
    <JoshCardSkeleton css={styles.joshCardSkeleton} />
  </div>
);

export default CreateEditGoalFormSkeletonLoader;
