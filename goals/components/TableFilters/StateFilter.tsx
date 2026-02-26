import { css } from '@emotion/react';
import { SelectChangeEvent } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';
import { capitalizeFirstLetter } from '~Common/utils';
import Dropdown from '~Common/V4/components/Dropdown';
import { DROPDOWNSTYLES, GOAL_FILTER_STYLES } from '~Goals/const/styles';
import { ViewPerspective } from '~Goals/const/types';
import useGetGoalRoutes from '~Goals/hooks/utils/useGetGoalRoutes';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';

const styles = {
  ...GOAL_FILTER_STYLES,
  ...DROPDOWNSTYLES,
  stateFiltersContainer: (isNotDesktop: boolean) => css({
    flexDirection: 'column',
    width: '5.8125rem',
  }, isNotDesktop && {
    width: '100%',
  }),
};

const StateFilter = (): JSX.Element => {
  const isDesktop = useIsDesktopQuery();
  const {
    stateFilter, setStateFilter, isLoading, isFiltersNotDefault, setShouldConfirmReset,
  } = useGoalsContext();

  const history = useHistory();
  const goalRoutes = useGetGoalRoutes();

  const onStateFilterChange = (event: SelectChangeEvent<ViewPerspective>): void => {
    const { location: { search } } = history;

    if (event.target.value
      && goalRoutes
      && event.target.value === ViewPerspective.Completed) {
      history.push({
        pathname: goalRoutes.goalRoutes.ListComplete,
        search,
      });
    } else {
      history.push({
        pathname: goalRoutes.goalRoutes.ListOpen,
        search,
      });
    }
    setStateFilter(event.target.value as ViewPerspective);
    if (isFiltersNotDefault && event.target.value !== ViewPerspective.Open) setShouldConfirmReset(true);
  };

  return (
    <div css={styles.stateFiltersContainer(!isDesktop)}>
      <p css={styles.filterLabel()}>State</p>
      <Dropdown
        data-test-id="goalsTableStateFilter"
        css={[styles.dropdown(true, !isDesktop, true)]}
        dataTestId="state"
        items={[{
          value: ViewPerspective.Open,
          text: capitalizeFirstLetter(ViewPerspective.Open),
        },
        {
          value: ViewPerspective.Completed,
          text: capitalizeFirstLetter(ViewPerspective.Completed),
        }]}
        value={stateFilter}
        onChange={onStateFilterChange}
        disabled={isLoading}
      />
    </div>
  );
};

export default StateFilter;
