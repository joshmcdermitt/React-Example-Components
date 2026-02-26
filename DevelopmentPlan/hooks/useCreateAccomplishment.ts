import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { Accomplishment } from '~DevelopmentPlan/const/types';
import { CreateAccomplishmentDTO } from '~DevelopmentPlan/schemata/CreateAccomplishmentSchemata';

interface createAccomplishmentProps {
  accomplishment: CreateAccomplishmentDTO,
}

export interface CreateAccomplishmentResponse {
  id: number,
  title: string,
  description: string,
  date: Date,
  orgUserId: string
}

const createAccomplishment = ({ accomplishment }: createAccomplishmentProps): Promise<HttpCallReturn<Accomplishment>> => {
  const url = {
    url: '/accomplishments',
  };

  return postApi(url, accomplishment, {});
};

export const useCreateAccomplishment = (): UseMutationResult<HttpCallReturn<Accomplishment>, unknown, createAccomplishmentProps, void> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: createAccomplishment,
    onMutate: () => {
      toastId.current = toast.info('Creating your accomplishment...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error creating your accomplishment. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: 'Successfully created your accomplishment.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
    },
  });

  return mutation;
};
