# Lexical Comment System

A comprehensive rich text editing system built on Facebook's Lexical editor framework, providing advanced commenting functionality with multiple UI variants, auto-formatting, mentions, and flexible data persistence.

## 🚀 Features

### Core Functionality
- **Rich Text Editing**: Full-featured text editor with formatting support
- **Auto-List Creation**: Type `- ` for bullet lists or `1. ` for numbered lists
- **Beautiful Mentions**: @user mentions and #tag references with autocomplete
- **Emoji Search**: Type `:` followed by search terms for instant emoji insertion
- **Multiple List Types**: Ordered, unordered, and checklist support
- **History/Undo**: Built-in undo/redo functionality
- **Error Boundaries**: Robust error handling and recovery

### UI Variants
Support for 14 different visual styles:
- `default` - Standard comment box
- `compact` - Minimal space usage
- `inline` - Single-line editing
- `bubble` - Chat-like rounded design
- `timeline` - Enhanced timeline with gradients
- `social` - Social media style
- `professional` - Business/corporate look
- `clean` - Minimal border design
- `github` - GitHub-style commenting
- `email` - Email client appearance
- `notion` - Notion-inspired design
- `mobile` - Touch-optimized interface
- `thread` - Threaded conversation style
- `card` - Card-based layout

## 📁 Directory Structure

\`\`\`
components/lexical/
├── lexical-comment-composer.tsx    # Main composer component
├── lexical-read-only-renderer.tsx  # Read-only display component
├── mention-component.tsx           # Custom mention rendering
├── emoji-component.tsx             # Custom emoji rendering
├── config/
│   └── lexical-config.ts          # Shared configuration and constants
├── plugins/
│   ├── auto-list-plugin.tsx       # Auto-list creation plugin
│   └── emoji-plugin.tsx           # Emoji search and insertion plugin
└── utils/
    ├── mention-utils.tsx           # Mention-related utilities
    ├── emoji-utils.tsx             # Emoji-related utilities
    └── style-utils.ts              # Variant styling system
\`\`\`

## 🔧 Core Components

### LexicalCommentComposer

The main editing component that provides rich text functionality.

\`\`\`tsx
import { LexicalCommentComposer } from "@/components/lexical/lexical-comment-composer"

<LexicalCommentComposer
  variant="timeline"
  placeholder="Add your comment..."
  onSubmit={(content, editorState, mentions, tags, emojis) => {
    // Handle submission
  }}
  initialContent="Optional initial text"
  initialEditorState="Optional Lexical state JSON"
/>
\`\`\`

**Props:**
- `variant`: UI style variant (default: "default")
- `placeholder`: Placeholder text
- `onSubmit`: Callback with content, editor state, mentions, tags, and emojis
- `initialContent`: Plain text fallback content
- `initialEditorState`: Full Lexical editor state JSON

### LexicalReadOnlyRenderer

Displays saved comments in read-only mode with full formatting.

\`\`\`tsx
import { LexicalReadOnlyRenderer } from "@/components/lexical/lexical-read-only-renderer"

<LexicalReadOnlyRenderer
  content="Plain text fallback"
  editorState="Lexical state JSON"
  variant="card"
/>
\`\`\`

## 🔌 Custom Plugins

### AutoListPlugin

Automatically converts typed patterns into lists:
- Type `- ` → Creates bullet list
- Type `1. ` → Creates numbered list
- Type `2. ` → Creates numbered list starting at 2

**Implementation:**
- Listens for space key presses
- Detects patterns at paragraph start
- Uses Lexical's built-in list commands
- Provides console logging for debugging

### EmojiPlugin

Intelligent emoji search and insertion system:
- Type `:` → Triggers emoji search mode
- Type `:laugh` → Shows laughing emoji suggestions
- Arrow keys to navigate results
- Enter or click to insert selected emoji
- Backspace to cancel and close picker

**Features:**
- **Headless Search**: Uses @emoji-mart/data with SearchIndex for fast, accurate results
- **Smart Positioning**: Dropdown appears near typing cursor in all contexts (main composer, replies, edit mode)
- **Keyboard Navigation**: Full arrow key support with visual selection highlighting
- **Context Aware**: Works seamlessly in paragraphs, lists, and nested content
- **Auto-cleanup**: Removes search trigger text when emoji is selected

### BeautifulMentionsPlugin

Integrated mention system with autocomplete:
- `@username` for user mentions
- `#resource` for tag/resource references
- Custom dropdown menu with icons
- Async data loading support

## 🎨 Styling System

### Variant-Based Styling

The styling system provides consistent theming across all variants:

\`\`\`typescript
// Container styling
getContainerStyles(variant: CommentVariant) → string

// Content area styling  
getContentEditableStyles(variant: CommentVariant) → string

// Placeholder positioning
getPlaceholderPosition(variant: CommentVariant) → string

// Button configuration
getButtonConfig(variant: CommentVariant) → ButtonConfig
\`\`\`

### Theme Configuration

Comprehensive Lexical theme with Tailwind classes:

\`\`\`typescript
const theme = {
  paragraph: "mb-1",
  list: {
    listitem: "mx-2",
    listitemChecked: "mx-2 line-through text-gray-500",
    listitemUnchecked: "mx-2",
    nested: { listitem: "mx-4" },
    olDepth: [
      "list-decimal ml-4 space-y-1",
      "list-decimal ml-8 space-y-1",
      // ... up to 5 levels
    ],
    ul: "list-disc ml-4 space-y-1",
  },
  link: "text-blue-600 hover:text-blue-800 underline",
  beautifulMentions: {
    "@": "mention-user",
    "#": "mention-tag",
  },
  emoji: "emoji-picker",
}
\`\`\`

## ⚙️ Shared Configuration

### Centralized Lexical Config

All shared Lexical configuration is centralized in `config/lexical-config.ts`:

\`\`\`typescript
import { 
  LEXICAL_THEME, 
  LEXICAL_NODES, 
  URL_MATCHERS,
  validateUrl 
} from "@/components/lexical/config/lexical-config"

// Use in both composer and renderer
const initialConfig = {
  theme: LEXICAL_THEME,
  nodes: LEXICAL_NODES,
  // ... other config
}
\`\`\`

**Shared Elements:**
- **Theme Configuration**: Consistent styling for lists, links, mentions, emojis across all components
- **Node Registration**: Standard set of nodes (ListNode, LinkNode, AutoLinkNode, BeautifulMentionNode, EmojiNode, etc.)
- **URL Validation**: Centralized URL/email validation logic and regex patterns
- **Matcher Patterns**: AutoLinkPlugin matchers for URL and email detection

**Benefits:**
- **DRY Principle**: Eliminates code duplication between composer and renderer
- **Consistency**: Ensures identical behavior across all Lexical instances
- **Maintainability**: Single source of truth for configuration changes
- **Type Safety**: Shared TypeScript interfaces and constants

### Configuration Structure

\`\`\`typescript
// Theme with Tailwind classes
export const LEXICAL_THEME = {
  paragraph: "mb-1",
  list: {
    listitem: "mx-2",
    ul: "list-disc ml-4 space-y-1",
    // ... complete theme
  },
  link: "text-blue-600 hover:text-blue-800 underline",
  beautifulMentions: {
    "@": "mention-user",
    "#": "mention-tag",
  },
  emoji: "emoji-picker",
}

// Standard node set
export const LEXICAL_NODES = [
  ListNode,
  ListItemNode, 
  LinkNode,
  AutoLinkNode,
  BeautifulMentionNode,
  EmojiNode,
]

// URL validation and matchers
export const validateUrl = (url: string): boolean => { /* ... */ }
export const URL_MATCHERS = [/* ... */]
\`\`\`

## 💾 Data Persistence

### Dual Storage Strategy

The system saves both formats for maximum compatibility:

1. **Plain Text Content**: Fallback for simple display
2. **Lexical Editor State**: Full rich formatting preservation

\`\`\`typescript
onSubmit={(content, editorState, mentions, tags, emojis) => {
  // content: "Hello @john, check #section-1 :laugh:"
  // editorState: "{\"root\":{\"children\":[...]}}"
  // mentions: [{ type: "user", value: "john" }]
  // tags: [{ type: "resource", value: "section-1" }]
  // emojis: [{ type: "emoji", value: "laugh" }]
}}
\`\`\`

### Editor State Structure

Lexical stores content as a JSON tree:
- Preserves all formatting and structure
- Supports complex nested elements
- Enables perfect reconstruction of editor state
- Allows for rich text search and manipulation

## 🔄 Integration Patterns

### With Comment Variants

All comment variants automatically use the Lexical system:

\`\`\`tsx
// Any variant can use rich text editing
<CommentVariation
  variant="github"
  comment={comment}
  onEdit={(content, editorState) => {
    // Receives both plain text and rich state
  }}
/>
\`\`\`

### With Storage Adapters

Works seamlessly with all storage backends:

\`\`\`typescript
// LocalStorage, API, Server Actions, TanStack Query
await adapter.addLexicalComment(auditItemId, {
  content: plainText,
  editorState: lexicalJSON,
  authorId: userId
})
\`\`\`

## 🛠️ Development

### Adding New Plugins

1. Create plugin in `plugins/` directory
2. Follow Lexical plugin patterns
3. Register in composer's `initialConfig`
4. Add to read-only renderer if needed

\`\`\`tsx
// Example plugin structure
export function CustomPlugin(): null {
  const [editor] = useLexicalComposerContext()
  
  useEffect(() => {
    return editor.registerCommand(
      CUSTOM_COMMAND,
      (payload) => {
        // Plugin logic
        return false
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor])
  
  return null
}
\`\`\`

### Adding New Variants

1. Add variant to `CommentVariant` type
2. Implement styling in `style-utils.ts`
3. Test across all components
4. Update documentation

### Modifying Shared Configuration

1. **Update theme**: Modify `LEXICAL_THEME` in `config/lexical-config.ts`
2. **Add nodes**: Update `LEXICAL_NODES` array for new node types
3. **URL patterns**: Modify `URL_MATCHERS` for custom link detection
4. **Validation**: Update `validateUrl` function for custom URL rules

All changes automatically apply to both composer and renderer components.

### Debugging

The system includes comprehensive logging:
- AutoListPlugin logs pattern detection
- ContentExtractor logs state changes
- Error boundaries catch and report issues
- Use `console.log("[OKAYD] ...")` for debugging

## 📚 Dependencies

- `@lexical/react` - Core Lexical React integration
- `@lexical/list` - List functionality
- `lexical-beautiful-mentions` - Mention system
- `@emoji-mart/data` - Emoji data
- `lucide-react` - Icons
- Custom UI components (Button, etc.)

## 🎯 Best Practices

1. **Use shared configuration** for consistency across components
2. **Always provide fallback content** for compatibility
3. **Use variant prop consistently** across components
4. **Handle async mention loading** gracefully
5. **Preserve editor state** for rich editing experience
6. **Test across all variants** when making changes
7. **Use error boundaries** for robust error handling
8. **Centralize configuration changes** in the config directory

## 🔮 Future Enhancements

- **Collaborative editing** with operational transforms
- **More auto-formatting** patterns (headers, links)
- **Custom node types** for specialized content
- **Advanced mention filtering** and search
- **Plugin marketplace** for extensibility
- **Performance optimizations** for large documents
