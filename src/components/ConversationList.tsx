import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useChatStore } from '../store/chatStore';
import { theme } from '../utils/theme';
import * as Haptics from 'expo-haptics';
import { Conversation } from '../types';

interface ConversationListProps {
  visible: boolean;
  onClose: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  visible,
  onClose,
}) => {
  const {
    conversations,
    currentConversationId,
    setCurrentConversation,
    deleteConversation,
    createConversation,
  } = useChatStore();

  const translateX = useSharedValue(300);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      translateX.value = withSpring(0, { damping: 20, stiffness: 90 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateX.value = withSpring(300, { damping: 20, stiffness: 90 });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleSelectConversation = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentConversation(id);
    onClose();
  };

  const handleDeleteConversation = (id: string, e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (conversations.length === 1) {
      // Don't delete the last conversation, just create a new one
      createConversation();
    }
    
    deleteConversation(id);
  };

  const handleNewConversation = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    createConversation();
    onClose();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getPreview = (conv: Conversation) => {
    if (conv.messages.length === 0) return 'No messages yet';
    const lastMessage = conv.messages[conv.messages.length - 1];
    return lastMessage.content.slice(0, 60) + (lastMessage.content.length > 60 ? '...' : '');
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>

        <Animated.View style={[styles.drawer, drawerStyle]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Conversations</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleNewConversation}
            style={styles.newButton}
          >
            <Text style={styles.newButtonIcon}>+</Text>
            <Text style={styles.newButtonText}>New Conversation</Text>
          </TouchableOpacity>

          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {conversations.map((conv) => (
              <TouchableOpacity
                key={conv.id}
                style={[
                  styles.conversationItem,
                  conv.id === currentConversationId && styles.activeConversation,
                ]}
                onPress={() => handleSelectConversation(conv.id)}
                activeOpacity={0.7}
              >
                <View style={styles.conversationContent}>
                  <Text
                    style={[
                      styles.conversationTitle,
                      conv.id === currentConversationId && styles.activeText,
                    ]}
                    numberOfLines={1}
                  >
                    {conv.title}
                  </Text>
                  <Text style={styles.conversationPreview} numberOfLines={2}>
                    {getPreview(conv)}
                  </Text>
                  <Text style={styles.conversationDate}>
                    {formatDate(conv.updatedAt)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={(e) => handleDeleteConversation(conv.id, e)}
                  style={styles.deleteButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {conversations.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No conversations yet</Text>
                <Text style={styles.emptySubtext}>
                  Start a new conversation to get started
                </Text>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '85%',
    maxWidth: 400,
    backgroundColor: theme.colors.surface,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.1)',
    ...theme.shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    color: theme.colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 20,
    color: theme.colors.text.secondary,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  newButtonIcon: {
    fontSize: 24,
    color: theme.colors.accent,
    marginRight: theme.spacing.sm,
  },
  newButtonText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.accent,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  activeConversation: {
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  conversationContent: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  conversationTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  activeText: {
    color: theme.colors.accent,
  },
  conversationPreview: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  conversationDate: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.muted,
  },
  deleteButton: {
    padding: theme.spacing.sm,
  },
  deleteText: {
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
});

