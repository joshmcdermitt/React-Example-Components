import { css } from '@emotion/react';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { Link, useHistory } from 'react-router-dom';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import EmptyStateWithImage from '~Common/components/EmptyStates/EmptyStateWithImage';
import JoshCard from '~Common/V3/components/JoshCard';
import EmptyPersonalDevelopmentPlan from '~DevelopmentPlan/assets/images/emptyPersonalDevelopmentPlan.svg';
import { palette } from '~Common/styles/colors';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { PAGE_STYLES, PAGE_STYLES_OVERRIDE, BUTTON_STYLES } from '~Reviews/V2/Const/pageStyles';
import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';

const styles = {
  ...PAGE_STYLES,
  ...PAGE_STYLES_OVERRIDE,
  ...BUTTON_STYLES,
  joshCard: (isMobile: boolean) => css({
    marginTop: '1.875rem',
    display: 'grid',
    gridTemplateColumns: '3fr 1fr',
    marginBottom: '2rem',
  }, isMobile && {
    gridTemplateColumns: '1fr',
  }),
  detailsTitle: (isMobile: boolean) => css({
    gridColumn: '1 / 4',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: palette.neutrals.gray800,
    paddingBottom: '1rem',
    borderBottom: `1px solid ${palette.neutrals.gray300}`,
    marginBottom: '1rem',
  }, isMobile && {
    gridColumn: '1',
  }),
  emptyStateImage: css({
    height: '20rem',
  }),
  container: css({
    width: '100%',
    margin: '1.875rem 1.875rem 0 1.875rem',
  }),
  icon: css({
    marginRight: '0.5rem',
  }),
  emptyState: css({
    gridColumn: '1 / 4',
  }),
};

interface ViewProps {
  isMobile: boolean,
  onClickViewPlans: () => void,
}

const View = ({
  isMobile,
  onClickViewPlans,
}: ViewProps): JSX.Element => (
  <>
    <div css={styles.container}>
      <div css={styles.topBar}>
        <div css={(styles.leftSide(false))}>
          <JoshButton
            component={Link}
            to={DevelopmentPlanRoutes.Dashboard}
            variant="text"
            css={styles.textBackButton}
            textButtonColor={palette.neutrals.gray700}
            data-test-id="pdpBackToList"
          >
            <JoshButton.IconAndText
              icon={faArrowLeft}
              text="Development Plans"
            />
          </JoshButton>
        </div>
        <div id="contextButtonsViewDetails" />
      </div>
      <JoshCard
        css={styles.joshCard(isMobile)}
      >
        <h1 css={styles.detailsTitle(isMobile)}>
          Permission Denied
        </h1>
        <div
          css={styles.emptyState}
        >
          <EmptyStateWithImage
            renderImage={() => (
              <EmptyPersonalDevelopmentPlan css={styles.emptyStateImage} title="No Permission to View PDP" />
            )}
            renderText={() => (
              <>
                <span>
                  You do not have permission to view this personal development plan.
                  <JoshButton
                    variant="text"
                    textButtonColor={palette.brand.blue}
                    onClick={onClickViewPlans}
                    data-test-id="actionItemsEmptyStateCreateActionItem"
                  >
                    Click here to view your plans
                  </JoshButton>
                </span>
              </>
            )}
          />
        </div>
      </JoshCard>
    </div>
  </>
);

export const CanNotViewDevelopmentPlanDetails = (): JSX.Element => {
  const isMobile = useIsMobileQuery();
  const history = useHistory();
  const onClickViewPlans = (): void => {
    history.push(DevelopmentPlanRoutes?.Dashboard);
  };
  const hookProps = {
    isMobile,
    onClickViewPlans,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
