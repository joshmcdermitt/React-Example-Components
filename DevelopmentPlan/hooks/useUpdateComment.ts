import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { patchApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { Comment } from '~DevelopmentPlan/const/types';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { DEFAULT_USER, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { CreateCommentDTO } from '~DevelopmentPlan/schemata/createCommentSchemata';
import { produce } from 'immer';
import { ToastId } from '~Common/types';

export interface UpdateCommentProps {
  id: string,
  comment: CreateCommentDTO,
  commentId: number,
}

const updateComment = ({ id, comment, commentId }: UpdateCommentProps): Promise<HttpCallReturn<Comment>> => {
  const url = {
    url: `/developmentplans/${id}/comments/${commentId.toString()}`,
  };

  return patchApi(url, comment, {});
};

interface UseUpdateCommentProps {
  onUpdateSuccess?: () => void,
}

export const useUpdateComment = ({ onUpdateSuccess }: UseUpdateCommentProps): UseMutationResult<HttpCallReturn<Comment>, unknown, UpdateCommentProps> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: updateComment,
    onMutate: async (updatedComment: UpdateCommentProps) => {
      const pdpId = updatedComment.id;
      const { commentId } = updatedComment;
      toastId.current = toast.info('Updating the comment...', { autoClose: false });
      // Cancel any existing outbound queries
      await queryClient.cancelQueries({ queryKey: pdpPlanKeys.comments(pdpId) });
      const previousReceivedCommentList = queryClient.getQueryData<HttpCallReturn<Comment[]>>(pdpPlanKeys.comments(pdpId));
      const currentComment = previousReceivedCommentList?.response?.find((comment: Comment) => comment.id === commentId);

      const commonCommentDetails = {
        id: OPTIMISTIC_ID,
        content: updatedComment.comment.content,
        createdBy: currentComment?.createdBy ?? DEFAULT_USER,
        createdDate: currentComment?.createdDate ?? new Date(),
        isDeleted: currentComment?.isDeleted ?? false,
        modifiedDate: new Date(),
        isApprovalComment: currentComment?.isApprovalComment ?? false,
        isFinalThought: currentComment?.isFinalThought ?? false,
        isSystemGenerated: currentComment?.isSystemGenerated ?? false,
        pdpId: OPTIMISTIC_ID,
      };

      const newCreatedComment = {
        ...commonCommentDetails,
      };

      queryClient.setQueryData<HttpCallReturn<Comment[]>>(pdpPlanKeys.comments(pdpId), (oldCreatedCommentList) => {
        if (oldCreatedCommentList) {
          return produce(oldCreatedCommentList, (draft) => {
            draft.response = draft.response.map((comment) => {
              if (comment.id === commentId) {
                return newCreatedComment;
              }
              return comment;
            });
          });
        }

        return oldCreatedCommentList;
      });
      // Return a context object with the old snapshotted values used below
      return {
        previousReceivedCommentList,
      };
    },
    onError: (_, variables, snapshot) => {
      queryClient.setQueryData(pdpPlanKeys.comments(variables.id), snapshot?.previousReceivedCommentList);

      toast.update(toastId.current, {
        render: 'There was an error updating the comment. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      toast.update(toastId.current, {
        render: 'Successfully updated the comment.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      onUpdateSuccess?.();
    },
  });

  return mutation;
};
