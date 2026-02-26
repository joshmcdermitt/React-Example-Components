import { UseMutationResult, useMutation } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { queryClient } from '~Common/const/queryClient';
import { ToastId } from '~Common/types';
import { getUserId } from '~Common/utils/localStorage';
import { useUserProfile } from '~Deprecated/hooks/profile/useUserProfile';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { DEFAULT_USER, OPTIMISTIC_ID } from '~DevelopmentPlan/const/defaults';
import { pdpPlanKeys } from '~DevelopmentPlan/const/queryKeys';
import { Comment } from '~DevelopmentPlan/const/types';
import { CreateCommentDTO } from '~DevelopmentPlan/schemata/createCommentSchemata';

interface CreateCommentProps {
  id: string,
  comment: CreateCommentDTO,
  finalThoughtForm?: boolean,
}

const createComment = ({ id, comment }: CreateCommentProps): Promise<HttpCallReturn<Comment>> => {
  const url = {
    url: `/developmentplans/${id}/comments`,
  };

  return postApi(url, comment, {});
};

export const useCreateComment = (): UseMutationResult<HttpCallReturn<Comment>, unknown, CreateCommentProps> => {
  const { user: loggedInUser } = useUserProfile(getUserId() ?? '');

  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: createComment,
    onMutate: async (newComment: Omit<CreateCommentProps, 'competencyId'>) => {
      const isFinalThought = newComment.finalThoughtForm ?? false;
      const pdpId = newComment.id;
      toastId.current = toast.info('Creating your comment...', { autoClose: false });
      // Cancel any existing outbound queries
      await queryClient.cancelQueries({ queryKey: pdpPlanKeys.comments(pdpId) });
      const previousReceivedCommentsList = queryClient.getQueryData<HttpCallReturn<Comment[]>>(pdpPlanKeys.comments(pdpId));

      const commonCommentDetails = {
        id: OPTIMISTIC_ID,
        content: newComment.comment.content,
        createdBy: {
          orgUserId: DEFAULT_USER.orgUserId ?? '',
          firstName: loggedInUser?.firstName ?? '',
          lastName: loggedInUser?.lastName ?? '',
          profileImageUrl: loggedInUser?.profileImageUrl ?? '',
          jobTitle: loggedInUser?.jobTitle ?? '',
        },
        createdDate: new Date(),
        isDeleted: false,
        modifiedDate: new Date(),
        isSystemGenerated: false,
        isApprovalComment: false,
        isFinalThought,
        pdpId: OPTIMISTIC_ID,
      };

      const newCreatedComment = {
        ...commonCommentDetails,
      };

      queryClient.setQueryData<HttpCallReturn<Comment[]>>(pdpPlanKeys.comments(pdpId), (oldCreatedCommentList) => {
        if (oldCreatedCommentList && oldCreatedCommentList.response?.length) {
          const newData = cloneDeep(oldCreatedCommentList);
          newData.response.push(newCreatedComment);
          return newData;
        }

        return oldCreatedCommentList;
      });
      // Return a context object with the old snapshotted values used below
      return {
        previousReceivedCommentsList,
      };
    },
    // We need to scroll to the bottom of the comments section after the mutation is settled because of the optimistic update
    onSettled: () => {
      const commentArea = document.getElementById('commentWrapper');
      if (commentArea) {
        commentArea.scrollTop = commentArea.offsetHeight;
      }
    },
    onError: (_, variables, snapshot) => {
      queryClient.setQueryData(pdpPlanKeys.comments(variables.id), snapshot?.previousReceivedCommentsList);
      toast.update(toastId.current, {
        render: 'There was an error creating your comment. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess: (_, variables) => {
      toast.update(toastId.current, {
        render: 'Successfully created your comment.',
        type: toast.TYPE.SUCCESS,
        autoClose: 5000,
      });
      // We only want to get the finalthoughts if the comment is a final thought
      // We only want to get the details if the comment is a final thought just in case the PDP updates to a closed state
      if (variables.finalThoughtForm) {
        void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.detail(variables.id) });
        void queryClient.invalidateQueries({ queryKey: pdpPlanKeys.finalThoughts(variables.id) });
      }
    },
  });

  return mutation;
};
