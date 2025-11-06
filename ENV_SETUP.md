# 🔑 Quick Setup: Add API Key to .env

## ✅ Simple Method (Recommended for Development):

### Step 1: Edit the `.env` file

Open `.env` in your project root and replace `your-api-key-here` with your actual OpenAI API key:

```bash
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-YOUR-ACTUAL-KEY-HERE
EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini
```

### Step 2: Restart Expo

```bash
npx expo start --clear
```

### Step 3: Reload App

Reload your app on your phone - the API key will be loaded automatically!

---

## 📱 Alternative: Use Settings Screen

If you prefer not to use .env:
1. Just open the app
2. Tap ⚙️ gear icon
3. Paste your API key there

Both methods work! Choose what you prefer. 🎉

---

## 🔒 Security Note:

The `.env` file is already in `.gitignore` so your key won't be committed to git!
