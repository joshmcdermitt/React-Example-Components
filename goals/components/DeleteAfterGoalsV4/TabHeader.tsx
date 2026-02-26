import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import { ViewPerspective } from '~Goals/const/types';
import { palette } from '~Common/styles/colors';
import { ChangeEvent, SyntheticEvent } from 'react';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import JoshTabs from '~Common/V3/components/JoshTabs';
import JoshSwitch from '~Common/V3/components/JoshSwitch';
import { useEnableCascadingGoals } from '~Goals/hooks/utils/useEnableCascadingGoals';
import { useSetUserLevelEnableCascadingGoals } from '~Goals/stores/useUserLevelEnableCascadingGoals';
import useGetFeatureNamesText, { FeatureNamesText } from '~Root/hooks/useGetFeatureNamesText';
import useGetGoalTabLabels, { UseGetGoalTabsReturn } from '~Goals/hooks/utils/tabs/useGetGoalTabLabels';
import useGetOpenGoalTabs from '~Goals/hooks/utils/tabs/useGetOpenGoalTabs';
import useGetCompletedGoalTabs from '~Goals/hooks/utils/tabs/useGetCompletedGoalTabs';

const styles = {
  tabHeader: css({}),
  goalTypeTabs: css({
    color: `${palette.neutrals.gray700} !important`,
    '&.Mui-selected': {
      color: `${palette.brand.indigo} !important`,
    },
  }),
};

interface TabRecord {
  label: string,
  value: string,
  toObject: Partial<Location>,
  ['data-test-id']: string,
}

interface ViewProps {
  activeTab: Goals.GoalContextType,
  tabs: TabRecord[],
  handleTabChange: (event: SyntheticEvent, tab: Goals.GoalContextType) => void,
  isMobile: boolean,
  handleCascadeViewChange: (event: ChangeEvent<HTMLInputElement>) => void,
  enableCascadingGoals: boolean,
  showCascadingGoalsToggle: boolean,
  featureNamesText: FeatureNamesText,
  tabLabels: UseGetGoalTabsReturn['tabLabels'],
}

const View = ({
  activeTab,
  tabs,
  handleTabChange,
  isMobile = false,
  handleCascadeViewChange,
  enableCascadingGoals,
  showCascadingGoalsToggle,
  featureNamesText,
  tabLabels,
  ...props
}: ViewProps): JSX.Element => (
  <div
    css={styles.tabHeader}
    {...props}
  >
    <JoshTabs
      value={activeTab}
      handleChange={handleTabChange}
      renderRightItem={showCascadingGoalsToggle ? () => (
        <JoshSwitch data-test-id="goalsTableToggleCascade">
          <JoshSwitch.Label label="Cascade View" labelPlacement="start">
            <JoshSwitch.Switch
              onChange={handleCascadeViewChange}
              defaultChecked={enableCascadingGoals}
            />
          </JoshSwitch.Label>
        </JoshSwitch>
      ) : undefined}
    >
      {tabs.map((tab) => (
        <JoshTabs.Tab
          label={tab.label === tabLabels.Organization.Label && isMobile ? `Org ${featureNamesText.goals.plural} ` : tab.label}
          value={tab.value}
          key={tab.value}
          data-test-id={tab['data-test-id']}
          css={styles.goalTypeTabs}
        />
      ))}
    </JoshTabs>
  </div>
);

interface TabHeaderProps extends Pick<ViewProps, 'activeTab'> {
  setActiveTab: (tab: Goals.GoalContextType) => void,
  viewPerspective: ViewPerspective,
}

const TabHeader = ({
  setActiveTab,
  viewPerspective,
  ...props
}: TabHeaderProps): JSX.Element => {
  const isCompleted = viewPerspective === ViewPerspective.Completed;
  const { orgLevelEnableCascadingGoals, userLevelEnableCascadingGoals } = useEnableCascadingGoals();
  const showCascadingGoalsToggle = orgLevelEnableCascadingGoals;
  const setEnable = useSetUserLevelEnableCascadingGoals();
  const { featureNamesText } = useGetFeatureNamesText();
  const { tabLabels } = useGetGoalTabLabels();
  const { openTabs } = useGetOpenGoalTabs();
  const { completedTabs } = useGetCompletedGoalTabs();

  const handleTabChange = (event: SyntheticEvent, newTab: Goals.GoalContextType): void => {
    setActiveTab(newTab);
  };

  const handleCascadeViewChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEnable(event.target.checked);
  };

  const isMobile = useIsMobileQuery();

  const hookProps = {
    tabs: isCompleted ? completedTabs : openTabs,
    handleTabChange,
    isMobile,
    handleCascadeViewChange,
    enableCascadingGoals: userLevelEnableCascadingGoals,
    showCascadingGoalsToggle,
    featureNamesText,
    tabLabels,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default TabHeader;
