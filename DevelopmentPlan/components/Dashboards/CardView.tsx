import { css } from '@emotion/react';
import {
  Fragment, useCallback, useEffect, useMemo,
} from 'react';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import ListSection, { ListSectionSkeleton } from '~Common/V3/components/ListSection';
import { useSkeletonLoaders } from '~Common/hooks/useSkeletonLoaders';
import { palette } from '~Common/styles/colors';
import {
  GetPDPSearchParams, PDPList, PDPStatusEnum, PersonalDevelopmentType, ViewPerspective,
} from '~DevelopmentPlan/const/types';
import { faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse } from '@mui/material';
import { PERSONAL_DEVELOPMENT_MY_PLANS_PAGE_SIZE } from '~DevelopmentPlan/const/defaults';
import { useGetMyPlans } from '~DevelopmentPlan/hooks/useGetMyPlans';
import { PAGE_STYLES } from '~DevelopmentPlan/const/pageStyles';
import { GridDashboardSkeleton } from '~Common/components/Loader/GridDashboard';
import { useStoreParams } from '~DevelopmentPlan/stores/useStoreParams';
import { useHistory } from 'react-router-dom';
import { DevelopmentPlanRoutes } from '~DevelopmentPlan/routes/DevelopmentPlanRouter';
import ListDashboardEmptyState from '../EmptyStates/ListDashboardEmptyState';
import MyPlanCards from '../Cards/MyPlansCards';

const styles = {
  ...PAGE_STYLES,
  sectionHeader: css({
    color: palette.neutrals.gray700,
    fontWeight: 500,
    fontSize: '1rem',

  }),
  sectionHeaderToggle: css({
    width: '100%',
    textAlign: 'left',
    padding: 0,
    marginBottom: '2rem',
    '&:not(:first-of-type)': {
      marginTop: '2rem',
    },
  }),
  caretToggleicon: (isActive: boolean) => css({
    transition: 'transform 300ms ease-in-out',
    transform: 'rotate(180deg)',
  }, isActive && {
    transform: 'rotate(0deg)',
  }),
};
interface ViewProps {
  handleClickHeading: (clickedPersonalDevelopmentType: keyof typeof PersonalDevelopmentType) => void,
  expandedPlanTypes: PersonalDevelopmentType[],
  plans: Record<keyof typeof PersonalDevelopmentType, PDPList[]>,
  hasMyPlans: boolean,
  viewPerspective: ViewPerspective,
  showSkeleton: boolean,
  handleAddPlan: () => void,
  areFiltersActive: boolean,
}

const View = ({
  handleClickHeading,
  expandedPlanTypes,
  plans,
  hasMyPlans,
  viewPerspective,
  showSkeleton,
  handleAddPlan,
  areFiltersActive,
}: ViewProps): JSX.Element => (
  <>
    {showSkeleton && (
      <div>
        <ListSectionSkeleton css={styles.listSectionSkeleton} />
        <GridDashboardSkeleton
          amountOfLoaders={8}
        />
        <ListSectionSkeleton css={styles.listSectionSkeleton} />
        <GridDashboardSkeleton
          amountOfLoaders={8}
        />
      </div>
    )}
    {!hasMyPlans && !showSkeleton && (
    <ListDashboardEmptyState
      viewPerspective={viewPerspective}
      handleAddPlan={handleAddPlan}
      areFiltersActive={areFiltersActive}
    />
    )}
    {hasMyPlans && (
    <>
      {Object.entries(plans).map(([type, plan]) => (
        <Fragment key={type}>
          <JoshButton
            css={styles.sectionHeaderToggle}
            variant="text"
            onClick={() => handleClickHeading(type as keyof typeof PersonalDevelopmentType)}
            data-test-id="personalDevelopmentDashboardSectionHeader"
          >
            {plan.length >= 1 && (
            <ListSection
              css={styles.sectionHeader}
              renderContents={() => (
                <div>
                  {type}
                  {' '}
                  <FontAwesomeIcon
                    css={styles.caretToggleicon(expandedPlanTypes.includes(PersonalDevelopmentType[type as keyof typeof PersonalDevelopmentType]))}
                    icon={faCaretDown}
                    size="lg"
                  />
                </div>
              )}
            />
            )}
          </JoshButton>
          {plan.length >= 1 && (
          <Collapse
            in={expandedPlanTypes.includes(PersonalDevelopmentType[type as keyof typeof PersonalDevelopmentType])}
          >
            <MyPlanCards
              plans={plan}
            />
          </Collapse>
          )}
        </Fragment>
      ))}
    </>
    )}
  </>
);

interface CardViewProps{
  searchText: string,
  viewPerspective: ViewPerspective,
}

const CardView = ({
  searchText,
  viewPerspective,
}: CardViewProps): JSX.Element => {
  const {
    page,
    takeMyPlans,
    expandedPlanTypes,
    setExpandedPlanTypes,
    setPage,
  } = useStoreParams((state) => ({
    page: state.page,
    setPage: state.setPage,
    takeMyPlans: state.takeMyPlans,
    expandedPlanTypes: state.expandedPlanTypes,
    setExpandedPlanTypes: state.setExpandedPlanTypes,
  }));

  useEffect(() => {
    setPage(1);
  }, [setPage]);

  const params = {
    skip: (page - 1) * PERSONAL_DEVELOPMENT_MY_PLANS_PAGE_SIZE,
    take: takeMyPlans,
    search: searchText,
  } as GetPDPSearchParams;

  const {
    data, isLoading: plansAreLoading,
  } = useGetMyPlans({ params });

  const [showSkeleton] = useSkeletonLoaders(plansAreLoading);

  const areFiltersActive = searchText !== '';

  const plans = useMemo(() => {
    if (!data?.response) {
      // Handle the case when data is undefined
      return {
        Active: [],
        Completed: [],
      };
    }

    return {
      Active: data?.response.filter((plan) => plan.status.id !== PDPStatusEnum.Completed && plan.status.id !== PDPStatusEnum.Closed),
      Completed: data?.response.filter((plan) => plan.status.id === PDPStatusEnum.Completed || plan.status.id === PDPStatusEnum.Closed),
    };
  }, [data]);

  const hasMyPlans = plans.Active.length > 0 || plans.Completed.length > 0;

  const handleClickHeading = useCallback((clickedPersonalDevelopmentType: keyof typeof PersonalDevelopmentType) => {
    const value = PersonalDevelopmentType[clickedPersonalDevelopmentType];
    const result = expandedPlanTypes.includes(value)
      ? expandedPlanTypes.filter((type) => type !== value)
      : [...expandedPlanTypes, value];

    setExpandedPlanTypes(result);
  }, [expandedPlanTypes, setExpandedPlanTypes]);

  const history = useHistory();
  const handleAddPlan = (): void => {
    history.push(DevelopmentPlanRoutes.Create);
  };

  const hookProps = {
    searchText,
    handleClickHeading,
    expandedPlanTypes,
    plans,
    hasMyPlans,
    viewPerspective,
    showSkeleton,
    handleAddPlan,
    areFiltersActive,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View, CardView };
export default CardView;
