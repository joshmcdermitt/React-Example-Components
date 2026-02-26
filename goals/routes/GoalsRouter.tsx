import { Route, Switch } from 'react-router-dom';
import ModuleLandingPageWrapper from '~Common/V3/components/LandingPageWrapper';
import GoalsTopBar from '~Goals/components/GoalsTopBar';
import GoalsLandingPage from '~Goals/pages/GoalsLandingPage';
import ViewGoal from '~Goals/routes/ViewGoal';
import CreateGoal from '~Goals/components/CreateGoal';
import EditGoal from '~Goals/components/EditGoal';
import CanNotViewGoalDetails from '~Goals/components/Shared/CanNotViewGoalDetails';
import { ViewPerspective } from '~Goals/const/types';
import useGetGoalRoutes, { GetGoalRoutesReturn } from '~Goals/hooks/utils/useGetGoalRoutes';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import { PAGE_WRAPPER_STYLES } from '~Goals/const/styles';
import DeprecatedGoalsTopBar from '~Goals/components/DeleteAfterGoalsV4/GoalsTopBar';
import Goals from '~Goals/components/DeleteAfterGoalsV4/Goals';
import BaseLayout from '~Deprecated/ui/routes/layouts/BaseLayout';
import LayoutBridge from '~Deprecated/ui/routes/layouts/LayoutBridge';
import NewGetContent from '~Deprecated/ui/routes/layouts/NewGetContent';
import { GoalsProvider } from '~Goals/providers/GoalsContextProvider';
import useAIDraftingStore from '~Goals/stores/useAIDraftingStore';
import AIDraftingChat from '~Goals/components/AIDraftingChat/AIDraftingChat';
import { css } from '@emotion/react';
import MobileChatModal from '~Goals/components/AIDraftingChat/MobileChatModal';
import { useIsMobileQuery, useIsTabletQuery } from '~Common/hooks/useMediaListener';

const styles = {
  ...PAGE_WRAPPER_STYLES,
  createObjectiveWrapper: css({
    display: 'flex',
    gap: '1.5rem',
  }),
};

interface ViewProps {
  goalRoutes: GetGoalRoutesReturn['goalRoutes'],
  enableGoalsV4: boolean,
  showObjectivesAIDraftingTool: boolean,
  enableObjectivesAiDrafting: boolean,
  isMobile: boolean,
  isTablet: boolean,
}

const View = ({
  goalRoutes,
  enableGoalsV4,
  showObjectivesAIDraftingTool,
  enableObjectivesAiDrafting,
  isMobile,
  isTablet,
}: ViewProps): JSX.Element => (
  <Switch>
    <Route
      exact
      path={[goalRoutes.Dashboard, goalRoutes.ListOpen]}
      render={() => (
        <>
          {enableGoalsV4 ? (
            <BaseLayout isRedesign>
              <GoalsProvider>
                <ModuleLandingPageWrapper
                  TopComponent={<GoalsTopBar />}
                  ChildComponent={(
                    <GoalsLandingPage />
                  )}
                  css={styles.goalsLandingPageWrapper}
                />
              </GoalsProvider>
            </BaseLayout>
          ) : (
            <BaseLayout>
              <ModuleLandingPageWrapper
                TopComponent={<DeprecatedGoalsTopBar viewPerspective={ViewPerspective.Open} />}
                ChildComponent={<Goals viewPerspective={ViewPerspective.Open} />}
              />
            </BaseLayout>
          )}
        </>
      )}
    />
    {/* Kept separate Routes for now to support Old Goals routing until GoalContextProvider fully implemented */}
    <Route
      exact
      path={goalRoutes.ListComplete}
      render={() => (
        <>
          {enableGoalsV4 ? (
            <GoalsProvider>
              <BaseLayout isRedesign>
                <ModuleLandingPageWrapper
                  TopComponent={<GoalsTopBar />}
                  ChildComponent={<GoalsLandingPage />}
                  css={styles.goalsLandingPageWrapper}
                />
              </BaseLayout>
            </GoalsProvider>
          ) : (
            <BaseLayout>
              <ModuleLandingPageWrapper
                TopComponent={<DeprecatedGoalsTopBar viewPerspective={ViewPerspective.Completed} />}
                ChildComponent={<Goals viewPerspective={ViewPerspective.Completed} />}
              />
            </BaseLayout>
          )}
        </>
      )}
    />
    <Route
      exact
      path={goalRoutes.Create}
      render={() => (
        <BaseLayout isRedesign>
          <ModuleLandingPageWrapper
            css={styles.createEditLandingPageWrapper}
            ChildComponent={(
              <div css={styles.createObjectiveWrapper}>
                <CreateGoal />
                {showObjectivesAIDraftingTool && enableObjectivesAiDrafting && (
                  <>
                    {(isMobile || isTablet) && (
                      <MobileChatModal />
                    )}
                    {(!isMobile && !isTablet) && (
                      <AIDraftingChat />
                    )}
                  </>
                )}
              </div>
            )}
          />
        </BaseLayout>
      )}
    />
    <Route
      exact
      path={goalRoutes.PermissionsDenied}
      render={(routeProps) => (
        <LayoutBridge
          routeProps={routeProps}
          Component={(
            <NewGetContent
              ChildComponent={<CanNotViewGoalDetails />}
            />
          )}
        />
      )}
    />
    <Route
      exact
      path={goalRoutes.ViewById}
      render={(routeProps) => (
        <LayoutBridge
          routeProps={routeProps}
          Component={(
            <NewGetContent
              ChildComponent={<ViewGoal />}
            />
          )}
        />
      )}
    />
    <Route
      exact
      path={[goalRoutes.GoalStatus, goalRoutes.GoalStatusById]}
      render={() => (
        <BaseLayout>
          <ViewGoal
            isOnStatusRoute
          />
        </BaseLayout>
      )}
    />
    <Route
      exact
      path={goalRoutes.EditById}
      render={() => (
        <>
          <BaseLayout isRedesign>
            <ModuleLandingPageWrapper
              css={styles.createEditLandingPageWrapper}
              ChildComponent={<EditGoal />}
            />
          </BaseLayout>
        </>
      )}
    />
  </Switch>
);

const GoalsRouter = (): JSX.Element => {
  const { goalRoutes } = useGetGoalRoutes();
  const enableObjectivesAiDrafting = useFeatureFlag('enableObjectivesAiDrafting');
  const { showObjectivesAIDraftingTool } = useAIDraftingStore();
  const enableGoalsV4 = useFeatureFlag('enableGoalsV4');
  const isMobile = useIsMobileQuery();
  const isTablet = useIsTabletQuery();

  const hookProps = {
    goalRoutes,
    showObjectivesAIDraftingTool,
    enableObjectivesAiDrafting,
    enableGoalsV4,
    isMobile,
    isTablet,
  };

  return (
    <View {...hookProps} />
  );
};

export default GoalsRouter;
