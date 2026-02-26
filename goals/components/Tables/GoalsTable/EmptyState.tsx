import { Link } from 'react-router-dom';
import EmptyStateForNoData from '~Common/components/EmptyStates/EmptyStateForNoData';
import CreateButton from '~Common/V3/components/ModuleTopbar/CreateButton';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';

const EmptyState = (): JSX.Element => {
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();

  return (
    <EmptyStateForNoData
      name={`${featureNamesText.goals.plural.toLowerCase()}-table`}
      emptyStateText={`No ${featureNamesText.goals.plural.toLowerCase()} found`}
      emptyStateSubtext="Create a new objective or change your filters to get started."
      actionButton={(
        <CreateButton
          itemName={featureNamesText.goals.singular}
          component={Link}
          to={goalRoutes?.Create}
          dataTestId="createNewGoal"
        />
      )}
    />
  );
};

export default EmptyState;
