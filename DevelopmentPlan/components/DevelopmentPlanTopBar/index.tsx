import ModuleTopbar from '~Common/V3/components/ModuleTopbar';
import { ChangeEvent } from 'react';
import CreateButton from '~Common/V3/components/ModuleTopbar/CreateButton';
import JoshSearchField from '~Common/V3/components/JoshSearchField';
import { css } from '@emotion/react';
import { forMobileTinyObject } from '~Common/styles/mixins';
import { ViewPersonalDevelopmentPlanPerspective, ViewPerspective } from '~DevelopmentPlan/const/types';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { Link, useHistory } from 'react-router-dom';
import { useDevelopmentPlanSearch } from '~DevelopmentPlan/stores/useDevelopmentPlanSearch';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { TabNavigation } from './TabNavigation';

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
  handleNavigation: () => void,
}

const View = ({
  handleSearchTextChange,
  searchText,
  viewPerspective,
  handleNavigation,
}: ViewProps): JSX.Element => (
  <ModuleTopbar
    css={styles.moduleTopbar}
    moduleTopbarLayout="custom"
    renderTabNavigationToggle={() => (
      <>
        <TabNavigation
          viewPerspective={viewPerspective}
          toggleTabStyles={styles.toggleTab}
        />
      </>
    )}
    renderSearchField={() => (
      <>
        <JoshSearchField
          data-test-id="personalDevelopmentTopBarSearchField"
          defaultValue={searchText}
          onChange={handleSearchTextChange}
        />
      </>
    )}
    renderRightSection={() => (
      <>
        <CreateButton
          component={Link}
          onClick={handleNavigation}
          itemName="Plan"
          data-test-id="personalDevelopmentCreateNew"
        />
      </>
    )}
  />
);

interface DevelopmentPlanTopBarProps {
  viewPerspective: ViewPerspective,
}

export const DevelopmentPlanTopBar = ({
  viewPerspective,
}: DevelopmentPlanTopBarProps): JSX.Element => {
  const {
    searchText,
    setSearchText,
  } = useDevelopmentPlanSearch((state) => ({
    searchText: state.searchText,
    setSearchText: state.setSearchText,
  }));
  const {
    setViewPerspective,
  } = useStoreParams((state) => ({
    setViewPerspective: state.setViewPerspective,
  }));

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  const history = useHistory();
  const handleNavigation = (): void => {
    setViewPerspective(ViewPersonalDevelopmentPlanPerspective.Setup);
    history.push(DevelopmentPlanRoutes.Create);
  };

  const hookProps = {
    handleSearchTextChange,
    searchText,
    viewPerspective,
    handleNavigation,
  };

  return (
    <View
      {...hookProps}
    />
  );
};
