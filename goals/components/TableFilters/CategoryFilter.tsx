import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import Dropdown, { DropdownItem, DropdownProps } from '~Common/V4/components/Dropdown';
import { SelectChangeEvent } from '@mui/material';
import { DROPDOWNSTYLES, GOAL_FILTER_STYLES } from '~Goals/const/styles';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import useGetGoalCategoryFilterOptions, { CategoryFilterOption } from '~Goals/hooks/utils/categoryTypes/useGetGoalCategoryFilterOptions';
import { useGoalsContext } from '~Goals/providers/GoalsContextProvider';
import { useIsDesktopQuery } from '~Common/hooks/useMediaListener';

const styles = {
  ...GOAL_FILTER_STYLES,
  ...DROPDOWNSTYLES,
  categoryFiltersContainer: (isNotDesktop: boolean) => css({
    flexDirection: 'column',
    width: '9.6875rem',
  }, isNotDesktop && {
    width: '100%',
  }),
};

const renderValue = (value: Goals.GoalCategory[]): string => {
  if (value?.length) {
    return value.join(', ');
  }

  return 'All Categories';
};

interface ViewProps extends Omit<DropdownProps<Goals.GoalCategory[]>, 'items'> {
  items: CategoryFilterOption[],
  isDesktop: boolean,
}

const View = ({
  items,
  onChange,
  value,
  disabled,
  isDesktop,
  ...props
}: ViewProps): JSX.Element => (
  <div css={styles.categoryFiltersContainer(!isDesktop)}>
    <p css={styles.filterLabel()}>Category</p>
    <Dropdown
      data-test-id="goalsTableCategoryFilter"
      dataTestId="category"
      multiple
      displayEmpty
      css={[styles.dropdown(!!value?.length, !isDesktop, true)]}
      value={value}
      disabled={disabled}
      renderItem={(item: DropdownItem<Goals.GoalCategory[]>) => (
        <div css={styles.dropdownItemBody(!isDesktop)}>
          <JoshCheckbox
            checked={value?.includes(item.value)}
            data-test-id="categoryFilterCheckbox"
          />
          {item.text}
        </div>
      )}
      onChange={onChange}
      items={items as DropdownItem<Goals.GoalCategory[]>[]}
      renderValue={renderValue}
      {...props}
    />
  </div>
);

const CategoryFilter = (): JSX.Element => {
  const isDesktop = useIsDesktopQuery();

  const {
    categoryFilter, setCategoryFilter, isLoading, isFiltersNotDefault, setShouldConfirmReset,
  } = useGoalsContext();

  const { goalCategoryFilterOptions: items } = useGetGoalCategoryFilterOptions();

  const onChange = (event: SelectChangeEvent<Goals.GoalCategory[]>): void => {
    setCategoryFilter(event.target.value as Goals.GoalCategory[]);
    if (isFiltersNotDefault && event.target.value.length > 0) setShouldConfirmReset(true);
  };

  const hookProps = {
    onChange,
    value: categoryFilter,
    items,
    disabled: isLoading,
    isDesktop,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default CategoryFilter;
