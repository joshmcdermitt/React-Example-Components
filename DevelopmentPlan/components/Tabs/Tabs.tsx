import { Location } from 'history';
import {
  SyntheticEvent,
} from 'react';
import JoshTabs from '~Common/V3/components/JoshTabs';
import { useIsMobileQuery } from '~Common/hooks/useMediaListener';
import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { TabType } from '~DevelopmentPlan/const/types';

const styles = {
  goalTypeTabs: css({
    color: `${palette.neutrals.gray700} !important`,
    '&.Mui-selected': {
      color: `${palette.brand.indigo} !important`,
    },
  }),
  tabsOverride: (isMobileView: boolean) => css({

  }, isMobileView && {
    width: '100%',
  }),
};

export interface TabRecord {
  label: string,
  value: string,
  toObject: Partial<Location>,
  ['data-test-id']: string,
}

interface ViewProps {
  activeTab: TabType,
  tabs: TabRecord[],
  handleTabChange: (event: SyntheticEvent, tab: TabType) => void,
  renderRightItem?: () => JSX.Element,
  isMobile?: boolean,
  isMobileView: boolean,
}

const View = ({
  activeTab,
  tabs,
  handleTabChange,
  isMobileView,
  ...props
}: ViewProps): JSX.Element => (
  <JoshTabs
    value={activeTab}
    handleChange={handleTabChange}
    css={styles.tabsOverride(isMobileView)}
    {...props}
  >
    {tabs.map((tab) => (
      <JoshTabs.Tab
        label={tab.label}
        value={tab.value}
        key={tab.value}
        data-test-id={tab['data-test-id']}
        css={styles.goalTypeTabs}
      />
    ))}
  </JoshTabs>
);

interface TabsProps extends Omit<ViewProps, 'tabs' | 'handleTabChange'> {
  setActiveTab: (tab: TabType) => void,
  tabs: TabRecord[],
  isMobileView: boolean,
}

const Tabs = ({
  setActiveTab,
  tabs,
  isMobileView,
  ...props
}: TabsProps): JSX.Element => {
  const handleTabChange = (event: SyntheticEvent, newTab: TabType): void => {
    setActiveTab(newTab);
  };
  const isMobile = useIsMobileQuery();

  const hookProps = {
    tabs,
    handleTabChange,
    isMobile,
    isMobileView,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default Tabs;
