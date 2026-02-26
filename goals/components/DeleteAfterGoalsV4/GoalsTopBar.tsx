import ModuleTopbar from '~Common/V3/components/ModuleTopbar';
import { ViewPerspective } from '~Goals/const/types';
import { ChangeEvent } from 'react';
import { useGoalsIndexSearch } from '~Goals/stores/useGoalsIndexSearch';
import CreateButton from '~Common/V3/components/ModuleTopbar/CreateButton';
import JoshSearchField from '~Common/V3/components/JoshSearchField';
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { forMobileTinyObject } from '~Common/styles/mixins';
import { useUserPermissions } from '~Common/hooks/user/useUserPermissions';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import useGetGoalRoutes, { GetGoalRoutesReturn } from '~Goals/hooks/utils/useGetGoalRoutes';
import { TabNavigation } from '../GoalsTopBar/TabNavigation';

const styles = {
  moduleTopbar: css({
    gridTemplateAreas: '"toggleTabs searchField rightSection"',
    gridTemplateColumns: 'auto 1fr auto',
  }, forMobileTinyObject({
    gridTemplateAreas: `
    "toggleTabs toggleTabs"
    "searchField rightSection"
  `,
    gridTemplateColumns: '1fr auto',
  })),
  toggleTab: css({
    justifyContent: 'center',
  }, forMobileTinyObject({
    width: '50%',
  })),
};

interface ViewProps {
  handleSearchTextChange: (event: ChangeEvent<HTMLInputElement>) => void,
  searchText: string,
  viewPerspective: ViewPerspective,
  isLimitedAccess: boolean,
  featureNamesText: FeatureNamesText,
  goalRoutes: GetGoalRoutesReturn['goalRoutes'],
}

const View = ({
  handleSearchTextChange,
  searchText,
  viewPerspective,
  isLimitedAccess,
  featureNamesText,
  goalRoutes,
}: ViewProps): JSX.Element => (
  <ModuleTopbar
    css={styles.moduleTopbar}
    moduleTopbarLayout="custom"
    renderTabNavigationToggle={() => (
      <>
        {viewPerspective !== ViewPerspective.Create && (
          <TabNavigation
            viewPerspective={viewPerspective}
            toggleTabStyles={styles.toggleTab}
          />
        )}
        {viewPerspective === ViewPerspective.Create && (
          <JoshButton
            type="submit"
            data-test-id="goalsBack"
            variant="text"
          >
            Back
          </JoshButton>
        )}
      </>
    )}
    renderSearchField={() => (
      <>
        {viewPerspective !== ViewPerspective.Create && (
          <>
            <JoshSearchField
              data-test-id="goalsTopBarSearchField"
              defaultValue={searchText}
              onChange={handleSearchTextChange}
            />
          </>
        )}
      </>
    )}
    renderRightSection={() => (
      <>
        {viewPerspective !== ViewPerspective.Create && !isLimitedAccess && (
          <CreateButton
            component={Link}
            to={goalRoutes?.Create}
            itemName={featureNamesText.goals.singular}
            data-test-id="goalsCreateNew"
          />
        )}
        {viewPerspective === ViewPerspective.Create && (
          <>
            <JoshButton
              type="submit"
              data-test-id="goalsCancelNew"
              variant="ghost"
            >
              Cancel
            </JoshButton>
            <JoshButton
              type="submit"
              data-test-id="goalsCreateNew"
            >
              {`Save ${featureNamesText.goals.singular}`}
            </JoshButton>
          </>
        )}
      </>
    )}
  />
);

interface GoalsTopBarProps {
  viewPerspective: ViewPerspective,
}

const GoalsTopBar = ({
  viewPerspective,
}: GoalsTopBarProps): JSX.Element => {
  const {
    searchText,
    setSearchText,
  } = useGoalsIndexSearch((state) => ({
    searchText: state.searchText,
    setSearchText: state.setSearchText,
  }));
  const { featureNamesText } = useGetFeatureNamesText();
  const { goalRoutes } = useGetGoalRoutes();
  const isMobile = useIsMobileQuery();

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  const { isLimitedAccess } = useUserPermissions();

  const hookProps = {
    handleSearchTextChange,
    searchText,
    viewPerspective,
    isMobile,
    isLimitedAccess,
    featureNamesText,
    goalRoutes,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };

export default GoalsTopBar;
