# Design Guidelines for Mobile and Web Apps

Comprehensive design system guidelines for the BE-NTC monorepo, based on the `apps/landing` design. This document establishes standards for both web (Next.js) and native (React Native) applications.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Component Library](#component-library)
4. [Spacing & Layout](#spacing--layout)
5. [Module Pattern & File Organization](#module-pattern--file-organization)
6. [Animation & Motion](#animation--motion)
7. [Localization](#localization)
8. [Accessibility](#accessibility)
9. [Platform-Specific Guidelines](#platform-specific-guidelines)

---

## Color System

### Semantic Color Tokens

**CRITICAL**: Never use hardcoded color tokens like `text-red-500`, `bg-blue-600`, etc. Always use semantic color names that adapt to light/dark mode automatically.

#### Primary Semantic Colors

```tsx
// ✅ CORRECT - Use semantic colors
className = "text-primary";
className = "bg-primary";
className = "text-primary-foreground";

className = "text-secondary";
className = "bg-secondary";
className = "text-secondary-foreground";

className = "text-accent";
className = "bg-accent";
className = "text-accent-foreground";

// ❌ WRONG - Never use hardcoded tokens
className = "text-purple-500";
className = "bg-blue-600";
className = "text-red-400";
```

#### Functional Semantic Colors

```tsx
// State colors
className = "text-destructive"; // For errors, delete actions
className = "bg-destructive";
className = "text-destructive-foreground";

// Future additions (when needed)
className = "text-success"; // For success states
className = "text-warning"; // For warning states
className = "text-info"; // For informational states
```

#### Surface & Background Colors

```tsx
className = "bg-background"; // Main app background
className = "text-foreground"; // Main text color

className = "bg-card"; // Card backgrounds
className = "text-card-foreground"; // Card text

className = "bg-popover"; // Popover/dropdown backgrounds
className = "text-popover-foreground";

className = "bg-muted"; // Subtle backgrounds
className = "text-muted-foreground"; // Secondary text
```

#### Border & Input Colors

```tsx
className = "border-border"; // Standard borders
className = "bg-input"; // Input backgrounds
className = "ring-ring"; // Focus rings
```

### OKLCH Color System

The project uses OKLCH color space for perceptually uniform colors. All colors are defined in `packages/ui/src/styles/globals.css`:

```css
/* Light mode */
:root {
  --primary: oklch(51% 0.23 321); /* Deep purple */
  --secondary: oklch(85% 0.08 200); /* Blue-green */
  --accent: oklch(75% 0.18 85); /* Warm gold */
  --destructive: oklch(55% 0.22 25); /* Soft red */
  --background: oklch(99% 0.005 250); /* Very light cool gray */
  --foreground: oklch(15% 0.02 250); /* Deep cool gray */
}

/* Dark mode */
.dark {
  --primary: oklch(65% 0.18 321); /* Brighter purple */
  --secondary: oklch(25% 0.05 200); /* Softer blue-green */
  --accent: oklch(70% 0.15 85); /* Muted gold */
  --destructive: oklch(60% 0.2 25); /* Brighter red */
  --background: oklch(12% 0.015 250); /* Deep cool gray */
  --foreground: oklch(98% 0.005 250); /* Near white */
}
```

### Dark Mode Support

All components must support dark mode automatically through semantic colors:

```tsx
// ✅ CORRECT - Automatic dark mode
className = "bg-background text-foreground";
className = "border-border";

// ❌ WRONG - Manual dark mode classes
className = "bg-white dark:bg-gray-900";
className = "text-black dark:text-white";
```

---

## Typography

### Font Families

The project uses **Outfit** as the primary sans-serif font, with **Geist** and **Geist Mono** as alternatives:

```tsx
// Defined in apps/landing/src/app/[locale]/layout.tsx
const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

### Font Weights

```tsx
className = "font-light"; // 300 - Body text, descriptions
className = "font-normal"; // 400 - Default
className = "font-medium"; // 500 - Emphasis, labels
className = "font-semibold"; // 600 - Subheadings
className = "font-bold"; // 700 - Headings (use sparingly)
```

### Text Sizes

```tsx
// Headings
className = "text-7xl"; // Hero titles (72px)
className = "text-6xl"; // Major headings (60px)
className = "text-5xl"; // Section headings (48px)
className = "text-4xl"; // Subsection headings (36px)
className = "text-3xl"; // Card titles (30px)
className = "text-2xl"; // Large text (24px)
className = "text-xl"; // Subheadings (20px)

// Body text
className = "text-lg"; // Large body (18px)
className = "text-base"; // Default body (16px)
className = "text-sm"; // Small text (14px)
className = "text-xs"; // Tiny text (12px)
```

### Line Height & Tracking

```tsx
className = "leading-tight"; // Headings
className = "leading-relaxed"; // Body text
className = "tracking-tight"; // Headings (h1-h4 by default)
className = "tracking-wide"; // Uppercase labels
```

### Typography Patterns

```tsx
// Hero title
<h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight tracking-tight">
  {t("hero.title")}
</h1>

// Subtitle
<p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed">
  {t("hero.subtitle")}
</p>

// Section heading
<h2 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
  {t("section.title")}
</h2>

// Card title
<h3 className="text-lg font-medium text-foreground">
  {t("card.title")}
</h3>

// Body text
<p className="text-base text-muted-foreground leading-relaxed">
  {t("description")}
</p>

// Small label
<span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
  {t("label")}
</span>
```

---

## Component Library

### Component Priority

**ALWAYS check for existing components before creating new ones:**

1. **Web Apps**: Check `packages/ui/src/components/` first
2. **Native Apps**: Check `apps/native/components/docs/components/` first

### Available shadcn Components (packages/ui)

```
accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb,
button-group, button, calendar, card, carousel, chart, checkbox, collapsible,
command, context-menu, dialog, drawer, dropdown-menu, empty, field, hover-card,
input-group, input-otp, input, item, kbd, label, menubar, navigation-menu,
pagination, popover, progress, radio-group, scroll-area, select, separator,
sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs,
textarea, toggle-group, toggle, tooltip, toaster
```

### Available HeroUI Components (apps/native)

```
accordion, avatar, button, card, checkbox, chip, dialog, divider,
drop-shadow-view, error-view, form-field, popover, pressable-feedback,
radio-group, scroll-shadow, select, skeleton, skeleton-group, spinner,
surface, switch, tabs, text-field, toast
```

### Button Variants

From `packages/ui/src/components/button.tsx`:

```tsx
// Variants
variant = "primary"; // Default - Primary color
variant = "heavy"; // Bold primary (for CTAs)
variant = "secondary"; // Secondary color
variant = "outline"; // Outlined button
variant = "ghost"; // Transparent background
variant = "destructive"; // For delete/dangerous actions
variant = "mono"; // Monochrome
variant = "dim"; // Subtle text button

// Sizes
size = "xs"; // Extra small
size = "sm"; // Small
size = "md"; // Medium (default)
size = "lg"; // Large
size = "huge"; // Extra large (for hero CTAs)
size = "icon"; // Square icon button

// Appearance
appearance = "default"; // Standard
appearance = "ghost"; // Ghost variant

// Mode
mode = "default"; // Standard button
mode = "link"; // Link-style button
mode = "icon"; // Icon button
mode = "input"; // Input-style button

// Radius
radius = "md"; // Medium rounded (default)
radius = "full"; // Fully rounded
```

### Button Usage Examples

```tsx
// Primary CTA
<Button size="huge" variant="heavy">
  <HugeiconsIcon icon={Apple01Icon} className="w-5 h-5" />
  <span>{t("download")}</span>
</Button>

// Secondary action
<Button size="lg" variant="outline">
  <span>{t("learnMore")}</span>
</Button>

// Destructive action
<Button variant="destructive" size="sm">
  <span>{t("delete")}</span>
</Button>

// Icon button
<Button size="icon" mode="icon" variant="ghost">
  <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />
</Button>

// Link button
<Button variant="primary" mode="link" underline="solid">
  <span>{t("readMore")}</span>
</Button>
```

### Card Component

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@be-ntc/ui/components/card";

<Card className="border-border/50 bg-card/60 backdrop-blur-sm">
  <CardHeader>
    <CardTitle className="text-lg font-medium">{t("title")}</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      {t("description")}
    </CardDescription>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
  <CardFooter>{/* Footer actions */}</CardFooter>
</Card>;
```

### Dialog Component

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@be-ntc/ui/components/dialog";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{t("dialog.title")}</DialogTitle>
      <DialogDescription>{t("dialog.description")}</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        {t("cancel")}
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        {t("confirm")}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

### Input Component

```tsx
import { Input } from "@be-ntc/ui/components/input";
import { Label } from "@be-ntc/ui/components/label";

<div className="space-y-2">
  <Label htmlFor="email">{t("email")}</Label>
  <Input
    id="email"
    type="email"
    placeholder={t("emailPlaceholder")}
    className="bg-input border-border"
  />
</div>;
```

---

## Spacing & Layout

### Container Widths

```tsx
className = "container mx-auto"; // Standard container
className = "container mx-auto px-6 md:px-12 lg:px-16"; // With responsive padding
```

### Padding & Margin Scale

```tsx
// Spacing scale (4px base)
className = "p-1"; // 4px
className = "p-2"; // 8px
className = "p-3"; // 12px
className = "p-4"; // 16px (standard)
className = "p-5"; // 20px
className = "p-6"; // 24px
className = "p-8"; // 32px
className = "p-12"; // 48px
className = "p-16"; // 64px
className = "p-20"; // 80px

// Directional
className = "px-4 py-3"; // Horizontal + Vertical
className = "pt-20"; // Top only
className = "mb-4"; // Bottom margin
```

### Gap (Flexbox/Grid)

```tsx
className = "gap-3"; // 12px gap
className = "gap-4"; // 16px gap (standard)
className = "gap-6"; // 24px gap
className = "gap-8"; // 32px gap
className = "gap-12"; // 48px gap
className = "gap-16"; // 64px gap
```

### Rounded Corners

```tsx
className = "rounded-md"; // 6px - Small elements
className = "rounded-lg"; // 8px - Cards
className = "rounded-xl"; // 12px - Large cards
className = "rounded-2xl"; // 16px - Featured cards
className = "rounded-3xl"; // 24px - Hero elements
className = "rounded-full"; // Fully rounded - Buttons, avatars
```

### Grid Layouts

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} />)}
</div>

// Services grid (4 columns)
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {services.map(service => <ServiceCard key={service.id} />)}
</div>
```

### Flexbox Layouts

```tsx
// Horizontal stack
<div className="flex items-center gap-4">
  <Icon />
  <Text />
</div>

// Vertical stack
<div className="flex flex-col gap-3">
  <Item />
  <Item />
</div>

// Space between
<div className="flex items-center justify-between">
  <Title />
  <Action />
</div>
```

---

## Module Pattern & File Organization

### Feature Module Structure

**PRIORITY**: Organize code by features, not by technical layers. Each feature should be self-contained with its own views, validations, and layouts.

```
apps/web/src/modules/
├── auth/
│   ├── views/
│   │   ├── login-view.tsx
│   │   ├── register-view.tsx
│   │   └── forgot-password-view.tsx
│   ├── components/
│   │   ├── auth-form.tsx
│   │   └── social-login.tsx
│   ├── schemas/
│   │   ├── login-schema.ts       # Zod validation
│   │   └── register-schema.ts
│   ├── hooks/
│   │   └── use-auth.ts
│   └── layout.tsx
├── dashboard/
│   ├── views/
│   │   ├── overview-view.tsx
│   │   └── analytics-view.tsx
│   ├── components/
│   │   ├── stats-card.tsx
│   │   └── chart-widget.tsx
│   ├── schemas/
│   │   └── dashboard-filters-schema.ts
│   └── layout.tsx
└── profile/
    ├── views/
    │   ├── profile-view.tsx
    │   └── settings-view.tsx
    ├── components/
    │   ├── avatar-upload.tsx
    │   └── profile-form.tsx
    ├── schemas/
    │   └── profile-schema.ts
    └── layout.tsx
```

### Shared Components Structure

```
apps/web/src/components/
├── ui/                    # Basic UI components (if not in packages/ui)
│   ├── custom-button.tsx
│   └── custom-input.tsx
├── shared/                # Business logic components
│   ├── user-avatar.tsx
│   ├── currency-display.tsx
│   └── transaction-list.tsx
└── layout/                # Layout components
    ├── header.tsx
    ├── footer.tsx
    └── sidebar.tsx
```

### Native Module Structure

```
apps/native/src/modules/
├── transactions/
│   ├── views/
│   │   ├── transaction-list-view.tsx
│   │   └── transaction-detail-view.tsx
│   ├── components/
│   │   ├── transaction-card.tsx
│   │   └── transaction-filter.tsx
│   ├── schemas/
│   │   └── transaction-schema.ts
│   └── hooks/
│       └── use-transactions.ts
└── wallet/
    ├── views/
    │   ├── wallet-view.tsx
    │   └── add-funds-view.tsx
    ├── components/
    │   ├── balance-card.tsx
    │   └── payment-method.tsx
    └── schemas/
        └── wallet-schema.ts
```

### File Naming Conventions

```tsx
// ✅ CORRECT - kebab-case for files
transaction - list - view.tsx;
user - profile - schema.ts;
currency - display.tsx;

// ❌ WRONG - PascalCase or camelCase for files
TransactionListView.tsx;
userProfileSchema.ts;
CurrencyDisplay.tsx;
```

### Component Export Conventions

```tsx
// ✅ CORRECT - Named exports with PascalCase
export function TransactionListView() {}
export function UserAvatar() {}

// ❌ WRONG - Default exports (harder to refactor)
export default function TransactionListView() {}
```

### Zod Schema Pattern

All form validations and data validations should use Zod schemas:

```tsx
// modules/auth/schemas/login-schema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

```tsx
// modules/auth/views/login-view.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas/login-schema";

export function LoginView() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    // Handle login
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>
  );
}
```

### Reusability Principles

1. **DRY (Don't Repeat Yourself)**: If you use a pattern more than twice, create a shared component
2. **Single Responsibility**: Each component should do one thing well
3. **Composition over Inheritance**: Build complex UIs from simple components
4. **Props over Variants**: Use props for flexibility, variants for common patterns

```tsx
// ✅ CORRECT - Reusable component
export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <HugeiconsIcon
            icon={icon}
            className="w-4 h-4 text-muted-foreground"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </CardContent>
    </Card>
  );
}

// Usage
<StatCard
  title={t("totalUsers")}
  value="10,234"
  icon={UserCircleIcon}
  trend="+12% from last month"
/>;
```

---

## Animation & Motion

### Web: Framer Motion

Use Framer Motion for web animations:

```tsx
import { motion } from "framer-motion";

// Fade in on mount
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  <Content />
</motion.div>

// Staggered children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } }
  }}
>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      <Item {...item} />
    </motion.div>
  ))}
</motion.div>

// Hover effects
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
>
  Click me
</motion.button>
```

### Native: Reanimated 4

Use React Native Reanimated for native animations:

```tsx
import Animated, {
  FadeInDown,
  FadeInRight,
  SlideInLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

// Entering animations
<Animated.View entering={FadeInDown.delay(100)}>
  <Content />
</Animated.View>;

// Staggered list
{
  items.map((item, index) => (
    <Animated.View key={item.id} entering={FadeInDown.delay(index * 100)}>
      <Item {...item} />
    </Animated.View>
  ));
}

// Interactive animations
const scale = useSharedValue(1);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
  scale.value = withSpring(0.95);
};

const handlePressOut = () => {
  scale.value = withSpring(1);
};

<Animated.View style={animatedStyle}>
  <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
    <Content />
  </Pressable>
</Animated.View>;
```

### Animation Timing

```tsx
// Duration guidelines
duration: 0.2; // Quick interactions (hover, press)
duration: 0.4; // Standard transitions
duration: 0.6; // Page transitions
duration: 0.8; // Hero animations

// Easing
ease: [0.22, 1, 0.36, 1]; // Smooth ease-out (web)
type: "spring"; // Natural spring (native)
```

---

## Localization

### Using Translations (Web)

```tsx
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("namespace");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </div>
  );
}
```

### Using Translations (Native)

**Location**: `apps/native/localization/`

The native app uses `i18n-js` with `expo-localization` for internationalization.

#### File Structure

```
apps/native/localization/
├── i18n.ts                    # i18n instance configuration
├── hooks/
│   └── use-localization.ts    # Localization hook
└── translations/
    ├── auth.ts                # Auth-related translations
    ├── common.ts              # Common translations
    ├── home.ts                # Home screen translations
    └── [feature].ts           # Feature-specific translations
```

#### Translation File Pattern

Each translation file should export an object with language keys:

```tsx
// localization/translations/auth.ts
export const auth = {
  en: {
    signIn: {
      title: "Sign In",
      subtitle: "Welcome back",
      emailLabel: "Email",
      passwordLabel: "Password",
      submitButton: "Sign In",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      signUpLink: "Sign Up",
    },
    signUp: {
      title: "Create Account",
      subtitle: "Get started with BE-NTC",
      nameLabel: "Full Name",
      emailLabel: "Email",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm Password",
      submitButton: "Sign Up",
      hasAccount: "Already have an account?",
      signInLink: "Sign In",
    },
  },
  fr: {
    signIn: {
      title: "Se connecter",
      subtitle: "Bon retour",
      emailLabel: "E-mail",
      passwordLabel: "Mot de passe",
      submitButton: "Se connecter",
      forgotPassword: "Mot de passe oublié?",
      noAccount: "Pas de compte?",
      signUpLink: "S'inscrire",
    },
    signUp: {
      title: "Créer un compte",
      subtitle: "Commencez avec BE-NTC",
      nameLabel: "Nom complet",
      emailLabel: "E-mail",
      passwordLabel: "Mot de passe",
      confirmPasswordLabel: "Confirmer le mot de passe",
      submitButton: "S'inscrire",
      hasAccount: "Vous avez déjà un compte?",
      signInLink: "Se connecter",
    },
  },
};
```

#### i18n Configuration

```tsx
// localization/i18n.ts
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { auth } from "./translations/auth";
import { common } from "./translations/common";
import { home } from "./translations/home";

// Create i18n instance
export const i18n = new I18n({
  en: {
    auth: auth.en,
    common: common.en,
    home: home.en,
  },
  fr: {
    auth: auth.fr,
    common: common.fr,
    home: home.fr,
  },
});

// Set locale from device settings
i18n.locale = Localization.getLocales()[0]?.languageCode || "en";
i18n.enableFallback = true;
i18n.defaultLocale = "en";
```

#### Localization Hook

```tsx
// localization/hooks/use-localization.ts
import * as Localization from "expo-localization";
import { useCallback, useState } from "react";
import { i18n } from "../i18n";

type SupportedLocale = "en" | "fr";

export function useLocalization() {
  const [locale, setLocaleState] = useState<SupportedLocale>(
    (i18n.locale.split("-")[0] as SupportedLocale) || "en"
  );

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
  }, []);

  const t = useCallback((key: string, options?: any) => {
    return i18n.t(key, options);
  }, []);

  const getSystemLocale = useCallback(() => {
    return (
      (Localization.getLocales()[0]?.languageCode?.split(
        "-"
      )[0] as SupportedLocale) || "en"
    );
  }, []);

  return {
    locale,
    setLocale,
    t,
    getSystemLocale,
    supportedLocales: ["en", "fr"] as const,
  };
}
```

#### Usage in Components

```tsx
import { useLocalization } from "@/localization/hooks/use-localization";
import { View, Text } from "react-native";

export function SignInScreen() {
  const { t } = useLocalization();

  return (
    <View>
      <Text>{t("auth.signIn.title")}</Text>
      <Text>{t("auth.signIn.subtitle")}</Text>
    </View>
  );
}
```

#### Language Switcher

```tsx
import { useLocalization } from "@/localization/hooks/use-localization";
import { Button } from "heroui-native";

export function LanguageSwitcher() {
  const { locale, setLocale, supportedLocales } = useLocalization();

  return (
    <View className="flex-row gap-2">
      {supportedLocales.map((lang) => (
        <Button
          key={lang}
          variant={locale === lang ? "solid" : "outline"}
          color="primary"
          onPress={() => setLocale(lang)}
        >
          {lang.toUpperCase()}
        </Button>
      ))}
    </View>
  );
}
```

### Translation Key Structure

```tsx
// ✅ CORRECT - Hierarchical structure
t("auth.signIn.title");
t("auth.signIn.emailLabel");
t("home.sections.hero.title");
t("common.buttons.save");
t("common.buttons.cancel");

// ❌ WRONG - Flat structure
t("signInTitle");
t("emailLabel");
t("heroTitle");
```

### Translation Organization by Feature

Organize translations by feature/module for better maintainability:

```
translations/
├── auth.ts          # Authentication screens
├── common.ts        # Shared/common translations
├── home.ts          # Home screen
├── profile.ts       # Profile screens
├── transactions.ts  # Transaction screens
└── settings.ts      # Settings screens
```

### Dynamic Content

```tsx
// In translation file
{
  "welcome": "Welcome, {{name}}!",
  "itemsCount": "You have {{count}} items"
}

// In component
t("welcome", { name: userName })
t("itemsCount", { count: items.length })
```

---

## Accessibility

### Semantic HTML

```tsx
// ✅ CORRECT - Semantic elements
<header>
  <nav>
    <a href="#main">Skip to content</a>
  </nav>
</header>
<main id="main">
  <article>
    <h1>Title</h1>
    <section>
      <h2>Section</h2>
    </section>
  </article>
</main>
<footer>
  <p>© 2026</p>
</footer>

// ❌ WRONG - Div soup
<div className="header">
  <div className="nav">
    <div className="link">Skip to content</div>
  </div>
</div>
```

### ARIA Labels

```tsx
// Icon buttons
<Button size="icon" aria-label={t("close")}>
  <HugeiconsIcon icon={CloseIcon} className="w-5 h-5" />
</Button>

// Form inputs
<Label htmlFor="email">{t("email")}</Label>
<Input
  id="email"
  type="email"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <p id="email-error" className="text-destructive text-sm">
    {errors.email.message}
  </p>
)}
```

### Focus Management

```tsx
// Focus visible styles (automatic via globals.css)
:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

// Custom focus styles
<button className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
  Click me
</button>
```

### Touch Targets (Native)

```tsx
// Minimum 44pt touch targets
<Pressable
  className="min-h-[44px] min-w-[44px] flex items-center justify-center"
  onPress={handlePress}
>
  <HugeiconsIcon icon={MenuIcon} size={24} />
</Pressable>
```

### Text Truncation

```tsx
// Web
<p className="truncate max-w-xs">
  {longText}
</p>

// Native
<AppText numberOfLines={2} className="...">
  {longText}
</AppText>
```

---

## Platform-Specific Guidelines

### Web (Next.js)

#### Import Patterns

```tsx
// UI components from packages/ui
import { Button } from "@be-ntc/ui/components/button";
import { Card, CardHeader, CardTitle } from "@be-ntc/ui/components/card";
import { Input } from "@be-ntc/ui/components/input";

// Icons
import { HugeiconsIcon } from "@hugeicons/react";
import { MenuIcon, CloseIcon } from "@hugeicons/core-free-icons";

// Utilities
import { cn } from "@be-ntc/ui/lib/utils";

// Localization
import { useTranslations } from "next-intl";

// Animation
import { motion } from "framer-motion";
```

#### Server vs Client Components

```tsx
// Server component (default)
export default async function Page() {
  const data = await fetchData();
  return <View data={data} />;
}

// Client component (use "use client" directive)
("use client");

import { useState } from "react";

export function InteractiveComponent() {
  const [state, setState] = useState(false);
  return <Button onClick={() => setState(!state)} />;
}
```

#### Metadata

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title",
  description: "Page description",
};
```

### Native (React Native / Expo)

#### Import Patterns

```tsx
// HeroUI components
import { Button, Card, Chip, Avatar } from "heroui-native";
import { useThemeColor } from "heroui-native";

// Custom components
import { StyledHugeIcon } from "@/src/components/ui/styled-huge-icon";
import { AppText } from "@/src/components/ui/app-text";

// Icons
import { HugeiconsIcon } from "@hugeicons/react-native";
import { MenuIcon } from "@hugeicons/core-free-icons";

// Styling
import { withUniwind, useCSSVariable } from "uniwind";

// Lists
import { LegendList } from "@legendapp/list";

// Animation
import Animated, { FadeInDown } from "react-native-reanimated";

// Localization
import { useLocalization } from "@/src/localization/hooks/use-localization";

// Haptics
import { triggerHaptic, triggerHapticSoft } from "@/src/lib/haptics";
```

#### Styling with uniwind

```tsx
// Use className for Tailwind-style classes
<View className="flex-1 bg-background p-4">
  <AppText className="text-foreground text-lg font-medium">
    {t("title")}
  </AppText>
</View>

// Icons with semantic colors
<StyledHugeIcon
  icon={SearchIcon}
  size={20}
  className="text-foreground"
/>

// Dark mode support (automatic)
<View className="bg-card border border-border">
  <AppText className="text-card-foreground">
    Content
  </AppText>
</View>
```

#### Lists with LegendList

```tsx
import { LegendList } from "@legendapp/list";

<LegendList
  data={items}
  renderItem={({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <ItemComponent {...item} />
    </Animated.View>
  )}
  keyExtractor={(item) => item.id}
  horizontal={false}
  showsVerticalScrollIndicator={false}
  recycleItems
  contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
/>;
```

#### Haptic Feedback

```tsx
import { triggerHaptic, triggerHapticSoft } from "@/src/lib/haptics";

// Standard interactions
<Button
  onPress={() => {
    triggerHaptic();
    router.push("/details");
  }}
>
  {t("viewDetails")}
</Button>;

// Data loading feedback (iOS only)
React.useEffect(() => {
  if (!isLoading && data) {
    triggerHapticSoft();
  }
}, [isLoading, data]);
```

#### Loading States

```tsx
import { Spinner, useThemeColor } from "heroui-native";
import { FadeIn } from "react-native-reanimated";

const accentForeground = useThemeColor("accent-foreground");

{
  isLoading ? (
    <Spinner entering={FadeIn.delay(50)} color={accentForeground} />
  ) : (
    <Content />
  );
}
```

---

## Icon System

The project uses **Hugeicons** for all icons across web and native platforms.

> [!IMPORTANT] > **NEVER USE EMOJIS** for UI elements, labels, or feature indicators. Always use the appropriate icon from the Hugeicons library. This ensures a professional, consistent premium aesthetic and better accessibility.

#### Web Icons

```tsx
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MenuIcon,
  CloseIcon,
  SearchIcon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";

<HugeiconsIcon
  icon={MenuIcon}
  className="w-5 h-5 text-foreground"
  strokeWidth={2}
/>;
```

#### Native Icons

```tsx
import { HugeiconsIcon } from "@hugeicons/react-native";
import { MenuIcon } from "@hugeicons/core-free-icons";
import { StyledHugeIcon } from "@/src/components/ui/styled-huge-icon";

// Standard usage
<HugeiconsIcon
  icon={MenuIcon}
  size={24}
  color="#000"
/>

// With semantic colors (preferred)
<StyledHugeIcon
  icon={MenuIcon}
  size={24}
  className="text-foreground"
/>
```

#### Icon Sizes

```tsx
size={16}  // xs - Small inline icons
size={20}  // sm - Standard inline icons
size={24}  // md - Default size
size={32}  // lg - Large icons
size={48}  // xl - Hero icons
```

---

## Best Practices Summary

### ✅ DO

- Use semantic color tokens (`primary`, `secondary`, `accent`, `destructive`)
- Check `packages/ui` and `apps/native/components/docs/components` before creating components
- Organize code by feature modules with views, schemas, and components
- Use Zod for all form and data validation
- Support dark mode automatically through semantic colors
- Use hierarchical translation keys
- Provide ARIA labels for interactive elements
- Use Framer Motion (web) and Reanimated (native) for animations
- Use LegendList for performant native lists
- Trigger haptic feedback for interactions (native)
- Export components with named exports

### ❌ DON'T

- Use hardcoded color tokens (`text-red-500`, `bg-blue-600`)
- Create new components without checking existing libraries
- Organize by technical layers (all components in one folder)
- Use manual dark mode classes (`dark:bg-gray-900`)
- Use flat translation key structures
- Use default exports
- Create div soup - use semantic HTML
- Forget accessibility attributes

---

## Quick Reference

### Color Tokens

```
primary, secondary, accent, destructive
background, foreground, card, popover, muted
border, input, ring
```

### Component Libraries

```
Web: packages/ui/src/components/
Native: apps/native/components/docs/components/
```

### Animation Libraries

```
Web: framer-motion
Native: react-native-reanimated
```

### Icon Library

```
@hugeicons/react (web)
@hugeicons/react-native (native)
@hugeicons/core-free-icons (icon definitions)
```

### Localization

```
Web: next-intl (useTranslations)
Native: custom hook (useLocalization)
```

---

## Example: Complete Feature Module

```tsx
// modules/transactions/schemas/transaction-schema.ts
import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(3, "Description too short"),
  category: z.enum(["food", "transport", "entertainment"]),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
```

```tsx
// modules/transactions/components/transaction-card.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@be-ntc/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon } from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl";

interface TransactionCardProps {
  amount: number;
  description: string;
  category: string;
  date: string;
}

export function TransactionCard({
  amount,
  description,
  category,
  date,
}: TransactionCardProps) {
  const t = useTranslations("transactions");

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{description}</CardTitle>
          <HugeiconsIcon
            icon={CreditCardIcon}
            className="w-5 h-5 text-muted-foreground"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t(`categories.${category}`)}
          </span>
          <span className="text-lg font-semibold text-foreground">
            ${amount.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{date}</p>
      </CardContent>
    </Card>
  );
}
```

```tsx
// modules/transactions/views/transaction-list-view.tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { TransactionCard } from "../components/transaction-card";

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
        {transactions.map((tx, i) => (
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

**Last Updated**: 2026-01-06  
**Version**: 1.0.0  
**Maintained by**: BE-NTC Development Team
