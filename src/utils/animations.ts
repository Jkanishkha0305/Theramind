import { withSpring, withTiming, withRepeat, Easing } from 'react-native-reanimated';

export const animationConfig = {
  // Spring animations for natural motion
  spring: {
    gentle: {
      damping: 20,
      stiffness: 90,
      mass: 1,
    },
    bouncy: {
      damping: 15,
      stiffness: 100,
      mass: 0.8,
    },
    snappy: {
      damping: 18,
      stiffness: 150,
      mass: 0.5,
    },
  },
  // Timing animations for precise control
  timing: {
    fast: {
      duration: 200,
      easing: Easing.out(Easing.ease),
    },
    normal: {
      duration: 300,
      easing: Easing.out(Easing.ease),
    },
    slow: {
      duration: 500,
      easing: Easing.out(Easing.ease),
    },
  },
};

// Reusable animation functions
export const fadeIn = (delay = 0) => {
  return withTiming(1, {
    duration: 300,
    easing: Easing.out(Easing.ease),
  });
};

export const fadeOut = () => {
  return withTiming(0, {
    duration: 200,
    easing: Easing.in(Easing.ease),
  });
};

export const slideInFromBottom = () => {
  return withSpring(0, animationConfig.spring.bouncy);
};

export const scaleIn = () => {
  return withSpring(1, animationConfig.spring.gentle);
};

export const breathingAnimation = () => {
  return withRepeat(
    withTiming(0.3, { duration: 600, easing: Easing.inOut(Easing.ease) }),
    -1,
    true
  );
};

