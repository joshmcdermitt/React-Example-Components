import { REVIEW_SETUP_LAYOUT } from '~Reviews/V2/Const/pageStyles';
import { ViewPersonalDevelopmentPlanPerspective } from '~DevelopmentPlan/const/types';
import SetupSteps from '~DevelopmentPlan/components/Shared/SetupSteps';
import JoshCard from '~Common/V3/components/JoshCard';
import { useParams } from 'react-router-dom';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import CreatePlanSetup from './CreatePlanSetup';
import { CreatePlanCreateStep } from './CreatePlanCreateStep';

const styles = {
  ...REVIEW_SETUP_LAYOUT,
};

interface ViewProps {
  viewPerspective: ViewPersonalDevelopmentPlanPerspective,
  pdpId: string,
  hideStepper: boolean,
}

const View = ({
  viewPerspective,
  pdpId,
  hideStepper,
}: ViewProps): JSX.Element => (
  <>
    <div css={styles.setupMainContainer}>
      {!hideStepper && (
      <SetupSteps
        viewPlanPerspective={viewPerspective}
      />
      )}
      <JoshCard>
        {viewPerspective === ViewPersonalDevelopmentPlanPerspective.Setup && (
          <CreatePlanSetup
            pdpId={pdpId}
          />
        )}
        {viewPerspective === ViewPersonalDevelopmentPlanPerspective.Create_Plan && (
          <CreatePlanCreateStep
            pdpId={pdpId}
          />
        )}
      </JoshCard>
    </div>
  </>
);

const CreatePersonalDevelopmentDashboard = (): JSX.Element => {
  const { pdpId, stepId } = useParams<{ pdpId: string, stepId: ViewPersonalDevelopmentPlanPerspective}>();
  const history = useHistory();
  const hideStepper = history.location.pathname.includes('edit');
  const {
    viewPerspective,
    setViewPerspective,
  } = useStoreParams((state) => ({
    viewPerspective: state.viewPerspective,
    setViewPerspective: state.setViewPerspective,
  }));
  useEffect(() => {
    if (pdpId && !stepId) {
      setViewPerspective(ViewPersonalDevelopmentPlanPerspective.Create_Plan);
    }
    if (stepId && pdpId) {
      setViewPerspective(stepId);
    }
  }, [pdpId, stepId, setViewPerspective]);

  const hookProps = {
    viewPerspective,
    pdpId,
    hideStepper,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, CreatePersonalDevelopmentDashboard };
export default CreatePersonalDevelopmentDashboard;
