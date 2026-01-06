import { storageHelpers } from "@/lib/storage";
import { useConvexAuth } from "convex/react";
import { Redirect, Stack, useSegments } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useEffect, useState } from "react";

import { FullScreenLoading } from "@/components/full-screen-loading";

function GuestLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const segments = useSegments();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );
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

  // Show loading spinner while checking auth or onboarding
  if (isLoading || hasSeenOnboarding === null) {
    return <FullScreenLoading />;
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
        name="sign-up"
        options={{
          headerTitle: "Sign Up",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default GuestLayout;
