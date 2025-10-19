# Contributing to Polyseal

Thank you for your interest in contributing to Polyseal! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- 🧪 Write tests
- 🎨 Improve UI/UX

## 📋 Before You Start

1. Check existing [issues](https://github.com/yourusername/polyseal/issues) to avoid duplicates
2. For major changes, open an issue first to discuss your ideas
3. Follow our code style and conventions

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/polyseal.git
cd polyseal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
cp .env.example .env
# Add your environment variables
```

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

## 💻 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing code formatting (Prettier + ESLint)
- Write meaningful commit messages
- Add comments for complex logic

### Component Guidelines

- Create small, focused components
- Use semantic HTML
- Leverage the design system (Tailwind + shadcn/ui)
- Ensure responsive design
- Add proper TypeScript types

### Naming Conventions

- **Components**: PascalCase (`MyComponent.tsx`)
- **Functions**: camelCase (`myFunction`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Files**: kebab-case for utilities (`my-util.ts`)

### Design System

Always use semantic tokens from the design system:

```tsx
// ❌ Don't use direct colors
<div className="bg-purple-600 text-white">

// ✅ Use design system tokens
<div className="bg-primary text-primary-foreground">
```

## 🧪 Testing

Before submitting:

1. Test in multiple browsers (Chrome, Firefox, Safari)
2. Test wallet connections (MetaMask, Rainbow, Coinbase Wallet)
3. Test on mobile devices
4. Ensure no console errors
5. Check accessibility

## 📝 Pull Request Process

### 1. Commit Your Changes

```bash
git add .
git commit -m "feat: add amazing feature"
```

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 3. Open a Pull Request

- Provide a clear title and description
- Reference any related issues
- Include screenshots for UI changes
- Ensure CI checks pass

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if needed)
- [ ] No new warnings or errors
- [ ] Tested on multiple browsers
- [ ] Mobile responsive
- [ ] Wallet integration works

## 🐛 Bug Reports

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: How to trigger the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, wallet used
6. **Screenshots**: If applicable

## 💡 Feature Requests

For feature requests, include:

1. **Use Case**: Why is this feature needed?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other solutions considered
4. **Additional Context**: Any other relevant information

## 📚 Documentation

Documentation improvements are always welcome:

- Fix typos or unclear explanations
- Add examples and use cases
- Improve API documentation
- Create tutorials

## 🔒 Security

If you discover a security vulnerability:

1. **DO NOT** open a public issue
2. Email us at security@polyseal.dev
3. Wait for our response before disclosure

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 🎉 Recognition

Contributors will be:
- Listed in our README
- Credited in release notes
- Invited to our contributor Discord

## 📞 Questions?

- Open a [discussion](https://github.com/yourusername/polyseal/discussions)
- Join our [Discord](#)
- Email us at hello@polyseal.dev

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Polyseal! 🚀
