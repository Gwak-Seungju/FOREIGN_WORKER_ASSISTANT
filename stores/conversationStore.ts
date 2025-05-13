import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { create } from 'zustand';

export type Conversation = {
  id: number;
  title: string;
};

type ConversationState = {
  conversations: Conversation[];
  setConversations: (list: Conversation[]) => void;
  addConversation: (conv: Conversation) => void;
  updateTitle: (id: number, title: string) => void;
};

// ✅ 기본 store 생성 로직
const createStore = () => {
  return (set: any) => ({
    conversations: [],
    setConversations: (list: Conversation[]) => set({ conversations: list }),
    addConversation: (conv: Conversation) =>
      set((state: ConversationState) => ({ conversations: [...state.conversations, conv] })),
    updateTitle: (id: number, title: string) =>
      set((state: ConversationState) => ({
        conversations: state.conversations.map((c) =>
          c.id === id ? { ...c, title } : c
        ),
      })),
  });
};

// ✅ 앱 환경에서는 persist 사용
let useConversationStore: any;

if (Platform.OS !== 'web') {
  const { persist, createJSONStorage } = require('zustand/middleware');
  useConversationStore = create<ConversationState>()(
    persist(createStore(), {
      name: 'chat_conversations',
      storage: createJSONStorage(() => AsyncStorage),
    })
  );
} else {
  // 웹에서는 persist 없이
  useConversationStore = create<ConversationState>()(createStore());
}

export { useConversationStore };
