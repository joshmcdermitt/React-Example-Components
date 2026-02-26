import { css } from '@emotion/react';
import { PersonalDevelopmentPlanSteps, ViewPersonalDevelopmentPlanPerspective } from '~DevelopmentPlan/const/types';
import JoshStepper from '~Common/V3/components/JoshStepper';
import JoshCard from '~Common/V3/components/JoshCard';

const styles = {
  joshCard: css({
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.125rem',
  }),
};

const steps = [{
  label: 'Set-up',
}, {
  label: 'Create Plan',
}, {
  label: 'Submit for Review',
}];

interface ViewProps {
  viewPlanPerspective: ViewPersonalDevelopmentPlanPerspective,
}
const View = ({
  viewPlanPerspective,
}: ViewProps): JSX.Element => (
  <JoshCard css={styles.joshCard}>
    <JoshStepper
      steps={steps}
      activeStep={PersonalDevelopmentPlanSteps[viewPlanPerspective as keyof typeof PersonalDevelopmentPlanSteps]}
    />
  </JoshCard>
);

interface SetupStepsProps {
  viewPlanPerspective: ViewPersonalDevelopmentPlanPerspective,
}
const SetupSteps = ({
  viewPlanPerspective,
}: SetupStepsProps): JSX.Element => {
  const hookProps = {
    viewPlanPerspective,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, SetupSteps };
export default SetupSteps;
