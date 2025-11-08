import React, { useEffect, useRef } from 'react';
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
import { theme } from '../src/utils/theme';
import { Message } from '../src/types';
import * as Haptics from 'expo-haptics';

export default function ChatScreen() {
  const flatListRef = useRef<FlatList>(null);
  const {
    conversations,
    currentConversationId,
    isGenerating,
    loadConversations,
    createConversation,
    addMessage,
    setGenerating,
    getCurrentConversation,
  } = useChatStore();

  const currentConversation = getCurrentConversation();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!currentConversationId && conversations.length === 0) {
      createConversation();
    }
  }, [currentConversationId, conversations]);

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

    // TODO: Replace with actual LLM inference
    // For now, simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: simulateAIResponse(text),
        timestamp: Date.now(),
      };
      addMessage(conversationId, aiMessage);
      setGenerating(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);
  };

  // Temporary simulation function - will be replaced with actual LLM
  const simulateAIResponse = (userText: string): string => {
    const responses = [
      "I'm here to help! This is a temporary response. Once the LLM is integrated, I'll provide intelligent responses.",
      "That's an interesting question! Currently, I'm a placeholder response. The actual AI model will be integrated soon.",
      "I understand. This is a simulated response for now. The real on-device AI will be connected shortly.",
      "Great! I'm processing your message. This is a demo response until the LLM service is fully integrated.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createConversation();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {currentConversation?.title || 'New Chat'}
          </Text>
          <TouchableOpacity onPress={handleNewChat} style={styles.newChatButton}>
            <Text style={styles.newChatText}>+ New</Text>
          </TouchableOpacity>
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

        <ChatInput onSend={handleSend} disabled={isGenerating} />
      </SafeAreaView>
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
  headerTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    color: theme.colors.text.primary,
    flex: 1,
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

