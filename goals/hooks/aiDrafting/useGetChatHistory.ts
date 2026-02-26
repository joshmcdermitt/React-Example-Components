import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { getApi, HttpCallReturn } from '~Deprecated/services/HttpService';
import { getOrganizationId } from '~Common/utils/localStorage';
import { Goals, LLM } from '@josh-hr/types';

type GetChatHistoryParams = Omit<Goals.Requests.DraftingAssistantGetHistoryRequest, 'organizationId'>;
export type GetChatHistoryReturn = LLM.LLMMessage[];

const getChatHistory = ({ threadId }: GetChatHistoryParams): Promise<HttpCallReturn<GetChatHistoryReturn>> => {
  const serverUrl = {
    version: 1,
    url: `/objectives/draftingAssistant/get-history?threadId=${threadId}`,
  };

  return getApi<GetChatHistoryReturn>(serverUrl, {});
};

export interface UseGetChatHistoryParams<T> extends Omit<UseQueryOptions<HttpCallReturn<GetChatHistoryReturn>, Error, T>, 'queryKey' | 'queryFn'> {
  threadId: string,
}

export type UseGetChatHistoryReturn<T = HttpCallReturn<GetChatHistoryReturn>> = UseQueryResult<T, Error>;

export const useGetChatHistory = <T = HttpCallReturn<GetChatHistoryReturn>>({
  threadId,
  ...options
}: UseGetChatHistoryParams<T>): UseQueryResult<T, Error> => useQuery({
    queryKey: [getOrganizationId(), 'objectives', 'draftingAssistant', 'chatHistory', threadId],
    queryFn: () => getChatHistory({ threadId }),
    ...options,
  });
