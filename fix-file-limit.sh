#!/bin/bash

# Fix for macOS "too many open files" error
# This script permanently increases the file descriptor limit

echo "🔧 Fixing macOS file limit issue..."
echo ""

# Detect shell
if [ -n "$ZSH_VERSION" ]; then
   SHELL_CONFIG="$HOME/.zshrc"
   SHELL_NAME="zsh"
elif [ -n "$BASH_VERSION" ]; then
   SHELL_CONFIG="$HOME/.bash_profile"
   SHELL_NAME="bash"
else
   SHELL_CONFIG="$HOME/.profile"
   SHELL_NAME="shell"
fi

echo "Detected shell: $SHELL_NAME"
echo "Config file: $SHELL_CONFIG"
echo ""

# Check if already configured
if grep -q "ulimit -n" "$SHELL_CONFIG" 2>/dev/null; then
    echo "✅ File limit already configured in $SHELL_CONFIG"
else
    echo "📝 Adding ulimit configuration to $SHELL_CONFIG..."
    echo "" >> "$SHELL_CONFIG"
    echo "# Increase file descriptor limit for React Native/Expo" >> "$SHELL_CONFIG"
    echo "ulimit -n 10240" >> "$SHELL_CONFIG"
    echo "✅ Configuration added!"
fi

echo ""
echo "🎯 Applying changes for current session..."
ulimit -n 10240

echo ""
echo "✅ Done! File limit increased to 10240"
echo ""
echo "To apply permanently, run:"
echo "  source $SHELL_CONFIG"
echo ""
echo "Or restart your terminal."
echo ""
echo "You can now run: npm start"

