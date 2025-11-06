import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  Text,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../utils/theme';
import { voiceService } from '../services/VoiceService';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ChatInputProps {
  onSend: (message: string) => void;
  onVoiceTranscript?: (text: string) => void;
  disabled?: boolean;
  openAIKey?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  onVoiceTranscript,
  disabled,
  openAIKey,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const buttonScale = useSharedValue(1);
  const micScale = useSharedValue(1);

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

  const handleStartRecording = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await voiceService.startRecording();
      setIsRecording(true);
      
      // Pulse animation while recording
      micScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } catch (error) {
      console.error('Recording error:', error);
      Alert.alert('Error', 'Could not start recording. Please check microphone permissions.');
    }
  };

  const handleStopRecording = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      micScale.value = withSpring(1);
      setIsRecording(false);
      
      const audioUri = await voiceService.stopRecording();
      
      if (audioUri && openAIKey) {
        // Show loading state
        setMessage('Transcribing...');
        
        try {
          const transcript = await voiceService.transcribeAudio(audioUri, openAIKey);
          setMessage(transcript);
          onVoiceTranscript?.(transcript);
        } catch (error) {
          console.error('Transcription error:', error);
          Alert.alert('Error', 'Could not transcribe audio. Please try again or type your message.');
          setMessage('');
        }
      } else if (!openAIKey) {
        Alert.alert('API Key Required', 'Please add your OpenAI API key in Settings to use voice input.');
      }
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {/* Microphone Button */}
          <AnimatedTouchable
            onPressIn={handleStartRecording}
            onPressOut={handleStopRecording}
            disabled={disabled}
            style={[styles.micButton, micAnimatedStyle]}
          >
            <Text style={[styles.micIcon, isRecording && styles.micIconActive]}>
              {isRecording ? '⏹' : '🎤'}
            </Text>
          </AnimatedTouchable>

          <TextInput
            style={styles.input}
            placeholder={isRecording ? "Listening..." : "Type or hold 🎤 to speak..."}
            placeholderTextColor={theme.colors.text.muted}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={2000}
            editable={!disabled && !isRecording}
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

        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>Recording... Release to transcribe</Text>
          </View>
        )}
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
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  micIcon: {
    fontSize: 24,
  },
  micIconActive: {
    fontSize: 24,
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
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
    marginRight: theme.spacing.sm,
  },
  recordingText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.secondary,
  },
});

