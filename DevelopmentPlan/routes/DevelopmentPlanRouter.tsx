import { Route, Switch } from 'react-router-dom';
import {
  DEVELOPMENT_PLAN_BASE_ROUTE,
} from '~Common/const/routes';
import SmartRedirect from '~Deprecated/ui/components/SmartRedirect';
import BaseLayout from '~Deprecated/ui/routes/layouts/BaseLayout';
import ModuleLandingPageWrapper from '~Common/V3/components/LandingPageWrapper';
import { DevelopmentPlanTopBar } from '~DevelopmentPlan/components/DevelopmentPlanTopBar';
import { ViewPerspective } from '~DevelopmentPlan/const/types';
import DevelopmentPlanDashboard from '~DevelopmentPlan/pages/DevelopmentPlanDashboard';
import LayoutBridge from '~Deprecated/ui/routes/layouts/LayoutBridge';
import NewGetContent from '~Deprecated/ui/routes/layouts/NewGetContent';
import CreatePersonalDevelopmentPlan from '~DevelopmentPlan/components/Layouts/Create/CreatePersonalDevelopmentPlan';
import { ViewPersonalDevelopmentPlan } from '~DevelopmentPlan/components/Layouts/ViewDetail/ViewPersonalDevelopmentPlan';
import { CanNotViewDevelopmentPlanDetails } from '~DevelopmentPlan/components/Layouts/ViewDetail/CanNotViewDevelopmentPlanDetails';

export const DevelopmentPlanRoutes = {
  Dashboard: `${DEVELOPMENT_PLAN_BASE_ROUTE}`,
  Create: `${DEVELOPMENT_PLAN_BASE_ROUTE}createDevelopmentPlan`,
  ContinueToCreate: `${DEVELOPMENT_PLAN_BASE_ROUTE}createDevelopmentPlan/:pdpId`,
  MyPlans: `${DEVELOPMENT_PLAN_BASE_ROUTE}myPlans`,
  OtherPlans: `${DEVELOPMENT_PLAN_BASE_ROUTE}otherPlans`,
  ViewById: `${DEVELOPMENT_PLAN_BASE_ROUTE}:pdpId`,
  EditById: `${DEVELOPMENT_PLAN_BASE_ROUTE}:pdpId/edit/:stepId`,
  PermissionsDenied: `${DEVELOPMENT_PLAN_BASE_ROUTE}denied`,
} as const;

const View = (): JSX.Element => (
  <Switch>
    <Route
      exact
      path={[DevelopmentPlanRoutes.Dashboard, DevelopmentPlanRoutes.MyPlans]}
      render={() => (
        <BaseLayout>
          <ModuleLandingPageWrapper
            TopComponent={(
              <DevelopmentPlanTopBar
                viewPerspective={ViewPerspective.MyPlans}
              />
            )}
            ChildComponent={(
              <DevelopmentPlanDashboard
                viewPerspective={ViewPerspective.MyPlans}
              />
            )}
          />
        </BaseLayout>
      )}
    />
    <Route
      exact
      path={DevelopmentPlanRoutes.OtherPlans}
      render={() => (
        <BaseLayout>
          <ModuleLandingPageWrapper
            TopComponent={(
              <DevelopmentPlanTopBar
                viewPerspective={ViewPerspective.OtherPlans}
              />
            )}
            ChildComponent={(
              <DevelopmentPlanDashboard
                viewPerspective={ViewPerspective.OtherPlans}
              />
            )}
          />
        </BaseLayout>
      )}
    />
    <Route
      exact
      path={DevelopmentPlanRoutes.PermissionsDenied}
      render={(routeProps) => (
        <LayoutBridge
          routeProps={routeProps}
          Component={(
            <NewGetContent
              ChildComponent={<CanNotViewDevelopmentPlanDetails />}
            />
        )}
        />
      )}
    />
    <Route
      exact
      path={[DevelopmentPlanRoutes.EditById]}
      render={(routeProps) => (
        <LayoutBridge
          routeProps={routeProps}
          Component={(
            <NewGetContent
              ChildComponent={<CreatePersonalDevelopmentPlan />}
            />
        )}
        />
      )}
    />
    <Route
      exact
      path={[DevelopmentPlanRoutes.Create, DevelopmentPlanRoutes.ContinueToCreate]}
      render={(routeProps) => (
        <LayoutBridge
          routeProps={routeProps}
          Component={(
            <NewGetContent
              ChildComponent={<CreatePersonalDevelopmentPlan />}
            />
        )}
        />
      )}
    />
    <Route
      exact
      path={DevelopmentPlanRoutes.ViewById}
      render={(routeProps) => (
        <LayoutBridge
          routeProps={routeProps}
          Component={(
            <NewGetContent
              ChildComponent={<ViewPersonalDevelopmentPlan />}
            />
        )}
        />
      )}
    />
    <SmartRedirect from="*" to={DEVELOPMENT_PLAN_BASE_ROUTE} />
  </Switch>
);

const DevelopmentPlanRouter = (): JSX.Element => {
  const hookProps = {};

  return (
    <View
      {...hookProps}
    />
  );
};

export default DevelopmentPlanRouter;
