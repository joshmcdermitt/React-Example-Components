import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const usePersistedChat = (): {
  threadId: string;
  assistantType: string;
  setAssistantType: (type: string) => void;
  clearStoredChat: () => void;
  initializeStoredChat: () => void;
} => {
  const [storedChat, setStoredChat] = useState<{ threadId: string; assistantType: string }>({
    threadId: '',
    assistantType: '',
  });

  useEffect(() => {
    const storedData = localStorage.getItem('objectiveDrafting');

    if (storedData) {
      setStoredChat(JSON.parse(storedData) as { threadId: string; assistantType: string });
    } else {
      const newThreadId = uuidv4();
      const newStoredData = { threadId: newThreadId, assistantType: '' };
      localStorage.setItem('objectiveDrafting', JSON.stringify(newStoredData));
      setStoredChat(newStoredData);
    }
  }, []);

  const setAssistantType = (type: string): void => {
    if (storedChat) {
      localStorage.setItem('objectiveDrafting', JSON.stringify({ ...storedChat, assistantType: type }));
      setStoredChat((prev: { threadId: string; assistantType: string }) => ({ ...prev, assistantType: type }));
    }
  };

  const clearStoredChat = (): void => {
    const resetStoredData = { threadId: uuidv4(), assistantType: '' };
    localStorage.setItem('objectiveDrafting', JSON.stringify(resetStoredData));
  };

  const initializeStoredChat = (): void => {
    const newThreadId = uuidv4();
    const newStoredData = { threadId: newThreadId, assistantType: '' };
    localStorage.setItem('objectiveDrafting', JSON.stringify(newStoredData));
    setStoredChat(newStoredData);
  };

  return {
    ...storedChat,
    setAssistantType,
    clearStoredChat,
    initializeStoredChat,
  };
};
