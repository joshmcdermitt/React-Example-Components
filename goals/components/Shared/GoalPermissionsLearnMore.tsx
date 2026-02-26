import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';

const GoalPermissionsLearnMore = ({ ...props }): JSX.Element => (
  <JoshButton
    variant="text"
    component="a"
    href="https://josh.helpscoutdocs.com/article/25-create-a-goal#Goal-Permissions-1Zc51"
    target="_blank"
    data-test-id="goalsPermissionsLearnMore"
    {...props}
  >
    Learn More.
  </JoshButton>
);

export default GoalPermissionsLearnMore;
