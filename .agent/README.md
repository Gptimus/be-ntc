# Design System Documentation

Comprehensive design system for the BE-NTC monorepo, covering web and native applications.

## 📚 Documentation

### Core Documents

1. **[Design Guidelines](./design-guidelines.md)** - Complete design system documentation

   - Color system (OKLCH-based semantic tokens)
   - Typography standards
   - Component library reference
   - Spacing & layout patterns
   - Module organization
   - Animation guidelines
   - Localization patterns
   - Accessibility requirements

2. **[Quick Reference](./design-quick-reference.md)** - Cheat sheet for common patterns

   - Color tokens quick lookup
   - Component availability
   - Typography patterns
   - Spacing scale
   - Button variants
   - Animation snippets
   - Icon usage
   - Platform-specific helpers

3. **[Component Creation Workflow](./workflows/create-component.md)** - Step-by-step guide
   - Checking existing components
   - File organization
   - Component templates
   - Validation checklist
   - Complete examples

## 🎨 Key Principles

### 1. Semantic Colors Only

**NEVER** use hardcoded color tokens like `text-red-500`, `bg-blue-600`, etc.

```tsx
// ✅ CORRECT
className = "text-primary bg-secondary border-border";

// ❌ WRONG
className = "text-purple-500 bg-blue-100 border-gray-300";
```

**Semantic tokens:**

- `primary`, `secondary`, `accent`, `destructive`
- `background`, `foreground`, `card`, `popover`, `muted`
- `border`, `input`, `ring`

### 2. Component Reusability

**ALWAYS** check existing components before creating new ones:

- **Web**: `packages/ui/src/components/`
- **Native**: `apps/native/components/docs/components/`

### 3. Module Pattern

Organize by **features**, not technical layers:

```
modules/
├── auth/
│   ├── views/
│   ├── components/
│   ├── schemas/      # Zod validation
│   └── hooks/
└── dashboard/
    ├── views/
    ├── components/
    ├── schemas/
    └── hooks/
```

### 4. Validation with Zod

All forms and data validation use Zod schemas:

```tsx
// schemas/login-schema.ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### 5. Hierarchical Localization

Use structured translation keys:

```tsx
// ✅ CORRECT
t("auth.login.title");
t("dashboard.stats.totalUsers");

// ❌ WRONG
t("loginTitle");
t("totalUsers");
```

## 🛠️ Tools & Scripts

### Color Validation

Automatically check for hardcoded color tokens:

```bash
# Validate all apps
./scripts/validate-colors.sh

# Validate specific directory
./scripts/validate-colors.sh apps/web
```

### Component Libraries

#### Web (shadcn)

```
button, card, dialog, input, label, select, checkbox, switch,
tabs, accordion, alert, badge, avatar, dropdown-menu, popover,
sheet, sidebar, skeleton, spinner, table, toast, tooltip
```

#### Native (HeroUI)

```
button, card, chip, avatar, checkbox, switch, tabs, accordion,
dialog, popover, select, skeleton, spinner, surface, text-field
```

## 🚀 Quick Start

### Creating a New Component

1. **Check existing components:**

   ```bash
   ls packages/ui/src/components/
   ls apps/native/components/docs/components/
   ```

2. **Follow the workflow:**
   See [workflows/create-component.md](./workflows/create-component.md)

3. **Use semantic colors:**
   See [design-quick-reference.md](./design-quick-reference.md#-color-tokens-always-use-these)

4. **Add validation (if form):**

   ```tsx
   // schemas/my-schema.ts
   export const mySchema = z.object({
     name: z.string().min(3),
   });
   ```

5. **Add localization:**

   ```json
   // messages/en.json
   {
     "feature": {
       "title": "Title",
       "action": "Action"
     }
   }
   ```

6. **Validate colors:**
   ```bash
   ./scripts/validate-colors.sh apps/web
   ```

### Component Template

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@be-ntc/ui/components/card";
import { Button } from "@be-ntc/ui/components/button";
import { useTranslations } from "next-intl";

interface MyComponentProps {
  title: string;
  description: string;
}

export function MyComponent({ title, description }: MyComponentProps) {
  const t = useTranslations("feature");

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button variant="primary" size="sm">
          {t("action")}
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 📋 Pre-Commit Checklist

Before committing new components:

- [ ] Checked `packages/ui` and `apps/native/components/docs/components`
- [ ] Using semantic color tokens (no `text-red-500`)
- [ ] File name in kebab-case
- [ ] Named export (not default)
- [ ] Hierarchical translation keys
- [ ] Zod schema for validation (if form)
- [ ] Animation added
- [ ] ARIA labels for accessibility
- [ ] Tested in dark mode
- [ ] Ran `./scripts/validate-colors.sh`

## 🎯 Platform-Specific

### Web (Next.js)

```tsx
// Imports
import { Button } from "@be-ntc/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

// Animation
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
  <Content />
</motion.div>;
```

### Native (React Native)

```tsx
// Imports
import { Button } from "heroui-native";
import { StyledHugeIcon } from "@/src/components/ui/styled-huge-icon";
import { useLocalization } from "@/src/localization/hooks/use-localization";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LegendList } from "@legendapp/list";
import { triggerHaptic } from "@/src/lib/haptics";

// Animation
<Animated.View entering={FadeInDown.delay(100)}>
  <Content />
</Animated.View>

// Lists
<LegendList
  data={items}
  renderItem={({ item }) => <Item {...item} />}
  recycleItems
/>

// Haptics
<Button onPress={() => {
  triggerHaptic();
  router.push("/details");
}}>
  View
</Button>
```

## 🌈 Color System

Based on OKLCH color space for perceptual uniformity:

### Light Mode

- **Primary**: `oklch(51% 0.23 321)` - Deep purple
- **Secondary**: `oklch(85% 0.08 200)` - Blue-green
- **Accent**: `oklch(75% 0.18 85)` - Warm gold
- **Destructive**: `oklch(55% 0.22 25)` - Soft red

### Dark Mode

- **Primary**: `oklch(65% 0.18 321)` - Brighter purple
- **Secondary**: `oklch(25% 0.05 200)` - Softer blue-green
- **Accent**: `oklch(70% 0.15 85)` - Muted gold
- **Destructive**: `oklch(60% 0.2 25)` - Brighter red

All colors defined in `packages/ui/src/styles/globals.css`.

## 📖 Additional Resources

- **Design System**: Based on `apps/landing` design
- **Component Docs**:
  - Web: [shadcn/ui](https://ui.shadcn.com/)
  - Native: `apps/native/components/docs/components/design-guidelines.md`
- **Icons**: [Hugeicons](https://hugeicons.com/)
- **Animation**:
  - Web: [Framer Motion](https://www.framer.com/motion/)
  - Native: [Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## 🤝 Contributing

When adding new components or patterns:

1. Update relevant documentation
2. Add examples to quick reference
3. Update component creation workflow if needed
4. Run color validation script
5. Test in both light and dark modes

## 📝 Version

- **Version**: 1.0.0
- **Last Updated**: 2026-01-06
- **Based On**: `apps/landing` design system

---

**Need help?** See the [Design Guidelines](./design-guidelines.md) for complete documentation.
