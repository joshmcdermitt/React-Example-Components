import { ViewPerspective } from '../const/types';
import { useDevelopmentPlanSearch } from '../stores/useDevelopmentPlanSearch';
import DevelopmentPlanListDashboard from './DevelopmentPlanListDashboard';

interface ViewProps {
  viewPerspective: ViewPerspective,
  searchText: string,
}

const View = ({
  viewPerspective,
  searchText,
}: ViewProps): JSX.Element => (
  <>
    <DevelopmentPlanListDashboard
      viewPerspective={viewPerspective}
      searchText={searchText}
    />
  </>
);

interface DevelopmentPlanDashboardProps {
  viewPerspective: ViewPerspective,
}

const DevelopmentPlanDashboard = ({
  viewPerspective,
}: DevelopmentPlanDashboardProps): JSX.Element => {
  const {
    debouncedSearchText: searchText,
  } = useDevelopmentPlanSearch((state) => ({
    debouncedSearchText: state.debouncedSearchText,
  }));

  const hookProps = {
    searchString: '',
    searchText,
    viewPerspective,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, DevelopmentPlanDashboard };
export default DevelopmentPlanDashboard;
