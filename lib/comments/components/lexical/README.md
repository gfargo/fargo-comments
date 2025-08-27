# Lexical Comment System

This document provides a comprehensive overview of the rich text editing system built on Meta's Lexical framework. It covers the core components, custom plugins, configuration, and styling architecture.

## 🚀 Features

### Core Functionality
- **Rich Text Editing**: A full-featured editor supporting various text styles.
- **@Mentions & #Tags**: A robust mention system with autocomplete, powered by `lexical-beautiful-mentions`.
- **Auto-Formatting**:
  - **Lists**: Automatically creates bulleted or numbered lists when you type `- ` or `1. `.
  - **Links**: Automatically detects and converts URLs and email addresses into clickable links.
- **Emoji Picker**: An inline emoji search and insertion tool triggered by typing `:`.
- **Keyboard Shortcuts**:
  - `Cmd/Ctrl + Enter` to submit a comment.
  - `Tab` to move focus from the editor to the submit button.

## 📁 Directory Structure

```plaintext
lexical/
├── lexical-comment-composer.tsx    # The main rich text editor component.
├── lexical-read-only-renderer.tsx  # Renders saved Lexical state for display.
├── mention-component.tsx           # The custom React component for rendering @ and # mentions.
├── config/
│   └── lexical-config.ts           # Centralized configuration for nodes, themes, and matchers.
├── plugins/
│   ├── auto-list-plugin.tsx        # Handles automatic list creation.
│   ├── emoji-plugin.tsx            # Manages the emoji picker functionality.
│   ├── focus-management-plugin.tsx # Handles keyboard focus behavior (e.g., Tab key).
│   └── keyboard-shortcut-plugin.tsx# Manages submit shortcuts.
└── utils/
    ├── mention-utils.tsx           # Helper functions for styling and linking mentions.
    └── style-utils.ts              # Functions that provide variant-specific styles for the composer.
```

## 🔧 Core Components

### `LexicalCommentComposer`
The main editor component. It integrates all plugins and configurations to provide a seamless rich text editing experience.

**Props:**
- `variant`: The visual style variant (e.g., "card", "compact"), which dictates the editor's appearance via `style-utils.ts`.
- `placeholder`: The placeholder text for the editor.
- `onSubmit`: A callback function that fires on submission, providing the plain text content, the Lexical editor state (as a JSON string), and any extracted mentions or tags.
- `initialContent` / `initialEditorState`: Used to populate the editor for editing existing comments.

### `LexicalReadOnlyRenderer`
This component is used to display saved comments. It takes a Lexical editor state string and renders it as non-editable, fully-styled content, ensuring that all rich text formatting is preserved.

## 🔌 Custom Plugins

Our editor is enhanced with several custom plugins:

- **`AutoListPlugin`**: Detects markdown-like shortcuts (`- ` or `1. `) to automatically start lists.
- **`EmojiPlugin`**: Provides a fast, inline emoji search menu that appears when a user types `:`. It handles positioning, keyboard navigation, and insertion.
- **`FocusManagementPlugin`**: Improves accessibility by allowing users to `Tab` from the text area to the submit button.
- **`KeyboardShortcutPlugin`**: Listens for `Cmd/Ctrl + Enter` to provide a convenient way to submit comments.

## ⚙️ Shared Configuration (`config/lexical-config.ts`)

To ensure consistency between the composer and the read-only renderer, all core Lexical configurations are centralized in this file. This includes:

- **Nodes**: The set of Lexical nodes used in the editor (e.g., `LinkNode`, `ListNode`, `BeautifulMentionNode`).
- **Themes**: Separate theme objects (`lexicalTheme` and `lexicalReadOnlyTheme`) that apply Tailwind CSS classes to the editor content for both editing and display.
- **Matchers**: The regex patterns used by the `AutoLinkPlugin` to detect URLs and email addresses.

## 🎨 Styling System (`utils/style-utils.ts`)

The visual appearance of the `LexicalCommentComposer` is highly dynamic and controlled by the `variant` prop. The functions in this utility file return the appropriate Tailwind CSS class strings based on the selected variant. This allows the composer to adapt its container, text area, and placeholder styles to match the look and feel of the comment component it's rendered in.
