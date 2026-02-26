import { css } from '@emotion/react';
import { palette } from '~Common/styles/colors';
import { TabType } from '~DevelopmentPlan/const/types';
import { COMPETENCY_RESOURCE_TABS } from '~DevelopmentPlan/const/defaults';
import JoshDateRangePicker from '~Common/V3/components/JoshDateRangePicker';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { DateRange } from '@mui/x-date-pickers-pro';
import { CompetencySelectObj } from '~DevelopmentPlan/const/functions';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';
import Tabs from '../Tabs/Tabs';
import CompetencyFilter from './CompetencyFilter';
import TypeFilter from './TypeFilter';

const styles = {
  dataTableFilterBarWrapper: (isMobileView: boolean) => css({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    borderBottom: `1px solid ${palette.neutrals.gray200}`,
    gap: '1rem',
  }, isMobileView && {
    borderBottom: 'none',
    flexWrap: 'wrap',
    marginBottom: '1rem',
  }),
  filtersWrapper: (isMobileView: boolean) => css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '.5rem',
    flexWrap: 'wrap',
  }, isMobileView && {
    width: '100%',
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
  dateRangeValue: DateRange<Date> | undefined,
  setdateRangeValue: (dateRange: DateRange<Date> | undefined) => void,
  uniqueCompetencyNames: CompetencySelectObj[],
  isDesktop: boolean,
}

const View = ({
  activeTab,
  setActiveTab,
  dateRangeValue,
  setdateRangeValue,
  uniqueCompetencyNames,
  isDesktop,
}: ViewProps): JSX.Element => (
  <>
    <div
      css={styles.dataTableFilterBarWrapper(!isDesktop)}
    >
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={COMPETENCY_RESOURCE_TABS}
        isMobileView={!isDesktop}
      />
      <div
        css={styles.filtersWrapper(!isDesktop)}
      >
        <TypeFilter
          data-test-id="stepsTypeFilter"
          isAccomplishments={activeTab === TabType.Accomplishments}
          isMobileView={false}
        />
        <CompetencyFilter
          data-test-id="competencyFilter"
          uniqueCompetencyNames={uniqueCompetencyNames}
          isMobileView={false}
        />
        <JoshDateRangePicker
          label="Timeframe"
          value={dateRangeValue}
          setValue={setdateRangeValue}
          placeHolderText="Select Date"
        />
      </div>
    </div>
  </>
);

interface CompetencyFilterBarProps {
  activeTab: TabType,
  setActiveTab: (tab: TabType) => void,
  uniqueCompetencyNames: CompetencySelectObj[],
}

const CompetencyFilterBar = ({
  activeTab,
  setActiveTab,
  uniqueCompetencyNames,
}: CompetencyFilterBarProps): JSX.Element => {
  const isDesktop = useIsDesktopQuery();
  const {
    dateRangeValue,
    setdateRangeValue,
  } = useStoreParams((state) => ({
    dateRangeValue: state.dateRangeValue,
    setdateRangeValue: state.setdateRangeValue,
  }));

  const hookProps = {
    activeTab,
    setActiveTab,
    dateRangeValue,
    setdateRangeValue,
    uniqueCompetencyNames,
    isDesktop,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default CompetencyFilterBar;
