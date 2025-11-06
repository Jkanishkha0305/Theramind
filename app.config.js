require('dotenv').config();

module.exports = {
  expo: {
    name: "Theramind",
    slug: "theramind",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0f0c29"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.theramind.app",
      infoPlist: {
        UIBackgroundModes: ["fetch"]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0f0c29"
      },
      package: "com.theramind.app",
      permissions: []
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-font",
        {
          fonts: []
        }
      ]
    ],
    scheme: "theramind",
    extra: {
      EXPO_PUBLIC_OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      EXPO_PUBLIC_OPENAI_MODEL: process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-4o-mini'
    }
  }
};

