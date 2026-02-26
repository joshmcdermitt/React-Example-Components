import { Goals } from '@josh-hr/types';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { CreateEditGoalFormValues } from '~Goals/components/DeleteAfterUOM/useGetCreateEditGoalFormResolver';

export const useContextTypeFormSync = (): void => {
  const { watch, setValue } = useFormContext<CreateEditGoalFormValues>();
  const contextType = watch('context.contextType');

  useEffect(() => {
    // Reset contextId when contextType is not Team
    if (contextType !== Goals.GoalContextType.Team) {
      setValue('context.contextId', undefined, { shouldDirty: true });
    }
  }, [contextType, setValue]);
};
