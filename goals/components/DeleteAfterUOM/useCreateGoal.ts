import { Goals } from '@josh-hr/types';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { getOrganizationId } from '~Common/utils/localStorage';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { homeQueryKeys } from '~Home/hooks/queryKeys';
import useGetFeatureNamesText from '~Root/hooks/useGetFeatureNamesText';
import { goalKeys } from '../../const/queryKeys';

interface CreateGoalParams {
  goal: Goals.Requests.CreateGoalRequestPayload,
}

export interface CreateGoalResponse {
  goalId: string,
  createdInMillis: number,
}

const createGoal = ({ goal }: CreateGoalParams): Promise<HttpCallReturn<CreateGoalResponse>> => {
  const serverUrl = {
    version: 3,
    url: '/goals',
  };

  return postApi<CreateGoalResponse>(serverUrl, { ...goal }, {});
};

interface UseCreateGoalParams extends Omit<
  UseMutationOptions<HttpCallReturn<CreateGoalResponse>, Error, CreateGoalParams>, 'mutationFn'
> {
  errorText?: string,
}

export const useCreateGoal = ({
  errorText,
  ...options
}: UseCreateGoalParams = {}): UseMutationResult<HttpCallReturn<CreateGoalResponse>, Error, CreateGoalParams> => {
  const { featureNamesText } = useGetFeatureNamesText();

  const toastId = useRef<ToastId>(null);

  const mutation = useMutation({
    mutationFn: createGoal,
    onMutate: () => {
      toastId.current = toast.info(`Creating your ${featureNamesText.goals.singular.toLowerCase()}...`, { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: errorText ?? `There was an error creating your ${featureNamesText.goals.singular.toLowerCase()}. Please try again.`,
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: `Successfully created your ${featureNamesText.goals.singular.toLowerCase()}.`,
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });

      void queryClient.invalidateQueries({ queryKey: goalKeys.all });
      void queryClient.invalidateQueries({ queryKey: homeQueryKeys.homeGoals(getOrganizationId() ?? '') });
    },
    ...options,
  });

  return mutation;
};
