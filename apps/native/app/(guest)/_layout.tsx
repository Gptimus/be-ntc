import { useConvexAuth } from "convex/react";
import { Redirect, Stack } from "expo-router";
import { useThemeColor } from "heroui-native";

import { FullScreenLoading } from "@/components/full-screen-loading";

function GuestLayout() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const themeColorForeground = useThemeColor("foreground");
  const themeColorBackground = useThemeColor("background");

  // Show loading spinner while checking auth
  if (isLoading) {
    return <FullScreenLoading />;
  }

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Redirect href="/(protected)" />;
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
