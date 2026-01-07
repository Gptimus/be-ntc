import { storageHelpers } from "@/lib/storage";
import { useConvexAuth } from "convex/react";
import { Redirect, Stack, useSegments } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { useEffect, useState } from "react";

import { FullScreenLoading } from "@/components/full-screen-loading";

function GuestLayout() {
  const { t } = useLocalization();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const segments = useSegments();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (!isLoading && hasSeenOnboarding !== null) {
      setHasLoadedOnce(true);
    }
  }, [isLoading, hasSeenOnboarding]);

  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  // Check onboarding status on mount
  useEffect(() => {
    const checkOnboarding = () => {
      const seen = storageHelpers.hasSeenOnboarding();
      setHasSeenOnboarding(seen);
    };
    checkOnboarding();
  }, []);

  // Show loading spinner ONLY on the initial load to avoid background-to-foreground flicker
  if ((isLoading || hasSeenOnboarding === null) && !hasLoadedOnce) {
    return (
      <FullScreenLoading
        title={t("common.loading.init.title")}
        subtitle={t("common.loading.init.subtitle")}
      />
    );
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(protected)" />;
  }

  // Redirect to sign-in if onboarding was already seen and we are on the index
  const isAtOnboarding =
    segments.length === 1 || segments[segments.length - 1] === "(guest)";
  if (hasSeenOnboarding && isAtOnboarding) {
    return <Redirect href="/(guest)/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: themeColorForeground,
        headerStyle: { backgroundColor: themeColorBackground },
        headerTitleStyle: {
          fontWeight: "600",
          color: themeColorForeground,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Get Started",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="sign-in"
        options={{
          headerTitle: "Sign In",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="verify-email"
        options={{
          headerTitle: "Verify Email",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="email-input"
        options={{
          headerTitle: "Enter your email",
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="auth-options"
        options={{
          headerTitle: "Choose your authentication method",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default GuestLayout;
