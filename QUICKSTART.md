# Quick Start Guide

Get Theramind running in **5 minutes** (development mode with simulated AI responses).

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- For iOS: macOS with Xcode
- For Android: Android Studio

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Start the Development Server

```bash
npm start
```

This will open Expo Dev Tools in your browser.

## Step 3: Run on Device/Emulator

### iOS (macOS only)
```bash
# Press 'i' in the terminal, or run:
npm run ios
```

### Android
```bash
# Press 'a' in the terminal, or run:
npm run android
```

### Physical Device (Recommended for testing performance)
1. Install **Expo Go** app from App Store/Play Store
2. Scan the QR code shown in the terminal
3. The app will open in Expo Go

## What You'll See

The app will run in **demo mode** with simulated AI responses. The UI is fully functional:

✅ Beautiful gradient animations
✅ Smooth message bubbles
✅ Typing indicators  
✅ Chat history saving
✅ Haptic feedback

⚠️ **Note:** AI responses are currently simulated. See below to integrate the real LLM.

## Demo Mode vs Production

### Demo Mode (Current)
- ✅ Works immediately
- ✅ All UI features functional
- ✅ No model download needed
- ⚠️ Uses placeholder AI responses

### Production Mode (After LLM Integration)
- Requires downloading ~500MB model
- Real on-device AI inference
- Actual intelligent responses
- Needs physical device for testing

## Next Steps

### Option A: Test the UI (Recommended First)
Just run the app and explore the beautiful interface!

### Option B: Integrate Real LLM
Follow the detailed instructions in [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md)

Key steps:
1. Install `@jhen/react-native-llama` or similar library
2. Download Gemma 3 1B model (GGUF format)
3. Update `LLMService.ts` with real implementation
4. Test on physical device

## Testing the UI

### What to Try:
1. **Send messages** - Type and send messages to see animations
2. **New chat** - Tap "+ New" to start a new conversation
3. **Scroll** - Smooth scrolling with gradient background
4. **Haptics** - Feel the feedback on interactions (physical device only)

### Customization:
- Colors/gradients: Edit `src/utils/theme.ts`
- Animations: Adjust `src/utils/animations.ts`
- UI components: Modify files in `src/components/`

## Project Structure

```
Theramind/
├── app/                    # Screens (Expo Router)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Splash screen
│   ├── chat.tsx           # Main chat screen
│   └── onboarding.tsx     # Model download screen
├── src/
│   ├── components/        # UI components
│   ├── services/          # Business logic
│   ├── store/             # State management (Zustand)
│   ├── utils/             # Theme, animations
│   └── types/             # TypeScript types
└── package.json
```

## Troubleshooting

### "Module not found" errors
```bash
npm install
# Clear cache if needed
npx expo start --clear
```

### App won't start on iOS
```bash
cd ios
pod install
cd ..
npm run ios
```

### Animations laggy
- Use a physical device (emulators are slower)
- Check if development mode warnings are affecting performance

### Can't connect to Expo
- Ensure phone and computer are on the same WiFi
- Try tunnel mode: `npm start -- --tunnel`

## Common Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
```

## Performance Tips

1. **Physical Device:** Always test performance on real devices
2. **Release Build:** Test with production builds for accurate performance
3. **Memory:** Monitor memory usage in development tools
4. **60fps:** All animations should maintain 60fps

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Integration Guide](./INTEGRATION_GUIDE.md) - How to add real LLM

## Need Help?

1. Check `INTEGRATION_GUIDE.md` for LLM setup
2. See `README.md` for detailed project info
3. Open an issue on GitHub

---

**Ready to integrate the real AI?** → See [`INTEGRATION_GUIDE.md`](./INTEGRATION_GUIDE.md)

**Just want to explore the UI?** → You're all set! Enjoy! 🎉

