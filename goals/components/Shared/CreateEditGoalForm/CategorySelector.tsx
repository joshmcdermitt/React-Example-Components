import useGetGoalCategoryTypes, { GoalCategoryTypes } from '~Goals/hooks/utils/categoryTypes/useGetGoalCategoryTypes';
import { Goals } from '@josh-hr/types';
import { css } from '@emotion/react';
import Dropdown, { DropdownProps } from './Shared/Dropdown/Dropdown';

const styles = {
  dropdown: css({
    '.MuiSelect-root': {
      width: '17.875rem',
    },
    '.MuiSelect-listbox': {
      minWidth: '17.875rem',
      width: '100%',
    },
    '.MuiSelect-popper': {
      width: '17.875rem',
    },
  }),
};

interface ViewProps extends Omit<DropdownProps<Goals.GoalCategory>, 'name' | 'label' | 'dataTestId' | 'options'> {
  goalCategoryTypes: GoalCategoryTypes['goalCategoryTypes'],
}

const View = ({
  goalCategoryTypes,
  ...props
}: ViewProps): JSX.Element => (
  <Dropdown
    css={styles.dropdown}
    name="category"
    label="Category"
    dataTestId="goalCategorySelect"
    placeholder="Select a category"
    options={goalCategoryTypes}
    {...props}
  />
);

type CategorySelectorProps = Omit<ViewProps, 'goalCategoryTypes'>;

const CategorySelector = ({ ...props }: CategorySelectorProps): JSX.Element => {
  const { goalCategoryTypes } = useGetGoalCategoryTypes();

  const hookProps = {
    goalCategoryTypes,
  };

  return (
    <View
      {...hookProps}
      {...props}
    />
  );
};

export { View };
export default CategorySelector;
