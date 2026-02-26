import CardView from '~DevelopmentPlan/components/Dashboards/CardView';
import TableView from '~DevelopmentPlan/components/Dashboards/TableView';
import { ViewPerspective } from '~DevelopmentPlan/const/types';

interface ViewProps {
  viewPerspective: ViewPerspective,
  searchText: string,
}

const View = ({
  viewPerspective,
  searchText,
}: ViewProps): JSX.Element => (
  <>
    {viewPerspective === ViewPerspective.MyPlans && (
    <>
      <CardView
        searchText={searchText}
        viewPerspective={viewPerspective}
      />
    </>
    )}
    {viewPerspective === ViewPerspective.OtherPlans && (
    <>
      <TableView
        searchText={searchText}
        viewPerspective={viewPerspective}
      />
    </>
    )}
  </>
);

interface DevelopmentPlanListDashboardProps{
  viewPerspective: ViewPerspective,
  searchText: string,
}

const DevelopmentPlanListDashboard = ({
  viewPerspective,
  searchText,
}: DevelopmentPlanListDashboardProps): JSX.Element => {
  const hookProps = {
    viewPerspective,
    searchText,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, DevelopmentPlanListDashboard };
export default DevelopmentPlanListDashboard;
