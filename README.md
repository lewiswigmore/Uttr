

# <img src="./src/logo-text.svg" alt="Logo" height="24"/> Uttr - Modern Note-Taking App

> **Capture thoughts, organize ideas** — A premium note-taking experience built with React and Fluent UI

Uttr has been completely redesigned and refactored into a modern, feature-rich note-taking application that combines beautiful design with powerful functionality. What started as a basic learning project is now a professional-grade productivity tool.

## ✨ New Features & Improvements

### 🎨 **Modern UI/UX Design**
- **Card-based Interface**: Beautiful, responsive cards with hover animations
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Fluent Design System**: Microsoft's latest design language for consistency
- **Responsive Grid Layout**: Adaptive layout that works on all screen sizes
- **Smooth Animations**: Polished interactions with CSS transitions

### 📝 **Enhanced Note Management**
- **Rich Note Structure**: Title, content, tags, and timestamps
- **Pin Important Notes**: Keep crucial notes at the top
- **Tags & Organization**: Color-coded tags for better categorization
- **Advanced Editing**: Expandable forms with full-featured editing
- **Auto-save**: Notes are automatically saved as you type

### 🔍 **Powerful Search & Filtering**
- **Real-time Search**: Instant search across titles, content, and tags
- **Tag Filtering**: Filter notes by multiple tags simultaneously
- **Smart Sorting**: Sort by date, title, or pinned status
- **Empty State Handling**: Beautiful empty states with helpful guidance

### 💾 **Data Persistence & Management**
- **Local Storage**: All notes persist between sessions
- **Backup & Export**: Your data is safe and accessible
- **Performance Optimized**: Efficient rendering with React hooks
- **Error Handling**: Robust error handling throughout the app

### 🎯 **User Experience**
- **Keyboard Navigation**: Full keyboard accessibility support
- **Focus Management**: Intuitive tab order and focus indicators
- **Loading States**: Smooth loading experiences
- **Confirmation Dialogs**: Safe deletion with user confirmation
- **Helpful Tips**: Contextual help and usage tips

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lewiswigmore/Uttr.git
   cd Uttr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## 📱 Usage Guide

### Creating Notes
- **Quick Add**: Simply type a title and click "Quick Add"
- **Full Form**: Click in the title field to expand the full creation form
- **Tags**: Add comma-separated tags for organization
- **Rich Content**: Use the textarea for longer, formatted content

### Managing Notes
- **Edit**: Click on any note to edit it inline
- **Pin**: Use the menu to pin important notes to the top
- **Delete**: Remove notes with confirmation dialog
- **Search**: Use the search bar to find notes instantly

### Organization
- **Tags**: Filter notes by clicking on tag badges
- **Sorting**: Change sort order (date, title, pinned first)
- **Themes**: Toggle dark/light mode in the header

## 🛠️ Available Scripts

```bash
# Development
npm start          # Start development server
npm test           # Run test suite
npm run build      # Build for production

# Code Quality
npm run lint       # Lint JavaScript files
npm run lint:fix   # Fix linting issues automatically
npm run format     # Format code with Prettier

# Utilities
npm run analyze    # Build and analyze bundle size
npm run update-browserslist  # Update browser compatibility
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Note.js         # Individual note component
│   ├── NoteForm.js     # Note creation form
│   ├── SearchAndFilter.js # Search and filtering UI
│   └── EmptyState.js   # Empty state component
├── hooks/              # Custom React hooks
│   └── useLocalStorage.js # Persistent state management
├── utils/              # Utility functions
│   └── noteUtils.js    # Note-related helper functions
├── App.js              # Main application component
├── App.css            # Global styles
└── index.js           # Application entry point
```

## 🎨 Design System

Built with **Microsoft Fluent UI v9**, featuring:
- **Consistent Typography**: Fluent typography scale
- **Color System**: Semantic color tokens for accessibility
- **Component Library**: Pre-built, accessible components
- **Theme Support**: Built-in dark/light theme switching
- **Responsive Design**: Mobile-first, adaptive layouts

## 🔧 Technical Improvements

### Architecture
- **Custom Hooks**: `useLocalStorage` for persistent state
- **Utility Functions**: Modular, reusable helper functions
- **Component Composition**: Clean, composable React components
- **Performance**: Optimized re-rendering with `useMemo` and `useCallback`

### Code Quality
- **ESLint Configuration**: Extended rules for better code quality
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Type Safety**: PropTypes validation and TypeScript-ready structure

## 🌟 What's New in v0.2.0

- ✅ Complete UI/UX redesign with Fluent UI v9
- ✅ Advanced note management (pin, tags, timestamps)
- ✅ Real-time search and filtering system
- ✅ Dark/light theme support with persistence
- ✅ Local storage integration for data persistence
- ✅ Responsive design for all screen sizes
- ✅ Enhanced accessibility and keyboard navigation
- ✅ Professional-grade error handling
- ✅ Modern React patterns and performance optimization

## 🗺️ Future Roadmap

- [ ] **Export/Import**: JSON, Markdown, and PDF export options
- [ ] **Categories**: Folder-like organization beyond tags
- [ ] **Rich Text Editor**: Markdown support and formatting
- [ ] **Collaboration**: Share and collaborate on notes
- [ ] **Sync**: Cloud synchronization across devices
- [ ] **Plugins**: Extensible architecture for custom features
- [ ] **Mobile App**: React Native companion app
- [ ] **Offline Support**: Progressive Web App capabilities

## 🤝 Contributing

This is a learning project, but contributions are welcome! Please feel free to:
- Report bugs or suggest features via GitHub Issues
- Submit pull requests with improvements
- Share feedback and usage experiences

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💝 Acknowledgments

- **Microsoft Fluent UI** for the amazing component library
- **React Team** for the incredible framework
- **Open Source Community** for inspiration and best practices

---

**Built with ❤️ using React, Fluent UI, and modern web technologies**

*Transform your note-taking experience with Uttr - where thoughts become organized, ideas flow freely, and productivity thrives.*
