import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../utils/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const buttonScale = useSharedValue(1);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSend(message.trim());
      setMessage('');
    }
  };

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.9, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={theme.colors.text.muted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={2000}
            editable={!disabled}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <AnimatedTouchable
            onPress={handleSend}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!canSend}
            style={buttonAnimatedStyle}
          >
            <LinearGradient
              colors={
                canSend
                  ? theme.gradients.button
                  : (['rgba(102, 126, 234, 0.3)', 'rgba(167, 139, 250, 0.3)'] as readonly [string, string])
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.sendButton}
            >
              <View style={styles.sendIcon}>
                <View style={styles.arrow} />
              </View>
            </LinearGradient>
          </AnimatedTouchable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.lg : theme.spacing.md,
    backgroundColor: 'rgba(15, 12, 41, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  input: {
    flex: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    maxHeight: 100,
    paddingVertical: theme.spacing.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  sendIcon: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderBottomWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: theme.colors.text.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    transform: [{ rotate: '90deg' }],
  },
});

