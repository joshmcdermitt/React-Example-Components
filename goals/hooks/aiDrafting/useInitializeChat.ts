import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { HttpCallReturn, postApi } from '~Deprecated/services/HttpService';
import { toast } from '~Common/components/Toasts';
import { ToastId } from '~Common/types';
import { useRef } from 'react';
import { queryClient } from '~Common/const/queryClient';
import { getOrganizationId } from '~Common/utils/localStorage';
import { v4 as uuidv4 } from 'uuid';
import { Goals, LLM } from '@josh-hr/types';

interface InitializeChatParams {
  threadId: string,
  assistantType: LLM.AssistantType,
  initialMessage: string,
}

interface InitializeChatReturn {
  id: string,
  role: LLM.MessageRole,
  content: string,
  jsonOutput: Goals.Goal,
  suggestions: {title: string, description: string}[],
}

interface LLMMessageWithSuggestions extends LLM.LLMMessage {
  suggestions: {title: string, description: string}[];
}

const initializeChat = ({ threadId, assistantType }: InitializeChatParams): Promise<HttpCallReturn<InitializeChatReturn[]>> => {
  const serverUrl = {
    version: 1,
    url: '/objectives/draftingAssistant/initialize-chat',
  };

  return postApi<InitializeChatReturn[]>(serverUrl, { threadId, assistantType }, {});
};

interface UseInitializeChatParams extends Omit<
  UseMutationOptions<HttpCallReturn<InitializeChatReturn[]>, Error, InitializeChatParams>, 'mutationFn'
> {
  errorText?: string,
  setIsProcessing?: (value: boolean) => void,
}

const setQueryCache = (threadId: string, messages: LLMMessageWithSuggestions[]): void => {
  const queryKey = [getOrganizationId(), 'objectives', 'draftingAssistant', 'chatHistory', threadId];

  const existingData = queryClient.getQueryData<{response: LLMMessageWithSuggestions[]}>(queryKey);
  const newData = existingData?.response ?? [];
  queryClient.setQueryData(queryKey, {
    response: [...newData, ...messages],
  });
};

export const useInitializeChat = ({
  errorText,
  setIsProcessing,
  ...options
}: UseInitializeChatParams = {}): UseMutationResult<HttpCallReturn<InitializeChatReturn[]>, Error, InitializeChatParams> => {
  const toastId = useRef<ToastId>(null);

  const mutation = useMutation({
    mutationFn: initializeChat,
    onMutate: (variables: InitializeChatParams) => {
      setQueryCache(variables.threadId, [{
        id: uuidv4(),
        role: LLM.MessageRole.User,
        content: variables.initialMessage,
        suggestions: [],
      }]);
      setIsProcessing?.(true);
    },
    onError: () => {
      toast.update(toastId.current, {
        render: errorText ?? 'There was an error initializing the chat. Please try again.',
        type: toast.TYPE.ERROR,
        autoClose: 5000,
      });
    },
    onSuccess(data, variables: InitializeChatParams) {
      const responses = data.response.map((response) => ({
        id: response.id,
        role: response.role,
        content: response.content,
        jsonOutput: response.jsonOutput,
        suggestions: response.suggestions,
      }));
      setQueryCache(variables.threadId, responses);
    },
    onSettled: () => {
      setIsProcessing?.(false);
    },
    ...options,
  });

  return mutation;
};
