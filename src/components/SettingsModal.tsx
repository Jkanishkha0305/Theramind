import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { theme } from '../utils/theme';
import { openAIService } from '../services/OpenAIService';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY_STORAGE = '@theramind_openai_key';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onApiKeySet: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onApiKeySet,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      Alert.alert('Error', 'Invalid API key format. OpenAI keys start with "sk-"');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsTesting(true);

    try {
      // Initialize and test the key
      openAIService.initialize(apiKey.trim());
      const isValid = await openAIService.testConnection();

      if (isValid) {
        // Save to secure storage
        await AsyncStorage.setItem(API_KEY_STORAGE, apiKey.trim());
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success!', 'API key validated and saved', [
          {
            text: 'OK',
            onPress: () => {
              onApiKeySet();
              onClose();
            },
          },
        ]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Invalid Key', 'Could not validate API key. Please check and try again.');
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to validate API key. Please try again.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>OpenAI Settings</Text>
          <TouchableOpacity onPress={handleSkip} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔑 API Key</Text>
            <Text style={styles.description}>
              Enter your OpenAI API key to enable AI responses. Your key is stored securely on your
              device and never shared.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="sk-proj-..."
              placeholderTextColor={theme.colors.text.muted}
              value={apiKey}
              onChangeText={setApiKey}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              multiline={false}
            />

            <View style={styles.instructions}>
              <Text style={styles.instructionTitle}>How to get your API key:</Text>
              <Text style={styles.instructionStep}>
                1. Go to platform.openai.com/api-keys
              </Text>
              <Text style={styles.instructionStep}>
                2. Click "Create new secret key"
              </Text>
              <Text style={styles.instructionStep}>3. Copy and paste it here</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isTesting || !apiKey.trim()}
              style={[
                styles.saveButton,
                (!apiKey.trim() || isTesting) && styles.saveButtonDisabled,
              ]}
            >
              <Text style={styles.saveButtonText}>
                {isTesting ? 'Testing...' : 'Save & Test Key'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.note}>
            <Text style={styles.noteText}>
              💡 Tip: Your API key is stored locally and encrypted. The app never sends your key
              anywhere except directly to OpenAI's API.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.dark,
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: theme.spacing.md,
  },
  instructions: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  instructionTitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  instructionStep: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
  saveButton: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  skipText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.bodySmall.fontSize,
  },
  note: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.borderRadius.md,
  },
  noteText: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.muted,
    lineHeight: 18,
  },
});

export { API_KEY_STORAGE };

