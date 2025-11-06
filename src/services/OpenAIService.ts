import 'expo/fetch'; // Enable streaming support for React Native
import OpenAI from 'openai';
import { Message } from '../types';
import Constants from 'expo-constants';

class OpenAIService {
  private client: OpenAI | null = null;
  private apiKey: string | null = null;

  constructor() {
    // Try to initialize from environment variable
    const envKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY || 
                   process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    
    if (envKey && envKey !== 'your-api-key-here') {
      this.initialize(envKey);
      console.log('[OpenAI] Initialized from environment variable');
    }
  }

  /**
   * Initialize OpenAI client with API key
   */
  initialize(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Note: For production, use a backend proxy
    });
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.client !== null && this.apiKey !== null;
  }

  /**
   * Generate AI response with simulated streaming
   * (React Native doesn't support real streaming, so we simulate it)
   */
  async generateResponse(
    messages: Message[],
    onToken: (token: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    if (!this.client) {
      onError(new Error('OpenAI client not initialized. Please add your API key.'));
      return;
    }

    try {
      // Convert our message format to OpenAI format
      const openAIMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add system prompt for therapy/companion context
      const systemMessage = {
        role: 'system' as const,
        content: `You are Theramind, a compassionate AI companion and mental wellness assistant. 
You provide emotional support, active listening, and helpful insights. 
Be warm, empathetic, and non-judgmental. 
Ask thoughtful follow-up questions when appropriate.
Keep responses concise but meaningful (2-4 sentences usually).
If someone is in crisis, encourage them to seek professional help.`,
      };

      // Get full response (no streaming in React Native)
      const response = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...openAIMessages],
        stream: false,
        temperature: 0.7,
        max_tokens: 500,
      });

      const fullText = response.choices[0]?.message?.content || '';

      // Simulate streaming by sending tokens word by word
      const words = fullText.split(' ');
      for (let i = 0; i < words.length; i++) {
        const word = i === 0 ? words[i] : ' ' + words[i];
        onToken(word);
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      onComplete();
    } catch (error) {
      console.error('[OpenAI] Error:', error);
      onError(error as Error);
    }
  }

  /**
   * Generate non-streaming response (for testing)
   */
  async generateSimple(messages: Message[]): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized');
    }

    const openAIMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const systemMessage = {
      role: 'system' as const,
      content: `You are Theramind, a compassionate AI companion. Be warm, empathetic, and helpful.`,
    };

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...openAIMessages],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  }

  /**
   * Test API key validity
   */
  async testConnection(): Promise<boolean> {
    if (!this.client) return false;

    try {
      await this.client.models.list();
      return true;
    } catch (error) {
      console.error('[OpenAI] Connection test failed:', error);
      return false;
    }
  }
}

export const openAIService = new OpenAIService();

