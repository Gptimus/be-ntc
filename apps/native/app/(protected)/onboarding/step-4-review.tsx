import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Button, useToast, Card, Spinner } from "heroui-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalization } from "@/localization/hooks/use-localization";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@be-ntc/backend/convex/_generated/api";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useAppTheme } from "@/contexts/app-theme-context";
import { FullScreenLoading } from "@/components/full-screen-loading";
import { ErrorState } from "@/components/ui/error-state";
import {
  triggerHaptic,
  triggerHapticError,
  triggerHapticSuccess,
} from "@/lib/haptics";
import { PageHeader } from "@/components/ui/page-header";

export default function Step4Review() {
  const router = useRouter();
  const { t } = useLocalization();
  const { toast } = useToast();
  const { isLight } = useAppTheme();

  const {
    data: userProfile,
    isPending: isLoadingProfile,
    error,
    refetch,
  } = useQuery(convexQuery(api.userProfiles.getUserProfile));

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    try {
      triggerHaptic();
      setIsSubmitting(true);
      // Simulate a small delay for better UX if needed
      // await new Promise(resolve => setTimeout(resolve, 500));

      // Just redirect to main app, layout will handle access
      triggerHapticSuccess();
      toast.show({
        variant: "success",
        label: t("common.onboarding.success.title"),
        description: t("common.onboarding.success.description"),
      });
      router.replace("/(protected)/(tabs)");
    } catch (error) {
      triggerHapticError();
      console.error("Error submitting onboarding:", error);
      setIsSubmitting(false);
    }
  };

  // Helper to render a row
  const ReviewRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | undefined;
  }) => (
    <View className="flex-row justify-between py-2 border-b border-border/50">
      <Text className="text-muted font-sans-medium">{label}</Text>
      <Text className="text-foreground font-sans">{value || "-"}</Text>
    </View>
  );

  if (isLoadingProfile) {
    return (
      <FullScreenLoading
        title={t("common.loading.auth.title")}
        subtitle={t("common.loading.auth.subtitle")}
      />
    );
  }

  if (error) {
    return <ErrorState retry={refetch} />;
  }

  const insets = useSafeAreaInsets();

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      bottomOffset={20}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        width: "100%",
        paddingTop: insets.top + 10,
        paddingBottom: insets.bottom + 10,
      }}
      contentContainerClassName="px-4"
    >
      <PageHeader
        title={t("common.onboarding.step4.title")}
        description={t("common.onboarding.step4.description")}
      />
      <View className="gap-4">
        <Card className="p-4 bg-content1 rounded-2xl">
          <Text className="text-lg font-heading-medium text-primary mb-2">
            {t("common.onboarding.identity")}
          </Text>
          <ReviewRow
            label={t("common.onboarding.firstName")}
            value={userProfile?.firstName}
          />
          <ReviewRow
            label={t("common.onboarding.lastName")}
            value={userProfile?.lastName}
          />
          <ReviewRow
            label={t("common.onboarding.phone")}
            value={userProfile?.phone}
          />
          <ReviewRow
            label={t("common.onboarding.gender")}
            value={
              userProfile?.gender === "MALE"
                ? t("common.common.male")
                : t("common.common.female")
            }
          />
          <ReviewRow
            label={t("common.onboarding.dateOfBirth")}
            value={
              userProfile?.dateOfBirth
                ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                : undefined
            }
          />
        </Card>

        <Card className="p-4 bg-content1 rounded-2xl">
          <Text className="text-lg font-heading-medium text-primary mb-2">
            {t("common.onboarding.location")}
          </Text>
          <ReviewRow
            label={t("common.onboarding.profileType")}
            value={
              userProfile?.profileType
                ? t(`common.onboarding.${userProfile.profileType}`)
                : undefined
            }
          />
          <ReviewRow
            label={t("common.onboarding.country")}
            value={userProfile?.country}
          />
          <ReviewRow
            label={t("common.onboarding.city")}
            value={userProfile?.city}
          />
          <ReviewRow
            label={t("common.onboarding.address")}
            value={userProfile?.address}
          />
        </Card>

        <Card className="p-4 bg-content1 rounded-2xl">
          <Text className="text-lg font-heading-medium text-primary mb-2">
            {t("common.onboarding.preferences")}
          </Text>
          <ReviewRow
            label={t("common.onboarding.preferredLanguage")}
            value={
              userProfile?.preferredLanguage
                ? t(
                    `common.onboarding.languages.${userProfile.preferredLanguage}`
                  )
                : undefined
            }
          />
          <ReviewRow
            label={t("common.onboarding.preferredCurrency")}
            value={userProfile?.preferredCurrency}
          />
        </Card>

        <Animated.View entering={FadeInDown.delay(200)}>
          <Button
            onPress={handleSubmit}
            size="lg"
            className="mt-4 rounded-2xl"
            isDisabled={isSubmitting}
            pressableFeedbackVariant="ripple"
            pressableFeedbackRippleProps={{
              animation: {
                backgroundColor: { value: isLight ? "white" : "black" },
                opacity: { value: [0, 0.3, 0] },
              },
            }}
          >
            {isSubmitting ? (
              <Spinner entering={FadeIn.delay(50)} color="white" />
            ) : (
              <Button.Label className="text-white">
                {t("common.common.finish")}
              </Button.Label>
            )}
          </Button>
        </Animated.View>
      </View>
    </KeyboardAwareScrollView>
  );
}
