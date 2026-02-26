import { Goals } from '@josh-hr/types';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { goalKeys } from '~Goals/const/queryKeys';

export type CreateMeasurementUnitTypeParams = Pick<Goals.Requests.CreateCustomUnitRequest, 'payload'>;
export type CreateMeasurementUnitTypePayload = Goals.Requests.CreateCustomUnitRequestPayload;
export type CreateMeasurementUnitTypeReturn = Goals.Responses.CreateCustomUnitResponse['data'];

const createMeasurementUnitType = async ({ payload }: CreateMeasurementUnitTypeParams): Promise<HttpCallReturn<CreateMeasurementUnitTypeReturn>> => {
  const serverUrl = {
    version: 3,
    url: '/goals/unitTypes',
  };

  return postApi<CreateMeasurementUnitTypeReturn>(serverUrl, payload);
};

interface UseCreateMeasurementUnitTypeParams extends Omit<
  UseMutationOptions<HttpCallReturn<CreateMeasurementUnitTypeReturn>, Error, CreateMeasurementUnitTypeParams>, 'mutationFn'
> {
  errorText?: string,
}

export const useCreateMeasurementUnitType = ({
  errorText,
  ...options
}: UseCreateMeasurementUnitTypeParams = {}): UseMutationResult<HttpCallReturn<CreateMeasurementUnitTypeReturn>, Error, CreateMeasurementUnitTypeParams> => {
  const toastId = useRef<ToastId>(null);

  const mutation = useMutation({
    mutationFn: createMeasurementUnitType,
    onError: () => {
      toast.update(toastId.current, {
        render: errorText ?? 'There was an error creating your custom unit type. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: goalKeys.unitTypes() });
    },
    ...options,
  });

  return mutation;
};
