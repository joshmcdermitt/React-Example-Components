import { SerializedStyles } from '@emotion/react';
import { SyntheticEvent } from 'react';
import { useHistory } from 'react-router';
import JoshToggleTabs, { JoshToggleTextTabProps } from '~Common/V3/components/JoshToggleTabs';
import { ViewPerspective } from '~Goals/const/types';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';

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
  const { goalRoutes } = useGetGoalRoutes();
  const tabItems = [
    {
      text: 'Open',
      value: goalRoutes?.ListOpen,
      'data-test-id': 'goalsTopBarOpenTab',
    },
    {
      text: 'Completed',
      value: goalRoutes?.ListComplete,
      'data-test-id': 'goalsTopBarCompletedTab',
    },
  ];

  const passedInTab = tabItems.find((option) => option.text.toLocaleLowerCase() === viewPerspective.toLocaleLowerCase());
  const value = passedInTab ? passedInTab.value : goalRoutes?.ListOpen;
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
