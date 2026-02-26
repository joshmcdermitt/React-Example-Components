import { Goals } from '@josh-hr/types';
import { useMemo } from 'react';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import useGetGoalCategoryTypes from './useGetGoalCategoryTypes';

export interface CategoryFilterOption {
  value: Goals.GoalCategory | string,
  text: string,
  'data-test-id': string,
}

interface GoalCategoryTypesForFilter {
  goalCategoryFilterOptions: CategoryFilterOption[],
  goalCategoryFilterOptionsWithAllOption: CategoryFilterOption[],
}

const useGetGoalCategoryFilterOptions = (): GoalCategoryTypesForFilter => {
  const { goalCategoryTypes } = useGetGoalCategoryTypes();
  const { featureNamesText } = useGetFeatureNamesText();

  const goalCategoryFilterOptions = useMemo(() => goalCategoryTypes.map(({ value, text }) => ({
    value,
    text,
    'data-test-id': `goalsFilter${text.replace(/\s/g, '')}`,
  })), [goalCategoryTypes]);

  const allOption = useMemo(() => ({
    text: `All ${featureNamesText.goals.plural}`,
    value: goalCategoryFilterOptions.map(({ value }) => value).join(','),
    'data-test-id': 'goalsFilterAll',
  }), [featureNamesText.goals.plural, goalCategoryFilterOptions]);

  return {
    goalCategoryFilterOptions,
    goalCategoryFilterOptionsWithAllOption: [allOption, ...goalCategoryFilterOptions],
  };
};

export default useGetGoalCategoryFilterOptions;
