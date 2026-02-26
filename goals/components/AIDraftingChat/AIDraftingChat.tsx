import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { v4 as uuidv4 } from 'uuid';
import { faTimes } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Control, Controller, useForm } from 'react-hook-form';
import { palette } from '~Common/styles/colors';
import JoshButton from '~Common/V3/components/JoshButtons/JoshButton';
import { useGetChatHistory } from '~Goals/hooks/aiDrafting/useGetChatHistory';
import { useInitializeChat } from '~Goals/hooks/aiDrafting/useInitializeChat';
import { usePersistedChat } from '~Goals/hooks/aiDrafting/usePersistedChat';
import { useSendMessage } from '~Goals/hooks/aiDrafting/useSendMessage';
import useAIDraftingStore from '~Goals/stores/useAIDraftingStore';
import Markdown from 'react-markdown';
import ThreeDotLoader from '~Common/V4/components/ThreeDotLoader';
import { Goals, LLM } from '@josh-hr/types';
import { useDraftedObjectiveStore } from '~Goals/hooks/aiDrafting/useDraftedObjectiveStore';
import { useFeatureFlag } from '~Common/hooks/featureFlags/useFeatureFlag';
import { AIChatInput } from './ChatInput';

const styles = {
  container: css({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minWidth: '23.75rem',
    maxWidth: '23.75rem',
    height: '100%',
    maxHeight: '90vh',
    backgroundColor: palette.neutrals.white,
    borderRadius: '1rem',
    border: `1px solid ${palette.neutrals.gray200}`,
    padding: '1rem',
    paddingRight: '0.5rem', // Reduce right padding to account for scrollbar
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      width: '0.5rem',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: palette.neutrals.gray200,
      borderRadius: '1rem',
    },
  }),
  chatContainer: css({
    flex: 1,
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    '&::-webkit-scrollbar': {
      width: '0.5rem',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: palette.neutrals.gray200,
      borderRadius: '1rem',
    },
  }),
  messageContainer: css({
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      borderRadius: '0.5rem',
    },
  }),
  message: css({
    padding: '0.625rem',
    backgroundColor: palette.neutrals.gray200,
    marginBottom: '1rem',
    marginRight: '1.25rem',
  }),
  userMessage: css({
    alignSelf: 'flex-end',
    backgroundColor: palette.brand.indigo,
    color: palette.neutrals.white,
    marginLeft: '1.25rem',
    marginRight: '0',
  }),
  loadingMessage: css({
    minHeight: '1.5rem',
    width: '4.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  loadingDots: css({
    '> div': {
      marginLeft: '0.15rem',
      marginRight: '0.15rem',
      backgroundColor: palette.neutrals.gray700,
    },
  }),
  header: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  }),
  footer: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
    marginTop: '1rem',
    paddingTop: '1rem',
    gap: '1rem',
    borderTop: `1px solid ${palette.neutrals.gray200}`,
    width: '100%',
  }),
  sendButton: css({
    backgroundColor: '#414651',
    color: palette.neutrals.white,
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0.5rem 0.75rem',
    marginLeft: '1rem',
    height: '2.5rem',
    '&:disabled': {
      backgroundColor: palette.neutrals.gray400,
      cursor: 'not-allowed',
    },
    '&:hover:not(:disabled)': {
      backgroundColor: palette.neutrals.gray600,
    },

  }),
  headerText: css({
    fontSize: '1.25rem',
    fontWeight: 600,
  }),
  form: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',

  }),
  startOverButton: css({
    color: palette.neutrals.gray700,
    '&:hover': {
      color: palette.neutrals.gray600,
    },
    '&:disabled': {
      color: palette.neutrals.gray400,
      cursor: 'not-allowed',
    },
  }),
  suggestionContainer: css({
    display: 'flex',
    flexDirection: 'column',
    padding: '0.75rem 0',
    '&:not(:last-of-type)': {
      borderBottom: `1px solid ${palette.neutrals.gray500}`,
    },
  }),
  suggestionTitle: css({
    fontWeight: 600,
    fontSize: '1rem',
  }),
  suggestionText: css({
    fontSize: '0.875rem',
    fontWeight: 400,
    color: palette.neutrals.gray700,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '4',
    WebkitBoxOrient: 'vertical',
  }),
  firstMessageText: css({
    paddingBottom: '.625rem',
  }),
  draftObjectiveButton: css({
    fontSize: '0.75rem',
    alignItems: 'flex-start',
    width: 'max-content',
    padding: '.125rem .5rem',
    borderRadius: '0.5rem',
  }),
};

const StyledButton = styled('button')(({ active }: { active: boolean }) => ({
  borderRadius: '0.5rem',
  padding: '0.625rem 0.875rem',
  margin: '0.25rem 0',
  fontSize: '0.875rem',
  fontWeight: 600,
  lineHeight: '1.125rem',
  backgroundColor: active ? palette.brand.indigo : palette.neutrals.white,
  color: active ? palette.neutrals.white : palette.neutrals.black,
  border: `1px solid ${palette.neutrals.gray300}`,
  '&:hover': {
    backgroundColor: palette.neutrals.gray400,
  },

}));

interface ViewProps {
  handleClose: () => void,
  control: Control<{ message: string }>,
  watch: (name: string) => string,
  handleSubmit: (func: (data: { message: string }) => void) => () => void,
  onSubmit: (data: { message: string }) => void,
  assistantType: string,
  handleCreateNewObjective: () => void,
  handleBrainstormIdeas: () => void,
  messages: { id: string; role: string; content: string; suggestions?: { title: string, description: string }[] }[],
  isProcessing: boolean,
  handleStartOver: () => void,
  isLoading: boolean,
  lastMessageRef: React.RefObject<HTMLDivElement>,
  processingMessageRef: React.RefObject<HTMLDivElement>,
  enableObjectivesAiDraftingBrainstorm: boolean,
  handleSelectSuggestion: (suggestion: { title: string; description: string }) => void,
}

const View = ({
  handleClose,
  control,
  watch,
  handleSubmit,
  onSubmit,
  assistantType,
  handleCreateNewObjective,
  handleBrainstormIdeas,
  messages,
  isProcessing,
  handleStartOver,
  isLoading,
  lastMessageRef,
  processingMessageRef,
  enableObjectivesAiDraftingBrainstorm,
  handleSelectSuggestion,
}: ViewProps): JSX.Element => (
  <div data-test-id="goalsAIDraftingChatContainer" css={styles.container}>
    <div data-test-id="goalsAIDraftingChatHeader" css={styles.header}>
      <h3 data-test-id="goalsAIDraftingChatHeaderText" css={styles.headerText}>Objectives Assistant</h3>
      <FontAwesomeIcon
        icon={faTimes}
        type="button"
        onClick={handleClose}
      />
    </div>
    <div data-test-id="goalsAIDraftingChatChatContainer" css={styles.chatContainer}>
      {isLoading && (
        <div data-test-id="goalsAIDraftingChatChatContainerLoadingMessage" css={styles.messageContainer}>
          <div data-test-id="goalsAIDraftingChatChatContainerLoadingMessageContent" css={[styles.message, styles.loadingMessage]}>
            <ThreeDotLoader loaderStyleOverrides={styles.loadingDots} />
          </div>
        </div>
      )}
      {!isLoading && (
        <div data-test-id="goalsAIDraftingChatChatContainerMessages" css={styles.messageContainer}>
          <div data-test-id="goalsAIDraftingChatChatContainerMessagesContent" css={styles.message}>
            <p data-test-id="goalsAIDraftingChatChatContainerMessagesContentText" css={styles.firstMessageText}>
              What can I help with?
            </p>
            {(assistantType === '' || assistantType === LLM.AssistantType.CreateObjective) && (
              <StyledButton
                onClick={handleCreateNewObjective}
                data-test-id="goalsAIDraftingChatCreateNewObjectiveButton"
                active={assistantType === LLM.AssistantType.CreateObjective}
                disabled={assistantType !== ''}
              >
                Creating an objective
              </StyledButton>
            )}
            {enableObjectivesAiDraftingBrainstorm && (assistantType === '' || assistantType === LLM.AssistantType.BrainstormObjectives) && (
              <StyledButton
                onClick={handleBrainstormIdeas}
                data-test-id="goalsAIDraftingChatBrainstormIdeasButton"
                active={assistantType === LLM.AssistantType.BrainstormObjectives}
                disabled={assistantType !== ''}
              >
                Brainstorm ideas for new objectives
              </StyledButton>
            )}
          </div>
          {messages.map((message, index) => (
            <div
              key={message.id}
              css={[styles.message, message.role === 'human' ? styles.userMessage : '']}
              ref={messages.length - 1 === index ? lastMessageRef : undefined}
            >
              {message.content && <Markdown>{message.content}</Markdown>}
              {message.suggestions?.map((suggestion) => (
                <div css={styles.suggestionContainer} key={suggestion.title}>
                  <Markdown css={styles.suggestionTitle}>{suggestion.title}</Markdown>
                  <Markdown css={styles.suggestionText}>{suggestion.description}</Markdown>
                  <StyledButton
                    data-test-id="goalsAIDraftingChatSelectSuggestionButton"
                    active={false}
                    onClick={() => {
                      handleSelectSuggestion(suggestion);
                    }}
                    css={styles.draftObjectiveButton}
                  >
                    Draft objective
                  </StyledButton>
                </div>
              ))}
            </div>
          ))}
          {isProcessing && (
            <div css={[styles.message, styles.loadingMessage]} ref={processingMessageRef}>
              <ThreeDotLoader loaderStyleOverrides={styles.loadingDots} />
            </div>
          )}
        </div>
      )}
    </div>
    <div data-test-id="goalsAIDraftingChatFooter" css={styles.footer}>
      <form onSubmit={handleSubmit(onSubmit)} data-test-id="goalsAIDraftingChatFooterForm" css={styles.form}>
        <Controller
          name="message"
          control={control}
          render={({ field }) => <AIChatInput content={field.value} onChange={field.onChange} handleSubmit={handleSubmit(onSubmit)} />}
        />
        <JoshButton
          variant="default"
          type="submit"
          css={styles.sendButton}
          data-test-id="goalsAIDraftingChatSendButton"
          disabled={assistantType === '' || !watch('message')?.trim()}
        >
          Send
        </JoshButton>
      </form>
      <JoshButton
        variant="text"
        type="button"
        data-test-id="goalsAIDraftingChatStartOverButton"
        onClick={handleStartOver}
        css={styles.startOverButton}
      >
        Start over
      </JoshButton>
    </div>
  </div>
);

const AIDraftingChat = (): JSX.Element => {
  const { setShowObjectivesAIDraftingTool } = useAIDraftingStore();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { mutate: sendMessage } = useSendMessage({ setIsProcessing });
  const { mutate: initializeChat } = useInitializeChat({ setIsProcessing });
  const { setDraftedObjective } = useDraftedObjectiveStore();
  const enableObjectivesAiDraftingBrainstorm = useFeatureFlag('enableObjectivesAiDraftingBrainstorm');
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const processingMessageRef = useRef<HTMLDivElement>(null);
  const {
    threadId = '',
    assistantType = '',
    setAssistantType,
    initializeStoredChat,
  } = usePersistedChat() ?? {};

  const {
    data: historyData,
    isLoading,
  } = useGetChatHistory({ threadId, enabled: !!threadId });

  const chatHistory = historyData?.response;

  const [messages, setMessages] = useState<{ id: string; role: string; content: string; suggestions?: { title: string, description: string }[] }[]>([]);

  useEffect(() => {
    if (chatHistory) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  useEffect(() => {
    if (processingMessageRef.current && isProcessing) {
      processingMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [isProcessing]);

  useEffect(() => {
    const lastJsonOutputMessage = chatHistory?.slice().reverse().find((message) => message.jsonOutput !== null);
    if (lastJsonOutputMessage) {
      setDraftedObjective(lastJsonOutputMessage.jsonOutput as Goals.Goal);
    }
  }, [chatHistory, setDraftedObjective]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
  } = useForm<{ message: string }>({});

  const onSubmit = (data: { message: string }): void => {
    reset({ message: '' });
    sendMessage({ ...data, threadId });
  };

  const handleClose = (): void => {
    setShowObjectivesAIDraftingTool(false);
  };

  const handleStartOver = (): void => {
    setMessages([]);
    reset({ message: '' });
    initializeStoredChat();
    setDraftedObjective({} as Goals.Goal);
  };

  const handleCreateNewObjective = useCallback((): void => {
    const initialMessage = 'Creating an objective';
    initializeChat({ threadId, assistantType: LLM.AssistantType.CreateObjective, initialMessage });
    setAssistantType(LLM.AssistantType.CreateObjective);
    setMessages([
      {
        id: uuidv4(),
        role: 'human',
        content: initialMessage,
      },
    ]);
  }, [initializeChat, threadId, setAssistantType]);

  const handleBrainstormIdeas = useCallback((): void => {
    const initialMessage = 'Brainstorm Ideas';
    initializeChat({ threadId, assistantType: LLM.AssistantType.BrainstormObjectives, initialMessage });
    setAssistantType(LLM.AssistantType.BrainstormObjectives);
    setMessages([
      {
        id: uuidv4(),
        role: 'human',
        content: initialMessage,
      },
    ]);
  }, [initializeChat, threadId, setAssistantType]);

  const handleSelectSuggestion = useCallback((suggestion: { title: string; description: string }): void => {
    sendMessage({
      message: `Draft an objective based on the title ${suggestion.title} and description ${suggestion.description}`,
      threadId,
      hideMessage: true,
    });
  }, [sendMessage, threadId]);

  const hookProps = {
    handleClose,
    control,
    watch,
    handleSubmit,
    onSubmit,
    assistantType,
    handleCreateNewObjective,
    handleBrainstormIdeas,
    messages: messages.filter((message) => message.content !== '' || (message.suggestions?.length ?? 0) > 0),
    isProcessing,
    handleStartOver,
    isLoading,
    lastMessageRef,
    processingMessageRef,
    enableObjectivesAiDraftingBrainstorm,
    handleSelectSuggestion,
  };

  return (
    <View
      {...hookProps}
    />
  );
};

export default AIDraftingChat;
