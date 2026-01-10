import { Redirect, Stack, useSegments } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@be-ntc/backend/convex/_generated/api";
import { FullScreenLoading } from "@/components/full-screen-loading";
import { useLocalization } from "@/localization/hooks/use-localization";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingLayout() {
  const { t } = useLocalization();
  const segments = useSegments();
  const backgroundColor = useThemeColor("background");
  const headerColor = useThemeColor("foreground");

  const { data: userProfile, isPending: isLoadingProfile } = useQuery(
    convexQuery(api.userProfiles.getUserProfile)
  );

  if (isLoadingProfile && !userProfile) {
    return (
      <FullScreenLoading
        title={t("common.loading.auth.title")}
        subtitle={t("common.loading.auth.subtitle")}
      />
    );
  }

  const isIdentityComplete =
    userProfile &&
    userProfile.displayName &&
    userProfile.gender &&
    userProfile.dateOfBirth;

  const isLocationComplete =
    userProfile &&
    userProfile.country &&
    userProfile.city &&
    userProfile.address &&
    userProfile.profileType;

  const isPreferencesComplete =
    userProfile &&
    userProfile.preferredLanguage &&
    userProfile.preferredCurrency;

  const isProfileComplete =
    isIdentityComplete && isLocationComplete && isPreferencesComplete;

  // If complete and not on review page, redirect to tabs
  if (isProfileComplete && segments[segments.length - 1] !== "step-4-review") {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: insets.top,
          backgroundColor,
          zIndex: 1000,
        }}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor },
          headerTintColor: headerColor,
          headerTitleStyle: {
            fontFamily: "Outfit_600SemiBold",
          },
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Screen name="step-1-identity" />
        <Stack.Screen name="step-2-location" />
        <Stack.Screen name="step-3-preferences" />
        <Stack.Screen name="step-4-review" />
      </Stack>
    </View>
  );
}
