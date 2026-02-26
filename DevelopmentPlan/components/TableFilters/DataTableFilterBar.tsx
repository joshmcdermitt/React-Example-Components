import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { TabType } from '~DevelopmentPlan/const/types';
import { PERSONAL_DEVELOPMENT_TABS } from '~DevelopmentPlan/const/defaults';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';
import Tabs from '../Tabs/Tabs';
import { TableFilters } from '.';

const styles = {
  dataTableFilterBarWrapper: (isMobileView: boolean) => css({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    borderBottom: `1px solid ${palette.neutrals.gray200}`,
  }, isMobileView && {
    borderBottom: 'none',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  }),
  filtersArea: css({
    display: 'flex',
    flexDirection: 'row',
  }),
  tabs: css({
    maxWidth: '50%',

    '& .MuiTab-root': {
      minWidth: 'unset',
      paddingBottom: '.75rem',
      paddingLeft: '0',
      paddingRight: '0',
      textTransform: 'unset',
    },
    '& .MuiTabs-flexContainer': {
      columnGap: '1.875rem',
      rowGap: '.5rem',
    },
  }),
};

interface ViewProps {
  activeTab: TabType,
  setActiveTab: (tab: TabType) => void,
  areFiltersActive: boolean,
  clearAllFilters: () => void,
}

const View = ({
  activeTab,
  setActiveTab,
  areFiltersActive,
  clearAllFilters,
}: ViewProps): JSX.Element => {
  const isDesktop = useIsDesktopQuery();
  return (
    <>
      <div
        css={styles.dataTableFilterBarWrapper(!isDesktop)}
      >
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={PERSONAL_DEVELOPMENT_TABS}
          isMobileView={!isDesktop}
        />
        <TableFilters
          areFiltersActive={areFiltersActive}
          clearAllFilters={clearAllFilters}
        />
      </div>
    </>
  );
};

interface TableFilterBarProps {
  activeTab: TabType,
  setActiveTab: (tab: TabType) => void,
  areFiltersActive: boolean,
  clearAllFilters: () => void,
}

const TableFilterBar = ({
  activeTab,
  setActiveTab,
  areFiltersActive,
  clearAllFilters,
}: TableFilterBarProps): JSX.Element => {
  const hookProps = {
    activeTab,
    setActiveTab,
    areFiltersActive,
    clearAllFilters,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default TableFilterBar;
