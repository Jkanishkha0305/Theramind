# Development Notes

## What's Been Built

### ✅ Complete
1. **Project Structure**
   - Expo + React Native setup
   - TypeScript configuration
   - Folder structure organized

2. **Beautiful UI/UX**
   - Animated gradient backgrounds
   - Glass morphism message bubbles
   - Smooth 60fps animations (Reanimated 3)
   - Custom chat input with haptic feedback
   - Typing indicator with breathing animation
   - Modern color scheme with purple/blue gradients

3. **State Management**
   - Zustand store for conversations
   - Chat history persistence (AsyncStorage)
   - Message streaming support (ready for LLM)

4. **Services Architecture**
   - LLMService (placeholder, ready for integration)
   - StorageService (model download, file management)
   - Clean separation of concerns

5. **Screens**
   - Splash screen with animation
   - Main chat screen with full functionality
   - Onboarding/model download screen
   - Navigation setup (Expo Router)

### 🚧 Needs Integration (User Action Required)

1. **LLM Integration**
   - Install native module: `@jhen/react-native-llama` or `llama.rn`
   - Download model file (Gemma 3 1B or Llama 3.2 1B)
   - Update LLMService with real implementation
   - Test on physical device

2. **Native Module Setup**
   ```bash
   # For iOS
   cd ios && pod install
   
   # For Android - update build.gradle if needed
   ```

3. **Model Download**
   - Update `app/onboarding.tsx` with real model URL
   - Test download on actual device
   - Handle storage permissions (Android)

4. **Performance Optimization**
   - Profile on physical devices
   - Adjust inference parameters
   - Memory management for model lifecycle

## Architecture Decisions

### Why Expo?
- Faster development iteration
- Easy access to native APIs (FileSystem, Haptics)
- Can eject to bare React Native if needed
- Good for MVP and testing

### Why Zustand?
- Lightweight (1KB)
- Simple API
- TypeScript-friendly
- Perfect for this app's state needs

### Why llama.cpp?
- Best performance for on-device LLMs
- Supports GGUF quantized models
- Active community
- Proven on mobile

### Why GGUF 4-bit?
- Balance of size and quality
- ~500MB for 1B models
- Runs on devices with 6GB+ RAM
- Fast inference (15-30 tokens/sec)

## Design Choices

### Color Palette
- Primary: Purple/Blue gradient (#667eea → #764ba2)
- Accent: Purple-400 (#a78bfa)
- Dark theme as default (better for OLED, less eye strain)
- Glass morphism for AI bubbles (modern, clean)

### Animations
- Spring physics for natural motion
- Timing for precise transitions
- All animations respect 60fps target
- Haptic feedback for key interactions

### UX Decisions
- No login required (privacy-first)
- Local-only by design
- Simple, focused interface
- Minimal settings (keep it simple)

## File Sizes & Performance

### Expected Sizes
- App bundle (without model): ~50MB
- With bundled model: ~550MB
- Recommended: Download model on first launch

### Performance Targets
- App launch: <2 seconds
- Model load: 3-5 seconds
- Inference: 15-30 tokens/sec (device dependent)
- Memory: <2GB total (including model)
- Animations: 60fps maintained

## Testing Recommendations

### Devices to Test On
**iOS:**
- iPhone 12 (minimum spec)
- iPhone 13/14 (target)
- iPhone 15 Pro (best case)

**Android:**
- Device with 6GB RAM minimum
- Snapdragon 8 series or equivalent
- Test thermal throttling

### What to Test
1. **Model Loading**
   - Time to load
   - Memory usage
   - Error handling

2. **Inference**
   - Tokens per second
   - Response quality
   - Battery impact

3. **UI Performance**
   - Frame rate during scrolling
   - Animation smoothness
   - Input responsiveness

4. **Memory**
   - Peak usage
   - Memory leaks
   - Background behavior

## Known Limitations

### Current
1. No actual LLM integration (placeholder responses)
2. No conversation search
3. No export/import conversations
4. No voice input/output
5. Single model support only

### By Design
1. No cloud sync (privacy-first)
2. No user accounts
3. No analytics/tracking
4. Local-only storage

## Future Enhancements (Post-MVP)

### Phase 2 Possibilities
- Multiple conversation threads UI
- Model parameter settings
- Export conversations
- Dark/light theme toggle
- Custom system prompts

### Phase 3 Ideas
- Voice input (Whisper on-device?)
- RAG with local vector DB
- Multiple model support
- Model switching
- Conversation search

### Phase 4 (If Requested)
- Optional cloud sync (Firebase)
- User accounts
- Cross-device support
- Shared conversations

## Development Tips

### Fast Iteration
```bash
# Use Expo Go for quick testing
npm start

# For native module testing, use development builds
npx expo run:ios
npx expo run:android
```

### Debugging
- Use Flipper for React Native debugging
- Xcode Instruments for iOS profiling
- Android Studio Profiler for Android
- React DevTools for component inspection

### Hot Reload Issues
- Clear cache: `npx expo start --clear`
- Reset Metro bundler
- Restart Expo Go app

## Resources & References

### Documentation
- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [llama.cpp](https://github.com/ggerganov/llama.cpp)

### Models
- [Hugging Face GGUF Models](https://huggingface.co/models?library=gguf)
- [Gemma Models](https://huggingface.co/google/gemma-3-1b)
- [Llama 3.2](https://huggingface.co/meta-llama/Llama-3.2-1B)

### Inspiration
- ChatGPT mobile UI
- Claude mobile app
- Telegram's smooth animations
- iOS native polish

## Questions & Decisions Log

### Q: Why not use larger models?
A: 1B models are the sweet spot for mobile - good quality, reasonable size, fast inference on modern phones.

### Q: Why not bundle the model?
A: Too large for app stores (500MB+). Download on first launch is better UX.

### Q: Why TypeScript?
A: Type safety is crucial for LLM integration, state management, and maintainability.

### Q: Why not Transformers.js?
A: llama.cpp has better mobile performance and is specifically optimized for on-device inference.

## Next Steps for Developer

1. **Test the UI** (5 minutes)
   ```bash
   npm install
   npm start
   ```
   Scan QR with Expo Go

2. **Integrate LLM** (2-3 hours first time)
   - Follow INTEGRATION_GUIDE.md
   - Start with smallest model (Llama 3.2 1B)
   - Test on physical device

3. **Polish & Optimize** (ongoing)
   - Profile on target devices
   - Adjust animations if needed
   - Tune inference parameters

4. **Deploy**
   - Build standalone apps
   - Test on TestFlight/Play Console
   - Gather user feedback

---

**Current Status:** MVP UI complete, ready for LLM integration
**Estimated Time to Production:** 1-2 days with LLM integration
**Estimated Time to Polish:** 1 week total

Good luck! 🚀

