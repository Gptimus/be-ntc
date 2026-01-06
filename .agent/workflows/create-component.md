---
description: How to create new components following design guidelines
---

# Component Creation Workflow

Follow this workflow when creating new components for web or native apps.

## Step 1: Check Existing Components

Before creating any new component, **ALWAYS** check if it already exists:

### For Web Apps

```bash
# Check packages/ui for shadcn components
ls packages/ui/src/components/

# Search for similar components
grep -r "ComponentName" packages/ui/src/components/
```

### For Native Apps

```bash
# Check HeroUI components
ls apps/native/components/docs/components/

# Search for similar components
grep -r "ComponentName" apps/native/components/docs/components/
```

**Available Components:**

- **Web**: button, card, dialog, input, label, select, checkbox, switch, tabs, accordion, alert, badge, avatar, dropdown-menu, popover, sheet, sidebar, skeleton, spinner, table, toast, tooltip
- **Native**: button, card, chip, avatar, checkbox, switch, tabs, accordion, dialog, popover, select, skeleton, spinner, surface, text-field, toast

## Step 2: Determine Component Location

### Shared Component (Reusable across features)

```
apps/[app]/src/components/
├── ui/           # Basic UI components
├── shared/       # Business logic components
└── layout/       # Layout components
```

### Feature-Specific Component

```
apps/[app]/src/modules/[feature]/
└── components/
    └── feature-component.tsx
```

## Step 3: Create Component File

Use **kebab-case** for file names:

```bash
# ✅ CORRECT
touch apps/web/src/modules/transactions/components/transaction-card.tsx

# ❌ WRONG
touch apps/web/src/modules/transactions/components/TransactionCard.tsx
```

## Step 4: Component Template

### Web Component Template

```tsx
// apps/web/src/modules/[feature]/components/my-component.tsx
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
import { cn } from "@be-ntc/ui/lib/utils";

interface MyComponentProps {
  title: string;
  description: string;
  className?: string;
}

export function MyComponent({
  title,
  description,
  className,
}: MyComponentProps) {
  const t = useTranslations("feature");

  return (
    <Card className={cn("border-border/50 bg-card", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-foreground">
            {title}
          </CardTitle>
          <HugeiconsIcon
            icon={MenuIcon}
            className="w-5 h-5 text-muted-foreground"
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button variant="primary" size="sm">
          <span>{t("action")}</span>
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Native Component Template

```tsx
// apps/native/src/modules/[feature]/components/my-component.tsx
import { View } from "react-native";
import { Card, Button } from "heroui-native";
import { StyledHugeIcon } from "@/src/components/ui/styled-huge-icon";
import { AppText } from "@/src/components/ui/app-text";
import { MenuIcon } from "@hugeicons/core-free-icons";
import { useLocalization } from "@/src/localization/hooks/use-localization";
import { triggerHaptic } from "@/src/lib/haptics";

interface MyComponentProps {
  title: string;
  description: string;
  onPress?: () => void;
}

export function MyComponent({ title, description, onPress }: MyComponentProps) {
  const { t } = useLocalization();

  const handlePress = () => {
    triggerHaptic();
    onPress?.();
  };

  return (
    <Card className="bg-card border border-border p-4">
      <View className="flex-row items-center justify-between mb-3">
        <AppText className="text-lg font-medium text-foreground">
          {title}
        </AppText>
        <StyledHugeIcon
          icon={MenuIcon}
          size={20}
          className="text-muted-foreground"
        />
      </View>
      <AppText className="text-sm text-muted-foreground mb-4">
        {description}
      </AppText>
      <Button onPress={handlePress} variant="solid" color="accent">
        {t("feature.action")}
      </Button>
    </Card>
  );
}
```

## Step 5: Color Validation Checklist

**CRITICAL**: Ensure you're using semantic colors:

```tsx
// ✅ CORRECT - Semantic colors
className = "text-primary";
className = "bg-secondary";
className = "text-accent";
className = "text-destructive";
className = "text-foreground";
className = "text-muted-foreground";
className = "bg-background";
className = "bg-card";
className = "border-border";

// ❌ WRONG - Hardcoded tokens
className = "text-red-500";
className = "bg-blue-600";
className = "text-purple-400";
className = "border-gray-300";
```

**Search for violations:**

```bash
# Check for hardcoded color tokens
grep -r "text-red-\|text-blue-\|text-green-\|text-purple-\|text-yellow-\|text-pink-\|text-indigo-\|text-gray-" apps/web/src/modules/[feature]/
```

## Step 6: Add Localization

### Create Translation Keys

```json
// messages/en.json
{
  "feature": {
    "title": "Feature Title",
    "description": "Feature description",
    "action": "Action Label",
    "components": {
      "myComponent": {
        "title": "Component Title",
        "description": "Component description"
      }
    }
  }
}
```

### Use Hierarchical Keys

```tsx
// ✅ CORRECT
t("feature.components.myComponent.title");
t("feature.action");
t("shared.buttons.save");

// ❌ WRONG
t("myComponentTitle");
t("actionLabel");
t("save");
```

## Step 7: Add Validation (If Form Component)

### Create Zod Schema

```tsx
// modules/[feature]/schemas/my-schema.ts
import { z } from "zod";

export const mySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  amount: z.number().positive("Amount must be positive"),
});

export type MyFormData = z.infer<typeof mySchema>;
```

### Use in Component

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mySchema, type MyFormData } from "../schemas/my-schema";

export function MyFormComponent() {
  const form = useForm<MyFormData>({
    resolver: zodResolver(mySchema),
  });

  const onSubmit = (data: MyFormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>
  );
}
```

## Step 8: Add Animation

### Web (Framer Motion)

```tsx
import { motion } from "framer-motion";

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Content />
    </motion.div>
  );
}
```

### Native (Reanimated)

```tsx
import Animated, { FadeInDown } from "react-native-reanimated";

export function MyComponent() {
  return (
    <Animated.View entering={FadeInDown.delay(100)}>
      <Content />
    </Animated.View>
  );
}
```

## Step 9: Add Accessibility

```tsx
// Web
<Button
  size="icon"
  aria-label={t("close")}
>
  <Icon />
</Button>

<Label htmlFor="email">{t("email")}</Label>
<Input
  id="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>

// Native
<Pressable
  className="min-h-[44px] min-w-[44px]"
  accessibilityLabel={t("close")}
  accessibilityRole="button"
>
  <Icon />
</Pressable>
```

## Step 10: Export Component

Use **named exports** (not default):

```tsx
// ✅ CORRECT
export function MyComponent() {}

// ❌ WRONG
export default function MyComponent() {}
```

## Step 11: Create Index File (Optional)

For better imports:

```tsx
// modules/[feature]/components/index.ts
export { MyComponent } from "./my-component";
export { AnotherComponent } from "./another-component";
```

## Step 12: Test Dark Mode

Ensure component works in both light and dark modes:

```tsx
// Automatic dark mode support via semantic colors
<View className="bg-card border border-border">
  <AppText className="text-card-foreground">
    This text adapts automatically
  </AppText>
</View>
```

## Final Checklist

Before committing:

- [ ] Checked existing components in `packages/ui` or `apps/native/components/docs/components`
- [ ] Used semantic color tokens (no `text-red-500`, `bg-blue-600`, etc.)
- [ ] **NEVER** used emojis (Used Hugeicons instead)
- [ ] File name in kebab-case
- [ ] Named export (not default)
- [ ] Hierarchical translation keys
- [ ] Zod schema for validation (if form)
- [ ] Animation added (Framer Motion or Reanimated)
- [ ] ARIA labels for accessibility
- [ ] Tested in dark mode
- [ ] Component is reusable and follows single responsibility
- [ ] Props are properly typed with TypeScript interface

## Example: Complete Feature Component

```tsx
// modules/transactions/schemas/transaction-schema.ts
import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(3, "Description too short"),
  category: z.enum(["food", "transport", "entertainment"]),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

// modules/transactions/components/transaction-card.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@be-ntc/ui/components/card";
import { Badge } from "@be-ntc/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@be-ntc/ui/lib/utils";

interface TransactionCardProps {
  amount: number;
  description: string;
  category: "food" | "transport" | "entertainment";
  date: string;
  className?: string;
}

export function TransactionCard({
  amount,
  description,
  category,
  date,
  className,
}: TransactionCardProps) {
  const t = useTranslations("transactions");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn("border-border/50 bg-card", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium text-foreground">
              {description}
            </CardTitle>
            <HugeiconsIcon
              icon={CreditCardIcon}
              className="w-5 h-5 text-muted-foreground"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary">{t(`categories.${category}`)}</Badge>
            <span className="text-lg font-semibold text-foreground">
              ${amount.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{date}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// modules/transactions/components/index.ts
export { TransactionCard } from "./transaction-card";

// modules/transactions/views/transaction-list-view.tsx
("use client");

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TransactionCard } from "../components";

export function TransactionListView({ transactions }) {
  const t = useTranslations("transactions");

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-light text-foreground mb-6">{t("title")}</h1>
      <motion.div
        className="grid gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        {transactions.map((tx) => (
          <motion.div
            key={tx.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <TransactionCard {...tx} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
```

---

**See also:**

- [design-guidelines.md](./design-guidelines.md) - Complete design system documentation
- [design-quick-reference.md](./design-quick-reference.md) - Quick reference cheat sheet
