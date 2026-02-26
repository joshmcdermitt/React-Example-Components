import { css } from '@emotion/react';
import MenuItem from '@mui/material/MenuItem';
import { Select } from '~Common/V3/components/uncontrolled';
import { palette } from '~Common/styles/colors';
import useGetGoalCategoryTypes, { GoalCategoryTypes } from '~Goals/hooks/utils/categoryTypes/useGetGoalCategoryTypes';

const styles = {
  objectiveTypeSelect: css({
    backgroundColor: palette.neutrals.gray500,
  }),
  select: css({
    flex: 1,
    width: '100%',
  }),
};

interface ViewProps {
  goalCategoryTypes: GoalCategoryTypes['goalCategoryTypes'],
  defaultValue?: string,
}

const View = ({
  goalCategoryTypes,
  defaultValue,
  ...props
}: ViewProps): JSX.Element => (
  <div {...props}>
    <Select
      css={styles.select}
      id="category"
      name="category"
      defaultValue={defaultValue}
      label="Category"
    >
      {goalCategoryTypes.map((category) => (
        <MenuItem
          key={category.value}
          value={category.value}
        >
          {category.text}
        </MenuItem>
      ))}
    </Select>
  </div>
);

type ObjectiveTypeSelectProps = Pick<ViewProps, 'defaultValue'>;

const ObjectiveTypeSelect = ({ ...props }: ObjectiveTypeSelectProps): JSX.Element => {
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

export default ObjectiveTypeSelect;
