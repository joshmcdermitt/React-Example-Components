import { Goals } from '@josh-hr/types';
import {
  useMutation, UseMutationOptions, UseMutationResult,
} from '@tanstack/react-query';
import { useRef } from 'react';
import { toast } from '~Common/components/Toasts';
import { ToastId } from '~Common/types';
import { HttpCallReturn, patchApi } from '~Deprecated/services/HttpService';

export interface EditGoalParticipantsParams {
  payload: Goals.Requests.UpdateGoalParticipantsRequestPayload,
  goalId: string,
}

const editGoalParticipants = ({ payload, goalId }: EditGoalParticipantsParams): Promise<HttpCallReturn<string>> => {
  const serverUrl = {
    version: 3,
    url: `/goals/${goalId}/participants`,
  };

  return patchApi<string>(serverUrl, payload, {});
};

type UseEditGoalParticipants = Omit<
  UseMutationOptions<HttpCallReturn<string>, Error, EditGoalParticipantsParams>, 'mutationFn'
>;

export const useEditGoalParticipants = ({
  ...options
}: UseEditGoalParticipants = {}): UseMutationResult<HttpCallReturn<string>, unknown, EditGoalParticipantsParams, unknown> => {
  const toastId = useRef<ToastId>(null);
  const mutation = useMutation({
    mutationFn: editGoalParticipants,
    onError: () => {
      toast.update(toastId.current, {
        render: 'There was an error updating your participants. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    ...options,
  });

  return mutation;
};
