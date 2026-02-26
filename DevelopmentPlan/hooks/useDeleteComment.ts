import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { Person } from '~Common/const/interfaces';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { useNewPeople } from '~Deprecated/hooks/peoplePicker/useNewPeople';
import { deleteApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { DEFAULT_USER, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { Comment } from '~DevelopmentPlan/const/types';

interface DeleteCommentProps {
  id: string,
  commentId: string,
}

const deleteComment = ({ id, commentId }: DeleteCommentProps): Promise<HttpCallReturn<Comment>> => {
  const url = {
    url: `/developmentplans/${id}/comments/${commentId}`,
  };

  return deleteApi(url, { }, {});
};

export const useDeleteComment = (): UseMutationResult<HttpCallReturn<Comment>, unknown, DeleteCommentProps> => {
  const { peopleData } = useNewPeople({}) as unknown as Record<string, Record<string, Person>>;

  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: deleteComment,
    onMutate: async (deletedComment: DeleteCommentProps) => {
      toastId.current = toast.info('Deleting the comment...', { autoClose: false });
      const pdpId = deletedComment.id;
      await queryClient.cancelQueries({ queryKey: pdpPlanKeys.comments(pdpId) });
      const previousReceivedCommentList = queryClient.getQueryData<Comment[]>(pdpPlanKeys.comments(pdpId));

      const loggedInUser: Person = peopleData[DEFAULT_USER.orgUserId];
      const commonCommentDetails = {
        id: parseInt(deletedComment.commentId, 10),
        content: 'Message was deleted',
        createdBy: {
          orgUserId: DEFAULT_USER.orgUserId ?? '',
          firstName: loggedInUser.firstName ?? '',
          lastName: loggedInUser.lastName ?? '',
          profileImageUrl: loggedInUser.profileImageUrl ?? '',
          jobTitle: loggedInUser.jobTitle ?? '',
        },
        createdDate: new Date(),
        isDeleted: false,
        modifiedDate: new Date(),
        isSystemGenerated: true,
        isApprovalComment: false,
        isFinalThought: false,
        pdpId: OPTIMISTIC_ID,
      };

      queryClient.setQueryData<HttpCallReturn<Comment[]>>(pdpPlanKeys.comments(pdpId), (oldCreatedCommentList) => {
        if (oldCreatedCommentList && oldCreatedCommentList.response.length) {
          const newData = cloneDeep(oldCreatedCommentList);
          const indexToUpdate = newData.response.findIndex((item) => item.id === commonCommentDetails.id);

          if (indexToUpdate !== -1) {
            newData.response[indexToUpdate] = commonCommentDetails;
          }
          return newData;
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
        render: 'There was an error deleting the comment. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: (_, variables) => {
      toast.update(toastId.current, {
        render: 'Successfully deleted the comment.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.comments(variables.id) });
    },
  });

  return mutation;
};
