# Migration Guide: Hardcoded Colors to Semantic Tokens

Guide for migrating existing components from hardcoded Tailwind color tokens to semantic color tokens.

## Why Migrate?

1. **Automatic Dark Mode**: Semantic colors adapt automatically to light/dark themes
2. **Consistency**: Ensures visual consistency across the entire application
3. **Maintainability**: Change the entire color scheme by updating CSS variables
4. **Accessibility**: Better contrast ratios and color combinations

## Detection

Run the color validation script to find violations:

```bash
# Check all apps
./scripts/validate-colors.sh

# Check specific directory
./scripts/validate-colors.sh apps/web/src/modules/auth
```

## Migration Patterns

### Text Colors

#### Primary Text

```tsx
// ❌ Before
className = "text-purple-600";
className = "text-blue-700";

// ✅ After
className = "text-primary";
```

#### Secondary/Muted Text

```tsx
// ❌ Before
className = "text-gray-600";
className = "text-slate-500";

// ✅ After
className = "text-muted-foreground";
```

#### Accent Text

```tsx
// ❌ Before
className = "text-yellow-600";
className = "text-amber-500";

// ✅ After
className = "text-accent";
```

#### Error/Destructive Text

```tsx
// ❌ Before
className = "text-red-600";
className = "text-red-500";

// ✅ After
className = "text-destructive";
```

#### Success Text

```tsx
// ❌ Before
className = "text-green-600";
className = "text-emerald-500";

// ✅ After
className = "text-success"; // Add to globals.css if not exists
```

### Background Colors

#### Primary Background

```tsx
// ❌ Before
className = "bg-purple-600";
className = "bg-blue-700";

// ✅ After
className = "bg-primary";
```

#### Card/Surface Background

```tsx
// ❌ Before
className = "bg-white dark:bg-gray-900";
className = "bg-gray-50 dark:bg-gray-800";

// ✅ After
className = "bg-card";
className = "bg-secondary"; // For subtle backgrounds
```

#### Muted Background

```tsx
// ❌ Before
className = "bg-gray-100 dark:bg-gray-800";
className = "bg-slate-100";

// ✅ After
className = "bg-muted";
```

#### Accent Background

```tsx
// ❌ Before
className = "bg-yellow-100";
className = "bg-amber-50";

// ✅ After
className = "bg-accent/10"; // Light accent background
className = "bg-accent"; // Full accent background
```

### Border Colors

```tsx
// ❌ Before
className = "border-gray-300 dark:border-gray-700";
className = "border-slate-200";

// ✅ After
className = "border-border";
```

### Icon Colors

```tsx
// ❌ Before
<HugeiconsIcon
  icon={MenuIcon}
  className="text-blue-600"
/>

// ✅ After
<HugeiconsIcon
  icon={MenuIcon}
  className="text-primary"
/>

// For muted icons
<HugeiconsIcon
  icon={MenuIcon}
  className="text-muted-foreground"
/>
```

### Status/Category Colors

For status indicators or categories that need distinct colors:

#### Option 1: Use Existing Semantic Colors

```tsx
// ❌ Before
const statusColors = {
  pending: "text-yellow-600 bg-yellow-100",
  approved: "text-green-600 bg-green-100",
  rejected: "text-red-600 bg-red-100",
};

// ✅ After
const statusColors = {
  pending: "text-accent bg-accent/10",
  approved: "text-success bg-success/10",
  rejected: "text-destructive bg-destructive/10",
};
```

#### Option 2: Add New Semantic Tokens

If you need more status colors, add them to `packages/ui/src/styles/globals.css`:

```css
:root {
  /* Existing colors... */

  /* Add new semantic colors */
  --success: oklch(60% 0.15 145); /* Green */
  --warning: oklch(75% 0.18 85); /* Yellow/Orange */
  --info: oklch(60% 0.15 240); /* Blue */
}

.dark {
  /* Existing colors... */

  /* Dark mode variants */
  --success: oklch(65% 0.15 145);
  --warning: oklch(70% 0.15 85);
  --info: oklch(65% 0.15 240);
}
```

Then use them:

```tsx
className = "text-success bg-success/10";
className = "text-warning bg-warning/10";
className = "text-info bg-info/10";
```

## Complete Examples

### Example 1: Card Component

```tsx
// ❌ Before
<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
    Title
  </h3>
  <p className="text-sm text-gray-600 dark:text-gray-400">
    Description
  </p>
  <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
    Action
  </button>
</div>

// ✅ After
<div className="bg-card border border-border rounded-lg p-4">
  <h3 className="text-lg font-semibold text-foreground mb-2">
    Title
  </h3>
  <p className="text-sm text-muted-foreground">
    Description
  </p>
  <Button variant="primary" size="sm" className="mt-4">
    Action
  </Button>
</div>
```

### Example 2: Status Badge

```tsx
// ❌ Before
const statusStyles = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

<span className={`px-2 py-1 rounded-full text-xs ${statusStyles[status]}`}>
  {status}
</span>;

// ✅ After
const statusStyles = {
  active: "bg-success/10 text-success",
  pending: "bg-accent/10 text-accent",
  inactive: "bg-destructive/10 text-destructive",
};

<Badge variant="secondary" className={statusStyles[status]}>
  {status}
</Badge>;
```

### Example 3: Form Input

```tsx
// ❌ Before
<div className="space-y-2">
  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
    Email
  </label>
  <input
    type="email"
    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
  />
  <p className="text-xs text-red-600 dark:text-red-400">
    {error}
  </p>
</div>

// ✅ After
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    className="bg-input border-border"
  />
  {error && (
    <p className="text-xs text-destructive">
      {error}
    </p>
  )}
</div>
```

### Example 4: Navigation

```tsx
// ❌ Before
<nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
  <div className="flex items-center gap-4">
    <a
      href="/dashboard"
      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
    >
      Dashboard
    </a>
    <a
      href="/settings"
      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
    >
      Settings
    </a>
  </div>
</nav>

// ✅ After
<nav className="bg-background border-b border-border">
  <div className="flex items-center gap-4">
    <a
      href="/dashboard"
      className="text-primary hover:text-primary/90"
    >
      Dashboard
    </a>
    <a
      href="/settings"
      className="text-muted-foreground hover:text-foreground"
    >
      Settings
    </a>
  </div>
</nav>
```

## Migration Checklist

For each file being migrated:

- [ ] Replace all `text-{color}-{shade}` with semantic tokens
- [ ] Replace all `bg-{color}-{shade}` with semantic tokens
- [ ] Replace all `border-{color}-{shade}` with semantic tokens
- [ ] Remove manual dark mode classes (`dark:*`)
- [ ] Test in both light and dark modes
- [ ] Run `./scripts/validate-colors.sh` to verify

## Common Mappings

### Text Colors

| Hardcoded                            | Semantic                |
| ------------------------------------ | ----------------------- |
| `text-purple-600`, `text-blue-700`   | `text-primary`          |
| `text-gray-600`, `text-slate-500`    | `text-muted-foreground` |
| `text-yellow-600`, `text-amber-500`  | `text-accent`           |
| `text-red-600`, `text-red-500`       | `text-destructive`      |
| `text-green-600`, `text-emerald-500` | `text-success`          |
| `text-gray-900`, `text-black`        | `text-foreground`       |

### Background Colors

| Hardcoded                       | Semantic                     |
| ------------------------------- | ---------------------------- |
| `bg-white`, `bg-gray-50`        | `bg-background` or `bg-card` |
| `bg-purple-600`, `bg-blue-700`  | `bg-primary`                 |
| `bg-gray-100`, `bg-slate-100`   | `bg-muted` or `bg-secondary` |
| `bg-yellow-100`, `bg-amber-50`  | `bg-accent/10`               |
| `bg-red-100`, `bg-red-50`       | `bg-destructive/10`          |
| `bg-green-100`, `bg-emerald-50` | `bg-success/10`              |

### Border Colors

| Hardcoded                              | Semantic             |
| -------------------------------------- | -------------------- |
| `border-gray-300`, `border-slate-200`  | `border-border`      |
| `border-purple-600`, `border-blue-700` | `border-primary`     |
| `border-red-600`                       | `border-destructive` |

## Testing

After migration:

1. **Visual Test**: Check component in both light and dark modes
2. **Validation**: Run `./scripts/validate-colors.sh`
3. **Contrast**: Verify text is readable on backgrounds
4. **Consistency**: Ensure colors match design system

```bash
# Run validation
./scripts/validate-colors.sh apps/web/src/modules/auth

# Should output:
# ✅ No hardcoded color tokens found!
```

## Adding New Semantic Colors

If you need a new semantic color (e.g., `success`, `warning`, `info`):

1. **Add to globals.css**:

```css
/* packages/ui/src/styles/globals.css */

:root {
  /* Existing colors... */
  --success: oklch(60% 0.15 145);
  --success-foreground: oklch(98% 0.005 250);
}

.dark {
  /* Existing colors... */
  --success: oklch(65% 0.15 145);
  --success-foreground: oklch(12% 0.015 250);
}
```

2. **Add to Tailwind theme**:

```css
@theme inline {
  /* Existing colors... */
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
}
```

3. **Use in components**:

```tsx
className = "text-success bg-success/10";
className = "bg-success text-success-foreground";
```

4. **Update documentation**:
   - Add to `.agent/design-guidelines.md`
   - Add to `.agent/design-quick-reference.md`

## Troubleshooting

### Dark mode not working

**Problem**: Colors don't change in dark mode  
**Solution**: You're likely using hardcoded colors. Replace with semantic tokens.

### Colors look wrong

**Problem**: Semantic color doesn't match expected color  
**Solution**: Check `packages/ui/src/styles/globals.css` for color definitions. You may need a different semantic token or need to add a new one.

### Need specific color for demo/mockup

**Problem**: Need exact color for a phone mockup or demo  
**Solution**: Add file to exceptions in `scripts/validate-colors.sh`:

```bash
EXCEPTIONS=(
  "apps/landing/src/components/sections/hero.tsx"
  "apps/web/src/components/demo/phone-mockup.tsx"  # Add here
)
```

## Resources

- [Design Guidelines](./../design-guidelines.md) - Complete color system documentation
- [Quick Reference](./../design-quick-reference.md) - Color token quick lookup
- [Component Creation Workflow](./create-component.md) - Creating new components

---

**Questions?** See the main [Design Guidelines](./../design-guidelines.md) or ask the team.
