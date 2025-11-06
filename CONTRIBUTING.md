# Contributing to Theramind 🤝

First off, thank you for considering contributing to Theramind! It's people like you that make Theramind such a great tool for mental wellness.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

---

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our commitment to:
- Be respectful and inclusive
- Be patient and welcoming
- Focus on what's best for the community
- Show empathy towards others

---

## 💡 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:
- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Device/OS information**
- **App version**

### Suggesting Features ✨

Feature suggestions are welcome! Please provide:
- **Clear use case**
- **Expected behavior**
- **Why this would be useful**
- **Potential implementation ideas**

### Code Contributions 💻

1. **Fork & Clone**
```bash
git clone https://github.com/YOUR_USERNAME/Theramind.git
cd Theramind
```

2. **Create a Branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

3. **Make Changes**
- Write clean, maintainable code
- Follow the coding guidelines below
- Test your changes thoroughly

4. **Commit**
```bash
git add .
git commit -m "feat: add amazing feature"
```

5. **Push & Create PR**
```bash
git push origin feature/your-feature-name
```

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 20.19.0+
- npm or yarn
- Expo Go app on mobile device
- OpenAI API key (for testing)

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Create `.env` file**
```env
EXPO_PUBLIC_OPENAI_API_KEY=your-test-api-key
EXPO_PUBLIC_OPENAI_MODEL=gpt-4o-mini
```

3. **Start development server**
```bash
npm start
```

4. **Run on device**
- Scan QR code with Expo Go
- Or use iOS/Android simulator

---

## 📝 Coding Guidelines

### TypeScript
- Use TypeScript for all new files
- Define proper types/interfaces
- Avoid `any` type when possible
- Use meaningful variable names

```typescript
// ✅ Good
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

// ❌ Bad
const data: any = { ... };
```

### React/React Native
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript for props

```typescript
// ✅ Good
interface MessageBubbleProps {
  message: string;
  role: 'user' | 'assistant';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, role }) => {
  // component logic
};
```

### Styling
- Use StyleSheet.create for styles
- Follow the existing theme structure
- Use theme tokens from `src/utils/theme.ts`
- Keep styles consistent with existing UI

```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
});
```

### File Structure
- Place components in `src/components/`
- Place services in `src/services/`
- Place utilities in `src/utils/`
- Place types in `src/types/`
- Follow existing naming conventions

---

## 📦 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(chat): add voice input support
fix(ai): resolve streaming token issue
docs(readme): update installation instructions
style(ui): improve message bubble styling
refactor(store): simplify state management
perf(animations): optimize gradient performance
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Test thoroughly**
   - Test on both iOS and Android (if possible)
   - Verify no console errors
   - Check for TypeScript errors: `npm run type-check`

2. **Update documentation**
   - Update README if needed
   - Add JSDoc comments for new functions
   - Update CHANGELOG (if exists)

3. **Clean commit history**
   - Squash trivial commits
   - Write clear commit messages

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where necessary
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested on iOS/Android
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be acknowledged!

---

## 🎨 Design Contributions

### UI/UX Improvements
- Follow existing design system
- Maintain 60fps animations
- Ensure accessibility
- Test on different screen sizes

### Assets
- Use SVG when possible
- Optimize images
- Follow naming conventions
- Place in appropriate `assets/` subdirectory

---

## 🧪 Testing Guidelines

### Manual Testing Checklist
- [ ] App launches successfully
- [ ] Chat functionality works
- [ ] Voice input/output works
- [ ] Settings persist
- [ ] No console errors
- [ ] Smooth animations
- [ ] Works offline (for non-AI features)

### Future: Automated Tests
We're working on adding:
- Unit tests (Jest)
- Component tests (React Native Testing Library)
- E2E tests (Detox)

Contributions to testing infrastructure are highly welcome!

---

## 📚 Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand Guide](https://github.com/pmndrs/zustand)

---

## ❓ Questions?

- Open a [GitHub Discussion](https://github.com/Jkanishkha0305/Theramind/discussions)
- Check existing [Issues](https://github.com/Jkanishkha0305/Theramind/issues)
- Read the [Documentation](README.md)

---

## 🎉 Thank You!

Your contributions make Theramind better for everyone. We appreciate your time and effort!

---

<div align="center">

**Happy Coding! 💻✨**

</div>

