import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import { Link } from 'react-router-dom';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { palette } from '~Common/styles/colors';
import { PAGE_STYLES, PAGE_STYLES_OVERRIDE, BUTTON_STYLES } from '~Reviews/V2/Const/pageStyles';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { ViewPerspective } from '~DevelopmentPlan/const/types';
import { PersonalDevelopmentPlanDetails } from './PersonalDevelopmentPlanDetails';

const styles = {
  ...PAGE_STYLES,
  ...PAGE_STYLES_OVERRIDE,
  ...BUTTON_STYLES,
};

interface ViewProps {
  properBackURL: string,
}

const View = ({
  properBackURL,
}: ViewProps): JSX.Element => (
  <>
    <div css={styles.container}>
      <div css={styles.topBar}>
        <div css={(styles.leftSide(false))}>
          <JoshButton
            component={Link}
            to={properBackURL}
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
      <PersonalDevelopmentPlanDetails />
    </div>
  </>
);

export const ViewPersonalDevelopmentPlan = (): JSX.Element => {
  const {
    viewDashboardPerspective,
  } = useStoreParams((state) => ({
    viewDashboardPerspective: state.viewDashboardPerspective,
  }));

  const cameFromMyPlans = viewDashboardPerspective === ViewPerspective.MyPlans;
  const properBackURL = cameFromMyPlans ? DevelopmentPlanRoutes.MyPlans : DevelopmentPlanRoutes.OtherPlans;

  const hookProps = {
    properBackURL,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
