import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { HttpCallReturn, patchApi } from '~Deprecated/services/HttpService';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { Accomplishment } from '~DevelopmentPlan/const/types';
import { CreateAccomplishmentDTO } from '~DevelopmentPlan/schemata/CreateAccomplishmentSchemata';

interface updateAccomplishmentProps {
  accomplishment: CreateAccomplishmentDTO,
  accomplishmentId: string,
}

const updateAccomplishment = ({ accomplishment, accomplishmentId }: updateAccomplishmentProps): Promise<HttpCallReturn<Accomplishment>> => {
  const url = {
    url: `/accomplishments/${accomplishmentId}`,
  };

  return patchApi(url, accomplishment, {});
};

export const useUpdateAccomplishment = (): UseMutationResult<HttpCallReturn<Accomplishment>, unknown, updateAccomplishmentProps, void> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: updateAccomplishment,
    onMutate: () => {
      toastId.current = toast.info('Updating your accomplishment...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error updating your accomplishment. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: 'Successfully updated your accomplishment.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.all });
    },
  });

  return mutation;
};
