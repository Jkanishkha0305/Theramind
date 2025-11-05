import { create } from 'zustand';
import { Message, Conversation, ModelConfig } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isModelLoaded: boolean;
  isGenerating: boolean;
  modelConfig: ModelConfig;
  
  // Actions
  addMessage: (conversationId: string, message: Message) => void;
  createConversation: () => string;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string | null) => void;
  setModelLoaded: (loaded: boolean) => void;
  setGenerating: (generating: boolean) => void;
  updateModelConfig: (config: Partial<ModelConfig>) => void;
  loadConversations: () => Promise<void>;
  saveConversations: () => Promise<void>;
  getCurrentConversation: () => Conversation | null;
  updateMessageContent: (conversationId: string, messageId: string, content: string) => void;
}

const STORAGE_KEY = '@theramind_conversations';

const createNewConversation = (): Conversation => ({
  id: Date.now().toString(),
  title: 'New Chat',
  messages: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  isModelLoaded: false,
  isGenerating: false,
  modelConfig: {
    temperature: 0.7,
    maxTokens: 512,
    topP: 0.9,
    topK: 40,
  },

  addMessage: (conversationId, message) => {
    set((state) => {
      const conversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = [...conv.messages, message];
          // Update title based on first user message
          const title = conv.messages.length === 0 && message.role === 'user'
            ? message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '')
            : conv.title;
          
          return {
            ...conv,
            messages: updatedMessages,
            title,
            updatedAt: Date.now(),
          };
        }
        return conv;
      });
      return { conversations };
    });
    
    // Save to storage after adding message
    setTimeout(() => get().saveConversations(), 100);
  },

  updateMessageContent: (conversationId, messageId, content) => {
    set((state) => {
      const conversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.map((msg) =>
              msg.id === messageId ? { ...msg, content } : msg
            ),
            updatedAt: Date.now(),
          };
        }
        return conv;
      });
      return { conversations };
    });
  },

  createConversation: () => {
    const newConv = createNewConversation();
    set((state) => ({
      conversations: [newConv, ...state.conversations],
      currentConversationId: newConv.id,
    }));
    get().saveConversations();
    return newConv.id;
  },

  deleteConversation: (id) => {
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
      currentConversationId:
        state.currentConversationId === id ? null : state.currentConversationId,
    }));
    get().saveConversations();
  },

  setCurrentConversation: (id) => {
    set({ currentConversationId: id });
  },

  setModelLoaded: (loaded) => {
    set({ isModelLoaded: loaded });
  },

  setGenerating: (generating) => {
    set({ isGenerating: generating });
  },

  updateModelConfig: (config) => {
    set((state) => ({
      modelConfig: { ...state.modelConfig, ...config },
    }));
  },

  loadConversations: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const conversations = JSON.parse(stored);
        set({ conversations });
      } else {
        // Create initial conversation if none exist
        const initialConv = createNewConversation();
        set({ conversations: [initialConv], currentConversationId: initialConv.id });
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      // Create initial conversation on error
      const initialConv = createNewConversation();
      set({ conversations: [initialConv], currentConversationId: initialConv.id });
    }
  },

  saveConversations: async () => {
    try {
      const { conversations } = get();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  },

  getCurrentConversation: () => {
    const { conversations, currentConversationId } = get();
    return conversations.find((conv) => conv.id === currentConversationId) || null;
  },
}));

