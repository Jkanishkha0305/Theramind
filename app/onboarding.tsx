import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../src/utils/theme';
import { storageService } from '../src/services/StorageService';
import { GradientBackground } from '../src/components/GradientBackground';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function OnboardingScreen() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Animate in
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 600 });

    // Check if model exists
    checkModelStatus();
  }, []);

  useEffect(() => {
    progressWidth.value = withSpring(downloadProgress * 100);
  }, [downloadProgress]);

  const checkModelStatus = async () => {
    try {
      const isModelAvailable = await storageService.isModelDownloaded();
      
      if (isModelAvailable) {
        // Model already downloaded, go to chat
        setTimeout(() => {
          router.replace('/chat');
        }, 1000);
      } else {
        setIsChecking(false);
      }
    } catch (err) {
      console.error('Error checking model:', err);
      setIsChecking(false);
    }
  };

  const handleDownload = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsDownloading(true);
    setError(null);

    try {
      // TODO: Replace with actual model URL
      // For now, this is a placeholder
      // const modelUrl = 'https://huggingface.co/...gemma-3-1b-Q4_K_M.gguf';
      
      // Simulate download for demo purposes
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setDownloadProgress(i / 100);
      }

      // In production, use:
      // await storageService.downloadModel(
      //   modelUrl,
      //   'gemma-3-1b',
      //   (progress) => setDownloadProgress(progress)
      // );

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Navigate to chat
      setTimeout(() => {
        router.replace('/chat');
      }, 500);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download model. Please check your connection and try again.');
      setIsDownloading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // For demo purposes, allow skipping
    router.replace('/chat');
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  if (isChecking) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
          <Text style={styles.checkingText}>Checking for model...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Theramind</Text>
          <Text style={styles.subtitle}>
            Your personal AI companion that runs entirely on your device
          </Text>

          <View style={styles.features}>
            <Feature icon="🔒" text="Complete privacy - all data stays on your device" />
            <Feature icon="⚡" text="Fast responses with on-device processing" />
            <Feature icon="✈️" text="Works offline - no internet required" />
          </View>

          <View style={styles.modelInfo}>
            <Text style={styles.modelTitle}>Model Required</Text>
            <Text style={styles.modelDescription}>
              Download Gemma 3 1B (~500MB) to get started
            </Text>
          </View>

          {isDownloading ? (
            <View style={styles.downloadContainer}>
              <Text style={styles.downloadText}>
                Downloading... {Math.round(downloadProgress * 100)}%
              </Text>
              <View style={styles.progressBar}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
              </View>
              <Text style={styles.downloadHint}>
                This may take a few minutes depending on your connection
              </Text>
            </View>
          ) : (
            <>
              {error && <Text style={styles.errorText}>{error}</Text>}
              
              <AnimatedTouchable
                onPress={handleDownload}
                disabled={isDownloading}
                style={styles.buttonContainer}
              >
                <LinearGradient
                  colors={theme.gradients.button}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.downloadButton}
                >
                  <Text style={styles.buttonText}>Download Model</Text>
                </LinearGradient>
              </AnimatedTouchable>

              <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                <Text style={styles.skipText}>Skip for now (Demo mode)</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
    </GradientBackground>
  );
}

const Feature = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.feature}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  checkingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  features: {
    marginBottom: theme.spacing.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  featureText: {
    flex: 1,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.bodySmall.fontSize,
    lineHeight: 20,
  },
  modelInfo: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    marginBottom: theme.spacing.xl,
  },
  modelTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: '600',
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
  },
  modelDescription: {
    fontSize: theme.typography.bodySmall.fontSize,
    color: theme.colors.text.secondary,
  },
  downloadContainer: {
    width: '100%',
  },
  downloadText: {
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.sm,
  },
  downloadHint: {
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  downloadButton: {
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  buttonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.body.fontSize,
    fontWeight: '600',
    textAlign: 'center',
  },
  skipButton: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  skipText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.bodySmall.fontSize,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: theme.typography.bodySmall.fontSize,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: theme.borderRadius.sm,
  },
});

