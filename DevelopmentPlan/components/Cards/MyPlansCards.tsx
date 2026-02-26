import { css } from '@emotion/react';
import moment from 'moment';
import { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { PDPList, PDPStatusEnum } from '~DevelopmentPlan/const/types';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { palette } from '~Common/styles/colors';
import { OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import Tooltip from '~Common/components/Tooltip';
import { useIsMobileQuery, useIsTabletQuery } from '~Common/hooks/useMediaListener';
import MyPlanCard from './MyPlanCard';

const styles = {
  personalDevelopmentDashboard: (isTablet: boolean, isMobile: boolean) => css({
    display: 'grid',
    gridGap: '1.5rem',
    gridTemplateColumns: 'repeat(3, 1fr);',
    gridAutoRows: '1fr',
    width: '100%',
  }, isTablet && {
    gridTemplateColumns: 'repeat(2, 1fr);',
  }, isMobile && {
    gridTemplateColumns: '1fr',
  }),
  cardLink: css({
    '&:hover': {
      textDecoration: 'none',
      scale: '1.03',
      transition: 'all 150ms',
    },
  }),
  milestonesCompleted: css({
    fontSize: '0.75rem',
    fontWeight: 400,
    color: palette.neutrals.gray700,
  }),
};

interface MyPlanCardsProps extends ComponentProps<'div'> {
  plans: PDPList[] | undefined,
}

const MyPlanCards = ({
  plans,
  ...props
}: MyPlanCardsProps): JSX.Element => {
  const isMobile = useIsMobileQuery();
  const isTablet = useIsTabletQuery();
  return (
    <div css={styles.personalDevelopmentDashboard(isTablet, isMobile)} {...props}>
      {plans?.map((plan) => {
        const { status, id } = plan;
        const isDraft = status.id === PDPStatusEnum.Draft;
        return (
          <>
            {id === OPTIMISTIC_ID && (
            <Tooltip
              content="Waiting for your plan to load"
            >
              <div>
                <MyPlanCard
                  key={id}
                  id={id}
                  cardTitle={`${moment(plan.startDate).format('MMM D')} - ${moment(plan.endDate).format('MMM D')}`}
                  title={plan.name}
                  description={plan.summary}
                  status={plan.status}
                  mentorInfo={plan.mentor}
                  renderCompletedSection={() => (
                    <>
                      {plan.milestonesTotal === 0 && (
                      <span
                        css={styles.milestonesCompleted}
                      >
                        Add milestones to your plan
                      </span>
                      )}
                      {plan.milestonesTotal > 0 && (
                      <span
                        css={styles.milestonesCompleted}
                      >
                        {`${plan.milestonesCompleted} of ${plan.milestonesTotal} Milestones Completed`}
                      </span>
                      )}
                    </>
                  )}
                />
              </div>
            </Tooltip>
            )}
            {id !== OPTIMISTIC_ID && (
            <Link
              key={id}
              css={styles.cardLink}
              to={isDraft ? DevelopmentPlanRoutes.ContinueToCreate.replace(':pdpId', id.toString())
                : DevelopmentPlanRoutes.ViewById.replace(':pdpId', id.toString())}
            >
              <MyPlanCard
                id={id}
                cardTitle={`${moment(plan.startDate).format('MMM D')} - ${moment(plan.endDate).format('MMM D')}`}
                title={plan.name}
                description={plan.summary}
                status={plan.status}
                mentorInfo={plan.mentor}
                renderCompletedSection={() => (
                  <>
                    {plan.milestonesTotal === 0 && (
                    <span
                      css={styles.milestonesCompleted}
                    >
                      Add milestones to your plan
                    </span>
                    )}
                    {plan.milestonesTotal > 0 && (
                    <span
                      css={styles.milestonesCompleted}
                    >
                      {`${plan.milestonesCompleted} of ${plan.milestonesTotal} Milestones Completed`}
                    </span>
                    )}
                  </>
                )}
              />
            </Link>
            )}
          </>
        );
      })}
    </div>
  );
};

export default MyPlanCards;
