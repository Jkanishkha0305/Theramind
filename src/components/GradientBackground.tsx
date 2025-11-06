import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../utils/theme';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({ children }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(30, {
        duration: 8000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <AnimatedLinearGradient
      colors={theme.gradients.background}
      style={[styles.gradient, animatedStyle]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </AnimatedLinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

