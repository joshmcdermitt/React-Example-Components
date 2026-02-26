import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { ResourceType } from '~DevelopmentPlan/const/types';
import TabNavItem from '~Common/V3/components/Drawers/TabNavItem';
import { PartialDrawerState } from '~Common/const/drawers';
import { CreateLearningDrawerState } from '~Learning/components/CreateLearningDrawer';
import { CreateLearningPlaylistDrawerState } from '~Learning/components/CreateLearningPlaylistDrawer';
import useGetPersonalDevelopmentModalTabs, { TabItem } from '~DevelopmentPlan/hooks/utils/useGetPersonalDevelopmentModalTabs';

const styles = {
  tabWrapper: css({
    backgroundColor: palette.neutrals.gray100,
    display: 'flex',
    height: '3.125rem',
    alignItems: 'flex-end',
    position: 'relative',
    marginBottom: '1rem',

    ':before': {
      width: '300%',
      height: '100%',
      content: '""',
      background: 'inherit',
      position: 'absolute',
      top: 0,
      left: '-100%',
      zIndex: -1,
    },
  }),
  tabNavItem: css({
    display: 'flex',
    alignItems: 'center',
  }),
};

interface ViewProps {
  activeTab: number | undefined,
  tabsToUse: Record<string, TabItem>,
  handleClick: (tab: number) => void,
}

const View = ({
  activeTab,
  tabsToUse,
  handleClick,
}: ViewProps): JSX.Element => (
  <div css={styles.tabWrapper}>
    {Object.keys(tabsToUse).map((tab) => (
      <TabNavItem
        key={tabsToUse[tab].value}
        css={styles.tabNavItem}
        isActive={activeTab === tabsToUse[tab].value}
        onClick={() => handleClick(tabsToUse[tab].value)}
        renderNavItem={() => (
          <div>{tabsToUse[tab].label}</div>
        )}
      />
    ))}
  </div>
);

interface TabsProps {
  resourceId: ResourceType,
  setActiveTab: ((tab: number) => void) | undefined,
  activeTab: number | undefined,
  // eslint-disable-next-line max-len
  setDrawerState: (callback: (prev: PartialDrawerState<CreateLearningDrawerState | CreateLearningPlaylistDrawerState>) => PartialDrawerState<Record<string, unknown>>) => void,
}

const DrawerTabs = ({
  resourceId,
  activeTab,
  setActiveTab,
  setDrawerState,
}: TabsProps): JSX.Element => {
  const { modalTabs } = useGetPersonalDevelopmentModalTabs();
  const tabsToUse = modalTabs[resourceId ?? ResourceType.All];

  const handleClick = (tab: number): void => {
    if (setActiveTab) {
      setDrawerState((prev) => ({
        ...prev,
        activeTab: tab,
      }));
    }
  };

  const hookProps = {
    tabsToUse,
    setActiveTab,
    activeTab,
    handleClick,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default DrawerTabs;
