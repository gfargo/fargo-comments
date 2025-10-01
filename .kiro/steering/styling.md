# Styling & Theme Guidelines

## Color System

### Theme Architecture
Fargo Flags uses a dual-theme system that automatically adapts to user preferences:

- **Light Mode**: Purple theme using `rgb(81, 18, 129)` as primary
- **Dark Mode**: Golden theme using `rgb(255, 211, 113)` as primary
- **Auto-switching**: Respects system `prefers-color-scheme` preference

### CSS Variables Structure
All colors are defined using RGB values in CSS custom properties:

```css
:root {
  /* Light mode - Purple theme */
  --primary: 81 18 129;
  --primary-foreground: 255 255 255;
  --background: 255 255 255;
  --foreground: 81 18 129;
  /* ... other semantic tokens */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode - Golden theme */
    --primary: 255 211 113;
    --primary-foreground: 15 23 42;
    --background: 15 23 42;
    --foreground: 255 211 113;
    /* ... other semantic tokens */
  }
}
```

### Semantic Color Tokens

#### Primary Colors
- `primary` - Main brand color (purple in light, golden in dark)
- `primary-foreground` - Text color on primary backgrounds
- `primary/10`, `primary/20`, `primary/80` - Opacity variants

#### Background & Surface
- `background` - Main page background
- `card` - Card/panel backgrounds
- `muted` - Subtle background areas
- `popover` - Overlay backgrounds

#### Text Colors
- `foreground` - Primary text color
- `muted-foreground` - Secondary text color
- `card-foreground` - Text on card backgrounds

#### Interactive Elements
- `border` - Default border color
- `input` - Form input borders
- `ring` - Focus ring color
- `accent` - Subtle interactive highlights

## Usage Guidelines

### ✅ Preferred Patterns

#### Use Semantic Tokens
```tsx
// ✅ Good - uses semantic tokens
<div className="bg-primary text-primary-foreground">
<div className="bg-card border border-border">
<span className="text-muted-foreground">
```

#### Opacity Variants for Subtle Effects
```tsx
// ✅ Good - uses opacity for subtle backgrounds
<div className="bg-primary/10 border border-primary/20">
<div className="hover:bg-primary/5">
```

#### Consistent Interactive States
```tsx
// ✅ Good - consistent hover/active states
<button className="bg-primary hover:bg-primary/90 text-primary-foreground">
<button className="border border-primary/20 hover:bg-primary/5">
```

### ❌ Avoid These Patterns

#### Hardcoded Color Values
```tsx
// ❌ Bad - hardcoded colors
<div className="bg-blue-500 text-white">
<div className="bg-gray-100 border-gray-200">
<span className="text-green-800">
```

#### Non-semantic Color Names
```tsx
// ❌ Bad - specific color names
<div className="bg-purple-600">
<div className="text-yellow-500">
```

#### Inconsistent Opacity Levels
```tsx
// ❌ Bad - random opacity values
<div className="bg-primary/15 border border-primary/35">
```

## Component Styling Patterns

### Hero Sections
```tsx
<div className="relative">
  {/* Background gradient */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl blur-3xl" />
  
  <h1 className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
    Title
  </h1>
</div>
```

### Cards & Panels
```tsx
<section className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm">
  <h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
    Section Title
  </h2>
</section>
```

### Interactive Controls
```tsx
<button className={`px-4 py-2 rounded transition-colors ${
  isActive 
    ? 'bg-primary text-primary-foreground' 
    : 'bg-primary/20 text-primary hover:bg-primary/30'
}`}>
  Button
</button>
```

### Status Indicators
```tsx
<span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
  Status
</span>
```

### Info Boxes & Callouts
```tsx
<div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
  <h4 className="font-medium mb-2">💡 Pro Tip</h4>
  <p className="text-muted-foreground">Content</p>
</div>
```

## Layout & Spacing

### Container Patterns
```tsx
// Main page wrapper with subtle gradient
<div className="font-sans min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
  <div className="p-8 pb-20 gap-16 sm:p-20">
    <main className="max-w-7xl mx-auto">
      {/* Content */}
    </main>
  </div>
</div>
```

### Section Spacing
- Use `mb-12` for major section spacing
- Use `mb-8` for subsection spacing
- Use `mb-6` for component spacing within sections

### Responsive Design
- Use `md:grid-cols-2`, `lg:grid-cols-3` for responsive grids
- Use `sm:flex-row` for mobile-first responsive layouts
- Use `max-w-7xl mx-auto` for content containers

## Typography

### Headings
```tsx
// Main page title
<h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">

// Section headings
<h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">

// Subsection headings
<h3 className="text-lg font-semibold">
```

### Body Text
```tsx
// Primary text
<p className="text-foreground">

// Secondary text
<p className="text-muted-foreground">

// Large descriptive text
<p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
```

### Links
```tsx
<a className="text-primary hover:text-primary/80 underline underline-offset-4 decoration-2">
```

## Animation & Effects

### Hover Effects
```tsx
// Scale on hover
<button className="hover:scale-105 transition-all duration-200">

// Translate on hover
<svg className="group-hover:translate-x-1 transition-transform">
```

### Background Effects
```tsx
// Backdrop blur
<div className="backdrop-blur-sm">

// Gradient backgrounds
<div className="bg-gradient-to-br from-primary/5 via-background to-primary/5">
```

## Accessibility

### Focus States
Always include focus states using the `ring` color:
```tsx
<button className="focus:ring-2 focus:ring-ring focus:ring-offset-2">
```

### Color Contrast
- Primary text on background meets WCAG AA standards
- Muted text is used only for secondary information
- Interactive elements have sufficient contrast in both themes

### Dark Mode Considerations
- All colors automatically adapt via CSS custom properties
- No manual dark mode classes needed
- Test both themes for readability

## Migration Guidelines

### From Hardcoded Colors
When updating existing components:

1. **Identify the purpose** of the color (primary action, background, text, etc.)
2. **Map to semantic token** using the guidelines above
3. **Test in both themes** to ensure proper contrast
4. **Use opacity variants** for subtle effects instead of specific color shades

### Common Replacements
```tsx
// Blue colors → primary system
'bg-blue-500' → 'bg-primary'
'text-blue-600' → 'text-primary'
'bg-blue-50' → 'bg-primary/10'

// Green colors → primary system (for consistency)
'bg-green-100' → 'bg-primary/10'
'text-green-800' → 'text-primary'

// Gray colors → semantic tokens
'bg-gray-50' → 'bg-muted'
'border-gray-200' → 'border-border'
'text-gray-600' → 'text-muted-foreground'
```

## Development Workflow

### Before Committing
1. **Test both themes** by toggling system dark mode
2. **Check contrast** for accessibility compliance
3. **Verify consistency** with existing components
4. **Use semantic tokens** instead of hardcoded colors

### Code Review Checklist
- [ ] No hardcoded color values (blue-500, gray-100, etc.)
- [ ] Uses semantic color tokens (primary, muted, etc.)
- [ ] Consistent opacity levels (/5, /10, /20, /80, /90)
- [ ] Proper contrast in both light and dark themes
- [ ] Follows established component patterns

This styling system ensures visual consistency, accessibility, and maintainability across the entire Fargo Flags project while providing an excellent user experience in both light and dark modes.