import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import { useChatStore } from '../src/store/chatStore';
import { GradientBackground } from '../src/components/GradientBackground';
import { MessageBubble } from '../src/components/MessageBubble';
import { TypingIndicator } from '../src/components/TypingIndicator';
import { ChatInput } from '../src/components/ChatInput';
import { ConversationList } from '../src/components/ConversationList';
import { SettingsModal, API_KEY_STORAGE } from '../src/components/SettingsModal';
import { openAIService } from '../src/services/OpenAIService';
import { voiceService } from '../src/services/VoiceService';
import { theme } from '../src/utils/theme';
import { Message } from '../src/types';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [showConversations, setShowConversations] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isAIEnabled, setIsAIEnabled] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const {
    conversations,
    currentConversationId,
    isGenerating,
    loadConversations,
    createConversation,
    addMessage,
    setGenerating,
    getCurrentConversation,
    updateMessageContent,
  } = useChatStore();

  const currentConversation = getCurrentConversation();

  useEffect(() => {
    loadConversations();
    checkAPIKey();
  }, []);

  useEffect(() => {
    if (!currentConversationId && conversations.length === 0) {
      createConversation();
    }
  }, [currentConversationId, conversations]);

  const checkAPIKey = async () => {
    try {
      const storedKey = await AsyncStorage.getItem(API_KEY_STORAGE);
      if (storedKey) {
        openAIService.initialize(storedKey);
        setApiKey(storedKey);
        setIsAIEnabled(true);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const toggleAutoSpeak = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAutoSpeak(!autoSpeak);
  };

  const handleSend = async (text: string) => {
    if (!currentConversationId) {
      const newId = createConversation();
      handleSendWithId(newId, text);
    } else {
      handleSendWithId(currentConversationId, text);
    }
  };

  const handleSendWithId = async (conversationId: string, text: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    addMessage(conversationId, userMessage);

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Set generating state
    setGenerating(true);

    // Check if AI is enabled
    if (!isAIEnabled) {
      // Show settings prompt
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '👋 Hi! To enable AI responses, please add your OpenAI API key in Settings (gear icon in top right).',
          timestamp: Date.now(),
        };
        addMessage(conversationId, aiMessage);
        setGenerating(false);
      }, 500);
      return;
    }

    // Create AI message placeholder
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    addMessage(conversationId, aiMessage);

    // Get conversation context
    const conv = conversations.find((c) => c.id === conversationId);
    const messages = conv?.messages || [];

    // Stream AI response
    let fullResponse = '';
    
    await openAIService.generateResponse(
      messages,
      (token) => {
        // Update message with streaming tokens
        fullResponse += token;
        updateMessageContent(conversationId, aiMessageId, fullResponse);
        
        // Auto-scroll
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 50);
      },
      () => {
        // On complete
        setGenerating(false);
        
        // Auto-speak if enabled
        if (autoSpeak && fullResponse) {
          voiceService.speak(fullResponse);
        }
        
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      },
      (error) => {
        // On error
        console.error('AI Error:', error);
        updateMessageContent(
          conversationId,
          aiMessageId,
          '❌ Sorry, I encountered an error. Please check your API key in Settings.'
        );
        setGenerating(false);
      }
    );
  };

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createConversation();
  };

  const handleOpenConversations = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowConversations(true);
  };

  const handleOpenSettings = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSettings(true);
  };

  const handleApiKeySet = () => {
    setIsAIEnabled(true);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleOpenConversations}
            style={styles.menuButton}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {currentConversation?.title || 'New Chat'}
          </Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={toggleAutoSpeak} style={styles.voiceButton}>
              <Text style={styles.voiceIcon}>{autoSpeak ? '🔊' : '🔇'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenSettings} style={styles.settingsButton}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
              <Text style={styles.newChatText}>+ New</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={currentConversation?.messages || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <MessageBubble
              message={item}
              isLatest={index === (currentConversation?.messages.length || 0) - 1}
            />
          )}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>Welcome to Theramind</Text>
              <Text style={styles.emptySubtitle}>
                Your personal AI companion running entirely on your device
              </Text>
              <Text style={styles.emptyHint}>Send a message to get started</Text>
            </View>
          }
          ListFooterComponent={isGenerating ? <TypingIndicator /> : null}
          onContentSizeChange={() => {
            if (currentConversation?.messages.length) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
        />

        <ChatInput 
          onSend={handleSend} 
          disabled={isGenerating}
          openAIKey={apiKey || undefined}
        />
      </SafeAreaView>

      <ConversationList
        visible={showConversations}
        onClose={() => setShowConversations(false)}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onApiKeySet={handleApiKeySet}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  menuIcon: {
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  headerTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 20,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  newChatButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  newChatText: {
    color: theme.colors.accent,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  messageList: {
    paddingVertical: theme.spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.h1.fontSize,
    fontWeight: theme.typography.h1.fontWeight,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  emptyHint: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.accent,
    textAlign: 'center',
  },
});

