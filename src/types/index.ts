export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isModelLoaded: boolean;
  isGenerating: boolean;
}

export interface ModelConfig {
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
}

export interface LLMResponse {
  text: string;
  isComplete: boolean;
}

