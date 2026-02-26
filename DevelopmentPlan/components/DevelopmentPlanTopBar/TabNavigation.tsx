import { SerializedStyles } from '@emotion/react';
import { SyntheticEvent, useEffect } from 'react';
import { useHistory } from 'react-router';
import JoshToggleTabs, { JoshToggleTextTabProps } from '~Common/V3/components/JoshToggleTabs';
import { ViewPerspective } from '~DevelopmentPlan/const/types';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';

interface ViewProps {
  onChange: (event: SyntheticEvent, option: string) => void,
  tabItems: JoshToggleTextTabProps[],
  value: string,
  viewPerspective: string,
  toggleTabStyles: SerializedStyles,
}

const View = ({
  tabItems,
  toggleTabStyles,
  ...props
}: ViewProps): JSX.Element => (
  <JoshToggleTabs {...props}>
    {tabItems.map((tabItem) => (
      <JoshToggleTabs.TextTab
        data-test-id={tabItem['data-test-id']}
        css={toggleTabStyles}
        key={tabItem.value}
        text={tabItem.text}
        value={tabItem.value}
      />
    ))}
  </JoshToggleTabs>
);

interface TabNavigationProps {
  viewPerspective: ViewPerspective,
  toggleTabStyles: SerializedStyles,
}

export const TabNavigation = ({
  viewPerspective,
  toggleTabStyles,
  ...props
}: TabNavigationProps): JSX.Element => {
  const tabItems = [
    {
      text: 'My Plans',
      value: DevelopmentPlanRoutes.MyPlans,
      'data-test-id': 'personalDevelopmentTopBarMyPlansTab',
    },
    {
      text: 'Other Plans',
      value: DevelopmentPlanRoutes.OtherPlans,
      'data-test-id': 'personalDevelopmentTopBarOtherPlansTab',
    },
  ];

  const passedInTab = tabItems.find((option) => option.value.toLowerCase().includes(viewPerspective.toLowerCase()));

  const value = passedInTab ? passedInTab.value : DevelopmentPlanRoutes?.MyPlans;
  const {
    setViewDashbaordPerspective,
  } = useStoreParams((state) => ({
    setViewDashbaordPerspective: state.setViewDashbaordPerspective,
  }));

  useEffect(() => {
    const isMyplans = value.includes(DevelopmentPlanRoutes.MyPlans);
    setViewDashbaordPerspective(isMyplans ? ViewPerspective.MyPlans : ViewPerspective.OtherPlans);
  }, [setViewDashbaordPerspective, value]);

  const history = useHistory();

  const onChange = (e: SyntheticEvent, route: string): void => {
    if (route) {
      const { location: { search } } = history;

      history.push({
        pathname: route,
        search,
      });
    }
  };

  const hookProps = {
    onChange,
    tabItems,
    value,
    viewPerspective,
    toggleTabStyles,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};
