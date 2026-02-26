import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { ToastId } from '~Common/types';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { Comment } from '~DevelopmentPlan/const/types';
import { CreateCommentDTO } from '~DevelopmentPlan/schemata/createCommentSchemata';

interface ApprovePlanProps {
  id: string,
  comment: CreateCommentDTO,
}

const approvePlan = ({ id, comment }: ApprovePlanProps): Promise<HttpCallReturn<Comment>> => {
  const url = {
    url: `/developmentplans/${id}/approve`,
  };

  return postApi(url, comment, {});
};

export const useApprovePlan = (): UseMutationResult<HttpCallReturn<Comment>, unknown, Omit<ApprovePlanProps, 'competencyId'>, void> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: approvePlan,
    onMutate: () => {
      toastId.current = toast.info('Approving the plan...', { autoClose: false });
    },
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error approving the plan. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: 'Successfully approved the plan.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
    },
  });

  return mutation;
};
