# Design Quick Reference

Quick reference guide for BE-NTC design system. For detailed guidelines, see [design-guidelines.md](./design-guidelines.md).

---

## 🎨 Color Tokens (ALWAYS USE THESE)

### ✅ CORRECT - Semantic Colors

```tsx
// Primary colors
text-primary bg-primary text-primary-foreground

// Secondary colors
text-secondary bg-secondary text-secondary-foreground

// Accent colors
text-accent bg-accent text-accent-foreground

// Functional colors
text-destructive bg-destructive text-destructive-foreground
text-success bg-success text-success-foreground
text-warning bg-warning text-warning-foreground

// Surface colors
bg-background text-foreground
bg-card text-card-foreground
bg-popover text-popover-foreground
bg-muted text-muted-foreground

// Borders & inputs
border-border bg-input ring-ring
```

### ❌ NEVER USE

```tsx
text-red-500 bg-blue-600 text-purple-400 border-gray-300
```

---

## 📦 Component Priority

### 1. Check Existing Components FIRST

**Web**: `packages/ui/src/components/`
**Native**: `apps/native/components/docs/components/`

### 2. Available Components

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

---

## 🔤 Typography

```tsx
// Headings
text-7xl font-light tracking-tight  // Hero
text-5xl font-light tracking-tight  // Section
text-3xl font-medium               // Subsection
text-xl font-medium                // Card title

// Body
text-base text-muted-foreground leading-relaxed  // Body
text-sm text-muted-foreground                   // Small
text-xs text-muted-foreground uppercase tracking-wide  // Label
```

---

## 📐 Spacing

```tsx
// Padding/Margin
p-4 px-6 py-3 pt-20 mb-4

// Gap
gap-3 gap-4 gap-6 gap-8

// Rounded
rounded-md rounded-lg rounded-xl rounded-2xl rounded-3xl rounded-full
```

---

## 🎭 Button Variants

```tsx
// Variants
variant="primary"       // Default CTA
variant="heavy"         // Bold CTA
variant="secondary"     // Secondary action
variant="outline"       // Outlined
variant="ghost"         // Transparent
variant="destructive"   // Delete/danger

// Sizes
size="xs" size="sm" size="md" size="lg" size="huge" size="icon"

// Examples
<Button size="huge" variant="heavy">Primary CTA</Button>
<Button size="lg" variant="outline">Secondary</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button size="icon" mode="icon" variant="ghost">
  <Icon />
</Button>
```

---

## 📁 Module Structure

```
modules/
├── feature-name/
│   ├── views/
│   │   └── feature-view.tsx
│   ├── components/
│   │   └── feature-component.tsx
│   ├── schemas/
│   │   └── feature-schema.ts    # Zod validation
│   ├── hooks/
│   │   └── use-feature.ts
│   └── layout.tsx
```

---

## 🔄 Zod Validation Pattern

```tsx
// schemas/login-schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// views/login-view.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login-schema";

const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
});
```

---

## 🌐 Localization

### Web

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations("namespace");
t("auth.login.title");
t("shared.buttons.save");
```

### Native

```tsx
import { useLocalization } from "@/src/localization/hooks/use-localization";

const { t } = useLocalization();
t("home.sections.title");
t("shared.buttons.save");
```

### Translation Keys (Hierarchical)

```tsx
✅ t("auth.login.title")
✅ t("dashboard.stats.totalUsers")
❌ t("loginTitle")
❌ t("totalUsers")
```

---

## 🎬 Animation

### Web (Framer Motion)

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <Content />
</motion.div>

// Stagger
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <Item />
    </motion.div>
  ))}
</motion.div>
```

### Native (Reanimated)

```tsx
import Animated, { FadeInDown } from "react-native-reanimated";

<Animated.View entering={FadeInDown.delay(100)}>
  <Content />
</Animated.View>;

// Stagger
{
  items.map((item, index) => (
    <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
      <Item />
    </Animated.View>
  ));
}
```

---

## 🎯 Icons

### Web

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import { MenuIcon } from "@hugeicons/core-free-icons";

<HugeiconsIcon icon={MenuIcon} className="w-5 h-5 text-foreground" />;
```

### Native

```tsx
import { StyledHugeIcon } from "@/src/components/ui/styled-huge-icon";
import { MenuIcon } from "@hugeicons/core-free-icons";

<StyledHugeIcon icon={MenuIcon} size={24} className="text-foreground" />;
```

---

## 📱 Native-Specific

### Lists (LegendList)

```tsx
import { LegendList } from "@legendapp/list";

<LegendList
  data={items}
  renderItem={({ item, index }) => <Item {...item} />}
  keyExtractor={(item) => item.id}
  recycleItems
  showsVerticalScrollIndicator={false}
/>;
```

### Haptics

```tsx
import { triggerHaptic, triggerHapticSoft } from "@/src/lib/haptics";

// Standard interaction
<Button
  onPress={() => {
    triggerHaptic();
    router.push("/details");
  }}
>
  View
</Button>;

// Data loaded (iOS only)
useEffect(() => {
  if (!isLoading && data) triggerHapticSoft();
}, [isLoading, data]);
```

### Loading

```tsx
import { Spinner, useThemeColor } from "heroui-native";
import { FadeIn } from "react-native-reanimated";

const accentForeground = useThemeColor("accent-foreground");

<Spinner entering={FadeIn.delay(50)} color={accentForeground} />;
```

---

## ♿ Accessibility

```tsx
// Semantic HTML
<header><nav><main><article><section><footer>

// ARIA labels
<Button size="icon" aria-label={t("close")}>
  <Icon />
</Button>

// Form labels
<Label htmlFor="email">{t("email")}</Label>
<Input
  id="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>

// Touch targets (native)
<Pressable className="min-h-[44px] min-w-[44px]">
  <Icon />
</Pressable>
```

---

## 📋 Checklist

Before creating a component:

- [ ] Checked `packages/ui/src/components/`
- [ ] Checked `apps/native/components/docs/components/`
- [ ] Using semantic color tokens (no `text-red-500`)
- [ ] Using hierarchical translation keys
- [ ] Added Zod schema for validation (if form)
- [ ] Organized in feature module
- [ ] Added ARIA labels
- [ ] Supports dark mode (automatic via semantic colors)
- [ ] Named export (not default)
- [ ] File name in kebab-case

---

## 🚀 Quick Start Template

```tsx
// modules/my-feature/schemas/my-schema.ts
import { z } from "zod";

export const mySchema = z.object({
  name: z.string().min(3),
});

export type MyFormData = z.infer<typeof mySchema>;

// modules/my-feature/components/my-component.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@be-ntc/ui/components/card";
import { Button } from "@be-ntc/ui/components/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MenuIcon } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl";

interface MyComponentProps {
  title: string;
  description: string;
}

export function MyComponent({ title, description }: MyComponentProps) {
  const t = useTranslations("myFeature");

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
          <HugeiconsIcon icon={MenuIcon} className="w-4 h-4" />
          <span>{t("action")}</span>
        </Button>
      </CardContent>
    </Card>
  );
}

// modules/my-feature/views/my-view.tsx
("use client");

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MyComponent } from "../components/my-component";

export function MyView() {
  const t = useTranslations("myFeature");

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.h1
        className="text-3xl font-light text-foreground mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("title")}
      </motion.h1>
      <MyComponent
        title={t("componentTitle")}
        description={t("componentDescription")}
      />
    </div>
  );
}
```

---

**See [design-guidelines.md](./design-guidelines.md) for complete documentation.**
