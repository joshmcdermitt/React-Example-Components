import { css } from '@emotion/react';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import EmptyPersonalDevelopmentPlan from '~DevelopmentPlan/assets/images/emptyPersonalDevelopmentPlan.svg';

import { ViewPerspective } from '~DevelopmentPlan/const/types';

const styles = {
  emptyStateImageWrapper: css({
    margin: '4.6875rem auto 1.5rem auto',
    maxWidth: '50%',
    textAlign: 'center',
  }),
  emptyStateImage: css({
    width: '12.5rem',
  }),
  emptyButton: css({
    marginTop: '1.5rem',
  }),
  otherPlansMsg: css({
    marginTop: '.875rem',
  }),
};

interface ListDashboardEmptyStateProps {
  viewPerspective: ViewPerspective,
  handleAddPlan?: () => void,
  areFiltersActive: boolean,
}

const ListDashboardEmptyState = ({
  viewPerspective,
  handleAddPlan,
  areFiltersActive,
}: ListDashboardEmptyStateProps): JSX.Element => (
  <>
    <div
      css={styles.emptyStateImageWrapper}
    >
      <EmptyPersonalDevelopmentPlan css={styles.emptyStateImage} title="Empty Personal Development Plans" data-test-id="developmentPlanNoPlans" />
      <div>
        {viewPerspective === ViewPerspective.MyPlans && !areFiltersActive && (
        <>
          <JoshButton
            css={styles.emptyButton}
            variant="text"
            onClick={handleAddPlan}
            data-test-id="personalDevelopmentDashboardSectionHeader"
          >
            Create your first
          </JoshButton>
          Development Plan.
        </>
        )}
        {viewPerspective === ViewPerspective.OtherPlans && !areFiltersActive && (
        <>
          <p css={styles.otherPlansMsg}>No Development Plans found.</p>
        </>
        )}
        {viewPerspective === ViewPerspective.OtherPlans && areFiltersActive && (
        <>
          <p css={styles.otherPlansMsg}>No Development Plans found based upon your filters. You may need to adjust or clear your filters.</p>
        </>
        )}
        {viewPerspective === ViewPerspective.MyPlans && areFiltersActive && (
        <>
          <p css={styles.otherPlansMsg}>No Development Plans found based upon your search. Please try your search again.</p>
        </>
        )}
      </div>
    </div>
  </>
);

export default ListDashboardEmptyState;
