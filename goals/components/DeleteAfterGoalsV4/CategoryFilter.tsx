import { css } from '@emotion/react';
import { Goals } from '@josh-hr/types';
import Dropdown, { DropdownItem, DropdownProps } from '~Common/V3/components/Dropdown';
import { palette } from '~Common/styles/colors';
import { useQueryParamState } from '~Common/hooks/useQueryParamState';
import { SelectChangeEvent } from '@mui/material';
import { GOAL_FILTER_STYLES } from '~Goals/const/styles';
import JoshCheckbox from '~Common/V3/components/JoshCheckbox';
import useGetGoalCategoryFilterOptions, { CategoryFilterOption } from '~Goals/hooks/utils/categoryTypes/useGetGoalCategoryFilterOptions';

const styles = {
  ...GOAL_FILTER_STYLES,
  dropdown: (hasValue: boolean) => css({
    border: '1px solid transparent',
    width: '11rem',
    padding: 0,

    '.MuiSelect-select': {
      fontSize: '0.75rem',
      paddingLeft: '0.75rem',
    },

    // ToDo: Fix the placement of the dropdown arrow inside the common Dropdown component
    '.MuiSelect-icon': {
      right: '0.75rem',
    },
  }, hasValue && {
    borderColor: palette.brand.indigo,
  }),
  dropdownItemBoy: css({
    display: 'flex',
    alignItems: 'center',
    gap: '.75rem',
    color: palette.neutrals.gray700,
  }),
};

const renderValue = (value: Goals.GoalCategory[]): string => {
  if (value?.length) {
    return value.join(', ');
  }

  return 'All Types';
};

interface ViewProps extends Omit<DropdownProps<Goals.GoalCategory[]>, 'items'> {
  items: CategoryFilterOption[],
}

const View = ({
  items,
  onChange,
  value,
  ...props
}: ViewProps): JSX.Element => (
  <div>
    <p css={styles.filterLabel(!!value?.length)}>Category</p>
    <Dropdown
      multiple
      displayEmpty
      css={styles.dropdown(!!value?.length)}
      value={value}
      renderItem={(item: DropdownItem<Goals.GoalCategory[]>) => (
        <div css={styles.dropdownItemBoy}>
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
  const [value, setCategoryValue] = useQueryParamState<Goals.GoalCategory[]>('goals', 'category', [], true);

  const { goalCategoryFilterOptions: items } = useGetGoalCategoryFilterOptions();

  const onChange = (event: SelectChangeEvent<Goals.GoalCategory[]>): void => {
    setCategoryValue(event.target.value as Goals.GoalCategory[]);
  };

  const hookProps = {
    onChange,
    value,
    items,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export { View };
export default CategoryFilter;
