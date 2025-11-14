# Theramind - Your Personal AI Companion

A beautiful, privacy-focused mobile AI chat app that runs entirely on your device.

## Features

✨ **Stunning UI/UX**
- Modern gradient backgrounds with smooth animations
- Glass morphism effects
- 60fps animations powered by React Native Reanimated
- Haptic feedback for better interactions

🔒 **Privacy First**
- On-device AI processing (no cloud required)
- All conversations stored locally
- Works completely offline
- Your data never leaves your phone

🤖 **Powered by Small Language Models**
- Gemma 3 1B or Llama 3.2 1B
- Fast inference (15-30 tokens/sec)
- 4-bit quantization for efficiency
- Runs on modern smartphones (6GB+ RAM)

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **AI Runtime**: llama.cpp (via react-native-llama)
- **Animations**: React Native Reanimated 3
- **State Management**: Zustand
- **Storage**: AsyncStorage

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- iOS: macOS with Xcode 14+
- Android: Android Studio with SDK 26+

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/theramind.git
cd theramind
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Run on your device
```bash
# iOS
npm run ios

# Android
npm run android
```

### Model Setup

The app requires a quantized GGUF model file. You have two options:

#### Option 1: Download on First Launch (Recommended)
- The app will prompt you to download the model on first launch
- Recommended: Gemma 3 1B (~500MB)

#### Option 2: Manual Download
1. Download a GGUF model:
   - [Gemma 3 1B 4-bit GGUF](https://huggingface.co/models?search=gemma-3-1b-gguf)
   - [Llama 3.2 1B 4-bit GGUF](https://huggingface.co/models?search=llama-3.2-1b-gguf)

2. Place the model in `assets/models/` (create directory if needed)

3. Update the model path in `src/services/LLMService.ts`

## Project Structure

```
/
├── app/                    # Expo Router screens
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Splash screen
│   └── chat.tsx           # Main chat screen
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── GradientBackground.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── TypingIndicator.tsx
│   │   └── ChatInput.tsx
│   ├── services/          # Business logic
│   │   ├── LLMService.ts
│   │   └── StorageService.ts
│   ├── store/             # State management
│   │   └── chatStore.ts
│   ├── utils/             # Utilities
│   │   ├── theme.ts
│   │   └── animations.ts
│   └── types/             # TypeScript types
│       └── index.ts
└── assets/                # Static assets
```

## Development Status

### Completed ✅
- [x] Project setup and configuration
- [x] Beautiful gradient UI with animations
- [x] Message bubbles with glass morphism
- [x] Typing indicator
- [x] Custom chat input
- [x] State management with Zustand
- [x] Local storage for chat history
- [x] Navigation structure

### In Progress 🚧
- [ ] LLM integration (react-native-llama)
- [ ] Model download UI
- [ ] Streaming token display
- [ ] Performance optimization

### Planned 📋
- [ ] Multiple conversation threads
- [ ] Settings screen
- [ ] Model parameter customization
- [ ] Export/import conversations
- [ ] Voice input (future)

## Performance

- Target: 60fps animations
- Inference speed: 15-30 tokens/sec (device dependent)
- Memory usage: ~1-2GB (including model)
- Supported devices: iPhone 12+ / Android with 6GB+ RAM

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [llama.cpp](https://github.com/ggerganov/llama.cpp) for the amazing inference engine
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for smooth animations
- All the open-source LLM model creators

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for privacy-conscious AI enthusiasts
