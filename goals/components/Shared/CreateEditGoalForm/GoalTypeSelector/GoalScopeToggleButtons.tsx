import { Goals } from '@josh-hr/types';
import { memo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { CreateEditGoalFormValues } from '~Goals/hooks/utils/useGetCreateEditGoalFormResolver/useGetCreateEditGoalFormResolver';
import { GoalOptionScopeItem } from '~Goals/hooks/utils/useGetGoalOptionScopeItems';
import { useContextTypeFormSync } from '~Goals/hooks/useContextTypeFormSync';
import ToggleButtonGroup from '../Shared/ToggleButtonGroup';

interface GoalScopeToggleButtonsProps {
  control: Control<CreateEditGoalFormValues>,
  options: GoalOptionScopeItem[],
}

export const GoalScopeToggleButtons = memo(({
  control,
  options,
}: GoalScopeToggleButtonsProps): JSX.Element => {
  // Subscribe to context type changes to handle form sync
  useContextTypeFormSync();

  return (
    <Controller
      control={control}
      name="context.contextType"
      render={({
        field: {
          onChange,
          value,
          ref,
        },
      }) => (
        <ToggleButtonGroup
          aria-label="goal scope selector"
          onChange={(_, selectedValue: Goals.GoalContextType) => selectedValue && onChange(selectedValue)}
          value={value}
          ref={ref}
          options={options}
        />
      )}
    />
  );
});
