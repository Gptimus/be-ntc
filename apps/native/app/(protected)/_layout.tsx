import { FullScreenLoading } from "@/components/full-screen-loading";
import { ErrorState } from "@/components/ui/error-state";
import { useLocalization } from "@/localization/hooks/use-localization";
import { api } from "@be-ntc/backend/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery as tanstackUseQuery } from "@tanstack/react-query";
import { useConvexAuth } from "convex/react";
import { Redirect, Slot, useSegments } from "expo-router";
import React from "react";

function ProtectedLayout() {
  const { t } = useLocalization();
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);
  const segments = useSegments();

  const { isAuthenticated, isLoading } = useConvexAuth();

  console.log("ProtectedLayout", { isAuthenticated, isLoading });

  // Load user profile to check if configured
  const {
    data: userProfile,
    isPending: isLoadingProfile,
    error,
    refetch,
  } = tanstackUseQuery(convexQuery(api.userProfiles.getUserProfile));

  React.useEffect(() => {
    if (!isLoading) {
      setHasLoadedOnce(true);
    }
  }, [isLoading]);

  //const themeColorForeground = useThemeColor("foreground");
  //const themeColorBackground = useThemeColor("background");

  //const renderThemeToggle = useCallback(() => <ThemeToggle />, []);

  // Show loading spinner ONLY on the initial load to avoid background-to-foreground flicker
  // Also wait for profile check to avoid premature redirect loop
  if ((isLoading && !hasLoadedOnce) || (isAuthenticated && isLoadingProfile)) {
    return (
      <FullScreenLoading
        title={t("common.loading.auth.title")}
        subtitle={t("common.loading.auth.subtitle")}
      />
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(guest)" />;
  }

  // Handle Error State
  if (error) {
    return <ErrorState retry={refetch} />;
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

  // Check if we are already in the onboarding flow
  const inOnboarding = segments.some((segment) => segment === "onboarding");

  // Determine where to redirect based on completeness
  if (
    !isIdentityComplete &&
    segments[segments.length - 1] !== "step-1-identity"
  ) {
    return <Redirect href="/(protected)/onboarding/step-1-identity" />;
  }

  if (
    isIdentityComplete &&
    !isLocationComplete &&
    segments[segments.length - 1] !== "step-2-location"
  ) {
    return <Redirect href="/(protected)/onboarding/step-2-location" />;
  }

  if (
    isIdentityComplete &&
    isLocationComplete &&
    !isPreferencesComplete &&
    segments[segments.length - 1] !== "step-3-preferences"
  ) {
    return <Redirect href="/(protected)/onboarding/step-3-preferences" />;
  }

  // If complete and in onboarding, go to tabs.
  // Allow staying on Review (step 4) if desired, but user request implies smart redirect.
  // "redirect to the current step based to the filled" implies if I filled everything, I should go to app?
  // But maybe I want to review?
  // Let's protect against re-entering previous steps if complete, but Review is "future".
  // Actually, if everything is complete, we should let them go to the App unless they are explicitly review ing (which they can't easily do if we redirect them out).
  // But standard onboarding usually auto-redirects to home once done.
  if (
    isProfileComplete &&
    inOnboarding &&
    segments[segments.length - 1] !== "step-4-review"
  ) {
    return <Redirect href="/(protected)/(tabs)" />;
  }

  return <Slot />;
}

export default ProtectedLayout;
