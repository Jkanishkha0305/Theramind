# Troubleshooting Guide

## Common Issues and Solutions

### ❌ "EMFILE: too many open files" Error

**Problem:** Metro bundler can't watch all files (macOS limit)

**Quick Fix (Temporary):**
```bash
ulimit -n 10240
npm start
```

**Permanent Fix:**

1. **Create/edit your shell profile:**
   ```bash
   # For zsh (default on modern macOS)
   echo "ulimit -n 10240" >> ~/.zshrc
   
   # For bash
   echo "ulimit -n 10240" >> ~/.bash_profile
   ```

2. **Apply the changes:**
   ```bash
   source ~/.zshrc  # or source ~/.bash_profile
   ```

3. **Restart your terminal**

**Alternative Solution:**
```bash
# Install watchman (Facebook's file watcher)
brew install watchman
```

---

### ❌ "Cannot find module" Errors

**Solution:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

---

### ❌ Metro Bundler Issues

**Solution:**
```bash
# Clear all caches
npx expo start --clear

# If that doesn't work
rm -rf node_modules
rm -rf .expo
npm install
npx expo start --clear
```

---

### ❌ iOS Build Fails

**Solution:**
```bash
cd ios
pod install
cd ..
npm run ios
```

---

### ❌ Android Build Fails

**Solutions:**

1. **Check Android SDK:**
   - Open Android Studio
   - Tools → SDK Manager
   - Install Android 13 (API 33)

2. **Clean build:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

---

### ❌ Expo Go Won't Connect

**Solutions:**

1. **Same WiFi:** Ensure phone and computer are on same network

2. **Try Tunnel Mode:**
   ```bash
   npx expo start --tunnel
   ```

3. **Manual Entry:**
   - Note the exp:// URL from terminal
   - Type it manually in Expo Go

---

### ❌ Animations are Laggy

**Solutions:**

1. **Use Physical Device:** Simulators are slower
2. **Development Mode:** Toggle to production mode for testing
3. **Close Other Apps:** Free up device resources
4. **Check Reanimated:**
   ```bash
   # Ensure Reanimated plugin is in babel.config.js
   ```

---

### ❌ TypeScript Errors

**Solution:**
```bash
npm run type-check
```

If errors persist, check the file mentioned and compare with the working code.

---

### ❌ App Crashes on Launch

**Solutions:**

1. **Clear App Data:**
   - iOS: Delete app and reinstall
   - Android: Settings → Apps → Theramind → Clear Data

2. **Check Logs:**
   ```bash
   npx expo start
   # Press 'j' to open debugger
   ```

3. **Verify Dependencies:**
   ```bash
   npm install
   ```

---

### ❌ Model Won't Download

**Solutions:**

1. **Check Storage Space:**
   - Need 1GB+ free
   - Settings → Storage

2. **Check Internet:**
   - Stable WiFi required
   - Large file (~500MB)

3. **Manual Download:**
   - Download model separately
   - Place in appropriate directory

---

### ❌ Inference is Slow

**Solutions:**

1. **Device Check:**
   - Need 6GB+ RAM
   - Modern processor required

2. **Model Size:**
   - Try smaller model (Gemma 3 1B instead of Phi-3)
   - Check quantization (Q4 recommended)

3. **Configuration:**
   - Reduce max_tokens
   - Adjust n_threads
   - Lower temperature

---

### ❌ Memory Warnings

**Solutions:**

1. **Unload Model:** When app goes to background

2. **Reduce Context:**
   ```typescript
   n_ctx: 1024  // instead of 2048
   ```

3. **Clear Old Conversations:**
   - Delete unused chats
   - Implement conversation limit

---

## Still Having Issues?

### 1. Check Documentation
- `README.md` - Project overview
- `INTEGRATION_GUIDE.md` - LLM setup
- `PROJECT_SUMMARY.md` - Architecture

### 2. Verify Setup
```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check Expo CLI
npx expo --version
```

### 3. Clean Install
```bash
# Nuclear option - start fresh
rm -rf node_modules
rm -rf .expo
rm package-lock.json
npm install
npx expo start --clear
```

### 4. Platform-Specific

**macOS Issues:**
```bash
# Update Xcode
xcode-select --install

# Check CocoaPods
pod --version
sudo gem install cocoapods
```

**Android Issues:**
```bash
# Check ANDROID_HOME
echo $ANDROID_HOME

# Should point to Android SDK location
```

---

## Performance Optimization

### Monitor Performance
```bash
# iOS
Instruments → Time Profiler

# Android  
Android Studio → Profiler
```

### Improve FPS
1. Use production builds for testing
2. Minimize re-renders
3. Use `React.memo()` for expensive components
4. Profile with React DevTools

### Reduce Memory
1. Unload model when not needed
2. Clear message history periodically
3. Optimize images/assets
4. Use pagination for long chats

---

## Debug Mode

### Enable Debugging
```bash
# Start with debugger
npx expo start
# Press 'j' to open Chrome DevTools
```

### React DevTools
```bash
npm install -g react-devtools
react-devtools
```

### Network Debugging
```bash
# In app, shake device
# Toggle "Debug Remote JS"
```

---

## Getting Help

1. **Check Logs:**
   - Metro bundler output
   - Device console logs
   - Xcode/Android Studio logs

2. **Search Issues:**
   - Expo Documentation
   - React Native GitHub Issues
   - Stack Overflow

3. **Provide Details:**
   - Device model and OS
   - Error message (full)
   - Steps to reproduce
   - What you've tried

---

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Too many files | `ulimit -n 10240` |
| Module errors | `npm install` |
| Cache issues | `npx expo start --clear` |
| Build fails | Clean and rebuild |
| Won't connect | Try tunnel mode |
| Slow animations | Use physical device |
| Crashes | Clear app data |

---

*Most issues can be solved by clearing caches and reinstalling dependencies!*

