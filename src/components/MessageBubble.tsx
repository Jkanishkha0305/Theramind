import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../utils/theme';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isLatest }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.95);

  const isUser = message.role === 'user';

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  if (isUser) {
    return (
      <Animated.View style={[styles.container, styles.userContainer, animatedStyle]}>
        <LinearGradient
          colors={theme.gradients.userBubble}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.userBubble}
        >
          <Text style={styles.userText}>{message.content}</Text>
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, styles.aiContainer, animatedStyle]}>
      <View style={styles.aiBubble}>
        <Text style={styles.aiText}>{message.content}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  userBubble: {
    maxWidth: '80%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderBottomRightRadius: theme.borderRadius.sm,
    ...theme.shadows.small,
  },
  aiBubble: {
    maxWidth: '80%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderBottomLeftRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.aiMessage,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  userText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
  },
  aiText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
    lineHeight: theme.typography.body.lineHeight,
  },
});

