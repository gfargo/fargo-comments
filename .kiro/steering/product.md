# Product Overview

Fargo Comments is an open-source, production-ready React commenting system built for modern web applications. It's designed as a "batteries not included" solution - developers bring their own storage, authentication, and styling preferences.

## Key Features

- **Rich Text Editing**: Powered by Meta's Lexical editor with auto-lists, emoji search, link detection, and @mentions/#tags
- **12+ Design Variants**: Card, bubble, timeline, GitHub, social, professional, mobile, and more
- **Flexible Storage**: Adapter pattern supporting localStorage, Server Actions, TanStack Query, and REST APIs
- **Component Registry**: ShadcnUI-compatible registry for easy installation and updates
- **Event & Hook System**: Extensible architecture for custom integrations and side effects
- **Flat Threading**: Prevents deep nesting while maintaining visual hierarchy

## Target Use Cases

- Document commenting and collaboration
- Code review systems
- Content management platforms
- Audit and compliance tools
- Project discussion threads
- Any application requiring sophisticated commenting functionality

## Architecture Philosophy

- **Adapter Pattern**: Pluggable storage system for different backends
- **Context-Driven**: React Context providers for state management
- **Component Composition**: Modular components that can be mixed and matched
- **Registry-Based Distribution**: Components distributed via ShadcnUI-compatible registry
- **Schema Flexibility**: Integrates with existing User models without table modifications