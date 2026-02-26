import { faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import { Link, useHistory, useParams } from 'react-router-dom';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { palette } from '~Common/styles/colors';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { PAGE_STYLES, PAGE_STYLES_OVERRIDE, BUTTON_STYLES } from '~Reviews/V2/Const/pageStyles';
import { COMPETENCY_RESOURCE_TABS } from '~DevelopmentPlan/const/defaults';
import { css } from '@emotion/react';
import CreatePersonalDevelopmentDashboard from './Dashboard';

const styles = {
  ...PAGE_STYLES,
  ...PAGE_STYLES_OVERRIDE,
  ...BUTTON_STYLES,
  rightSide: (isMobile: boolean) => css({

  }, isMobile && {
    display: 'flex',
    justifyContent: 'space-between',
  }),
};

interface ViewProps {
  isEditing: boolean,
  backToDetailsUrl: string,
  backToDashboardUrl: string,
}

const View = ({
  isEditing,
  backToDetailsUrl,
  backToDashboardUrl,
}: ViewProps): JSX.Element => (
  <>
    <div css={styles.container}>
      <div css={styles.topBar}>
        <div css={(styles.leftSide(false))}>
          <JoshButton
            component={Link}
            to={isEditing ? backToDetailsUrl : backToDashboardUrl}
            variant="text"
            css={styles.textBackButton}
            textButtonColor={palette.neutrals.gray700}
            data-test-id="personalDevelopmentBackToList"
          >
            <JoshButton.IconAndText
              icon={faArrowLeft}
              text="Development Plans"
            />
          </JoshButton>
        </div>
        <div css={styles.rightSide(true)} id="contextButtons" />
      </div>
      <CreatePersonalDevelopmentDashboard />
    </div>
  </>
);

const CreatePersonalDevelopmentPlan = (): JSX.Element => {
  const history = useHistory();
  const isEditing = history.location.pathname.includes('edit');
  const { pdpId } = useParams<{ pdpId: string}>();
  const backToDetailsUrl = `${DevelopmentPlanRoutes.ViewById.replace(':pdpId', pdpId ?? '')}?tab=${COMPETENCY_RESOURCE_TABS[0].value}`;
  const backToDashboardUrl = DevelopmentPlanRoutes.Dashboard;

  const hookProps = {
    isEditing,
    backToDetailsUrl,
    backToDashboardUrl,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, CreatePersonalDevelopmentPlan };
export default CreatePersonalDevelopmentPlan;
