---
description: How to add and manage localization in native app
---

# Native App Localization Workflow

Step-by-step guide for adding translations to the React Native app.

## Overview

The native app uses:

- **i18n-js**: Translation library
- **expo-localization**: Device locale detection
- **Supported Languages**: English (en), French (fr)

**Location**: `apps/native/localization/`

## File Structure

```
apps/native/localization/
├── i18n.ts                    # i18n instance & configuration
├── hooks/
│   └── use-localization.ts    # Localization hook
└── translations/
    ├── auth.ts                # Authentication translations
    ├── common.ts              # Common/shared translations
    ├── home.ts                # Home screen translations
    ├── profile.ts             # Profile translations
    └── [feature].ts           # Add more as needed
```

## Step 1: Create Translation File

When adding a new feature, create a translation file:

```bash
touch apps/native/localization/translations/[feature-name].ts
```

### Translation File Template

```tsx
// localization/translations/[feature-name].ts
export const featureName = {
  en: {
    // English translations
    title: "Feature Title",
    subtitle: "Feature subtitle",
    buttons: {
      save: "Save",
      cancel: "Cancel",
    },
    messages: {
      success: "Success message",
      error: "Error message",
    },
  },
  fr: {
    // French translations
    title: "Titre de la fonctionnalité",
    subtitle: "Sous-titre de la fonctionnalité",
    buttons: {
      save: "Enregistrer",
      cancel: "Annuler",
    },
    messages: {
      success: "Message de succès",
      error: "Message d'erreur",
    },
  },
};
```

## Step 2: Register Translations in i18n

Add your new translations to the i18n instance:

```tsx
// localization/i18n.ts
import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import { auth } from "./translations/auth";
import { common } from "./translations/common";
import { home } from "./translations/home";
import { featureName } from "./translations/feature-name"; // ← Add import

export const i18n = new I18n({
  en: {
    auth: auth.en,
    common: common.en,
    home: home.en,
    featureName: featureName.en, // ← Add to English
  },
  fr: {
    auth: auth.fr,
    common: common.fr,
    home: home.fr,
    featureName: featureName.fr, // ← Add to French
  },
});

i18n.locale = Localization.getLocales()[0]?.languageCode || "en";
i18n.enableFallback = true;
i18n.defaultLocale = "en";
```

## Step 3: Use Translations in Components

### Basic Usage

```tsx
import { useLocalization } from "@/localization/hooks/use-localization";
import { View, Text } from "react-native";

export function MyFeatureScreen() {
  const { t } = useLocalization();

  return (
    <View>
      <Text>{t("featureName.title")}</Text>
      <Text>{t("featureName.subtitle")}</Text>
    </View>
  );
}
```

### With Dynamic Values

```tsx
// In translation file
export const profile = {
  en: {
    welcome: "Welcome, {{name}}!",
    itemsCount: "You have {{count}} items",
  },
  fr: {
    welcome: "Bienvenue, {{name}}!",
    itemsCount: "Vous avez {{count}} éléments",
  },
};

// In component
const { t } = useLocalization();

<Text>{t("profile.welcome", { name: userName })}</Text>
<Text>{t("profile.itemsCount", { count: items.length })}</Text>
```

### With Pluralization

```tsx
// In translation file
export const notifications = {
  en: {
    count: {
      zero: "No notifications",
      one: "1 notification",
      other: "{{count}} notifications",
    },
  },
  fr: {
    count: {
      zero: "Aucune notification",
      one: "1 notification",
      other: "{{count}} notifications",
    },
  },
};

// In component
<Text>{t("notifications.count", { count: notificationCount })}</Text>;
```

## Step 4: Add Language Switcher (Optional)

If you need a language switcher in your app:

```tsx
import { useLocalization } from "@/localization/hooks/use-localization";
import { Button } from "heroui-native";
import { View } from "react-native";

export function LanguageSwitcher() {
  const { locale, setLocale, supportedLocales } = useLocalization();

  return (
    <View className="flex-row gap-2">
      {supportedLocales.map((lang) => (
        <Button
          key={lang}
          variant={locale === lang ? "solid" : "outline"}
          color="primary"
          size="sm"
          onPress={() => setLocale(lang)}
        >
          {lang.toUpperCase()}
        </Button>
      ))}
    </View>
  );
}
```

## Translation Key Naming Conventions

### ✅ Good Structure

```tsx
// Hierarchical, feature-based
t("auth.signIn.title");
t("auth.signIn.emailLabel");
t("auth.signUp.passwordLabel");
t("home.hero.title");
t("home.sections.features.title");
t("profile.settings.privacy.title");
t("common.buttons.save");
t("common.buttons.cancel");
t("common.errors.networkError");
```

### ❌ Bad Structure

```tsx
// Flat, unclear
t("signInTitle");
t("emailLabel");
t("passwordLabel");
t("heroTitle");
```

## Common Translation Categories

### Common Translations (`common.ts`)

```tsx
export const common = {
  en: {
    buttons: {
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      submit: "Submit",
    },
    errors: {
      networkError: "Network error. Please try again.",
      unknownError: "An unknown error occurred.",
      validationError: "Please check your input.",
    },
    loading: {
      default: "Loading...",
      saving: "Saving...",
      deleting: "Deleting...",
    },
  },
  fr: {
    buttons: {
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      confirm: "Confirmer",
      back: "Retour",
      next: "Suivant",
      submit: "Soumettre",
    },
    errors: {
      networkError: "Erreur réseau. Veuillez réessayer.",
      unknownError: "Une erreur inconnue s'est produite.",
      validationError: "Veuillez vérifier votre saisie.",
    },
    loading: {
      default: "Chargement...",
      saving: "Enregistrement...",
      deleting: "Suppression...",
    },
  },
};
```

### Auth Translations (`auth.ts`)

```tsx
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

## Adding a New Language

To add a new language (e.g., Spanish):

1. **Update supported locales**:

```tsx
// localization/hooks/use-localization.ts
type SupportedLocale = "en" | "fr" | "es"; // ← Add "es"

export function useLocalization() {
  // ...
  return {
    // ...
    supportedLocales: ["en", "fr", "es"] as const, // ← Add "es"
  };
}
```

2. **Add translations to each file**:

```tsx
// localization/translations/auth.ts
export const auth = {
  en: {
    /* ... */
  },
  fr: {
    /* ... */
  },
  es: {
    // ← Add Spanish
    signIn: {
      title: "Iniciar sesión",
      subtitle: "Bienvenido de nuevo",
      // ...
    },
  },
};
```

3. **Register in i18n**:

```tsx
// localization/i18n.ts
export const i18n = new I18n({
  en: {
    /* ... */
  },
  fr: {
    /* ... */
  },
  es: {
    // ← Add Spanish
    auth: auth.es,
    common: common.es,
    // ...
  },
});
```

4. **Update app.config.ts**:

```tsx
// app.config.ts
[
  "expo-localization",
  {
    supportedLocales: {
      ios: ["en", "fr", "es"],      // ← Add "es"
      android: ["en", "fr", "es"],  // ← Add "es"
    },
  },
],
```

## Testing Translations

### Manual Testing

1. **Change device language**: Settings → Language & Region
2. **Use language switcher**: If implemented in app
3. **Test with hook**:

```tsx
const { setLocale } = useLocalization();

// Test French
setLocale("fr");

// Test English
setLocale("en");
```

### Missing Translation Fallback

The i18n instance is configured with fallback:

```tsx
i18n.enableFallback = true;
i18n.defaultLocale = "en";
```

If a translation is missing in French, it will fall back to English.

## Best Practices

1. **✅ Always use hierarchical keys**: `auth.signIn.title` not `signInTitle`
2. **✅ Group by feature**: Create separate files for each major feature
3. **✅ Use common translations**: Reuse common buttons, errors, etc.
4. **✅ Keep translations in sync**: When adding English, add French too
5. **✅ Use descriptive keys**: `emailLabel` not `label1`
6. **✅ Test both languages**: Verify translations in both EN and FR
7. **❌ Don't hardcode text**: Always use `t()` for user-facing text
8. **❌ Don't use flat keys**: Avoid `t("title")` without namespace

## Checklist

When adding new translations:

- [ ] Created translation file in `localization/translations/`
- [ ] Added both English and French translations
- [ ] Registered translations in `localization/i18n.ts`
- [ ] Used hierarchical key structure
- [ ] Imported and used `useLocalization` hook in component
- [ ] Tested in both English and French
- [ ] No hardcoded user-facing text remains

## Example: Complete Feature Translation

```tsx
// 1. Create translation file
// localization/translations/transactions.ts
export const transactions = {
  en: {
    list: {
      title: "Transactions",
      empty: "No transactions yet",
      filter: {
        all: "All",
        income: "Income",
        expense: "Expense",
      },
    },
    detail: {
      title: "Transaction Details",
      amount: "Amount",
      date: "Date",
      category: "Category",
      description: "Description",
    },
  },
  fr: {
    list: {
      title: "Transactions",
      empty: "Aucune transaction pour le moment",
      filter: {
        all: "Tout",
        income: "Revenus",
        expense: "Dépenses",
      },
    },
    detail: {
      title: "Détails de la transaction",
      amount: "Montant",
      date: "Date",
      category: "Catégorie",
      description: "Description",
    },
  },
};

// 2. Register in i18n.ts
import { transactions } from "./translations/transactions";

export const i18n = new I18n({
  en: {
    // ...
    transactions: transactions.en,
  },
  fr: {
    // ...
    transactions: transactions.fr,
  },
});

// 3. Use in component
import { useLocalization } from "@/localization/hooks/use-localization";

export function TransactionListScreen() {
  const { t } = useLocalization();

  return (
    <View>
      <Text className="text-2xl font-heading-bold">
        {t("transactions.list.title")}
      </Text>
      {transactions.length === 0 && (
        <Text className="text-muted">{t("transactions.list.empty")}</Text>
      )}
    </View>
  );
}
```

---

**See also:**

- [design-guidelines.md](../design-guidelines.md#localization) - Localization section
- [design-quick-reference.md](../design-quick-reference.md#-localization) - Quick reference
