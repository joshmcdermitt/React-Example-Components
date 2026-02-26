import { css } from '@emotion/react';

import ReviewTitle from '~Reviews/V2/Shared/ReviewTitle';
import GridCard from '~Common/components/Cards/GridCard';
import { PDPStatus } from '~DevelopmentPlan/const/types';
import { OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { OrgUser } from '@josh-hr/types';
import PersonalDevelopmentStatus from '../Shared/PersonalDevelopmentStatus';

const styles = {
  joshCard: (isOptimisticUpdateCard: boolean) => css(
    isOptimisticUpdateCard && ({
      cursor: 'not-allowed',
    }),
  ),
};
interface MyPlanCardProps {
  cardTitle: string,
  title: string,
  description: string,
  renderCompletedSection?: () => JSX.Element,
  id: number,
  status: PDPStatus,
  mentorInfo: OrgUser,
}

const MyPlanCard = ({
  cardTitle,
  title,
  description,
  renderCompletedSection,
  id,
  status,
  mentorInfo,
  ...props
}: MyPlanCardProps): JSX.Element => (
  <GridCard
    css={styles.joshCard(id === OPTIMISTIC_ID)}
    title={title}
    feature="personalDevelopmentPlan"
    description={description}
    numberOfUsersAssigned={1}
    assignedUsersInfo={[mentorInfo]}
    renderHeader={() => (
      <ReviewTitle
        reviewTitle={cardTitle}
      />
    )}
    renderFooter={() => (
      <>
        <PersonalDevelopmentStatus
          status={status}
        />
        {renderCompletedSection?.()}
      </>
    )}
    {...props}
  />
);

export default MyPlanCard;
