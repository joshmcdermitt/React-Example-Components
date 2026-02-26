import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { toast } from '~Common/components/Toasts';
import { ToastId } from '~Common/types';
import { useRef } from 'react';
import { getOrganizationId } from '~Common/utils/localStorage';
import { queryClient } from '~Common/const/queryClient';
import { v4 as uuidv4 } from 'uuid';
import { Goals, LLM } from '@josh-hr/types';
import { useDraftedObjectiveStore } from './useDraftedObjectiveStore';

interface SendMessageParams {
  threadId: string,
  message: string,
  hideMessage?: boolean,
}

// eslint-disable-next-line max-len
const sendMessage = ({ threadId, message }: SendMessageParams): Promise<HttpCallReturn<LLM.LLMMessage[]>> => {
  const serverUrl = {
    version: 1,
    url: '/objectives/draftingAssistant/send-message',
  };

  return postApi<LLM.LLMMessage[]>(serverUrl, { threadId, messages: message }, {});
};

interface UseSendMessageParams extends Omit<
  UseMutationOptions<HttpCallReturn<LLM.LLMMessage[]>, Error, SendMessageParams>, 'mutationFn'
> {
  errorText?: string,
  setIsProcessing?: (value: boolean) => void,
  hideMessage?: boolean,
}

const setQueryCache = (threadId: string, messages: LLM.LLMMessage[]): void => {
  const queryKey = [getOrganizationId(), 'objectives', 'draftingAssistant', 'chatHistory', threadId];

  const existingData = queryClient.getQueryData<{response: LLM.LLMMessage[]}>(queryKey);
  const newData = existingData?.response ?? [];
  queryClient.setQueryData(queryKey, {
    response: [...newData, ...messages],
  });
};

export const useSendMessage = ({
  errorText,
  setIsProcessing,
  ...options
// eslint-disable-next-line max-len
}: UseSendMessageParams = {}): UseMutationResult<HttpCallReturn<LLM.LLMMessage[]>, Error, SendMessageParams> => {
  const toastId = useRef<ToastId>(null);
  const { setDraftedObjective } = useDraftedObjectiveStore();

  const mutation = useMutation({
    mutationFn: sendMessage,
    onError: () => {
      toast.update(toastId.current, {
        render: errorText ?? 'There was an error sending the message. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess(data, variables: SendMessageParams) {
      const messages = data.response.map((response: LLM.LLMMessage) => ({
        id: response.id,
        role: response.role,
        content: response.content,
        jsonOutput: response.jsonOutput,
        suggestions: response.suggestions,
      }));

      if (!messages[0].content && !messages[0].suggestions && messages[0].jsonOutput) {
        messages[0].content = '*Objective has been updated*';
      }
      setQueryCache(variables.threadId, messages);
      const messageWithDraftedObjective = data.response.find((response) => response.jsonOutput);
      if (messageWithDraftedObjective?.jsonOutput) {
        setDraftedObjective(messageWithDraftedObjective.jsonOutput as Goals.Goal);
      }
    },
    onMutate: (variables: SendMessageParams) => {
      if (!variables.hideMessage) {
        const messages = [{
          id: uuidv4(),
          role: LLM.MessageRole.User,
          content: variables.message,
          jsonOutput: undefined,
          suggestions: [],
        }];
        setQueryCache(variables.threadId, messages);
      }
      setIsProcessing?.(true);
    },
    onSettled: () => {
      setIsProcessing?.(false);
    },
    ...options,
  });

  return mutation;
};
