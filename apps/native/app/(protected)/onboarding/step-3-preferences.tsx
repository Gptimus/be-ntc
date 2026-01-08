import React from "react";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Spinner, useThemeColor } from "heroui-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalization } from "@/localization/hooks/use-localization";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useAppTheme } from "@/contexts/app-theme-context";
import { FormInlineRadio } from "@/components/ui/form-inline-radio";
import { useMutation } from "convex/react";
import { api } from "@be-ntc/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { FullScreenLoading } from "@/components/full-screen-loading";
import { ErrorState } from "@/components/ui/error-state";
import { PageHeader } from "@/components/ui/page-header";
import {
  triggerHaptic,
  triggerHapticError,
  triggerHapticSuccess,
} from "@/lib/haptics";

const createPreferencesSchema = (t: (key: string) => string) =>
  z.object({
    preferredLanguage: z
      .string()
      .min(1, t("common.validation.language_required")),
    preferredCurrency: z.enum(["USD", "CDF"], {
      error: t("common.validation.currency_required"),
    }),
  });

type PreferencesFormData = z.infer<ReturnType<typeof createPreferencesSchema>>;

export default function Step3Preferences() {
  const router = useRouter();
  const { t } = useLocalization();
  const { isLight } = useAppTheme();

  const {
    data: userProfile,
    isPending: isLoadingProfile,
    error,
    refetch,
  } = useQuery(convexQuery(api.userProfiles.getUserProfile));

  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);

  const schema = createPreferencesSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      preferredLanguage: "en",
      preferredCurrency: "USD",
    },
  });

  React.useEffect(() => {
    if (userProfile) {
      reset({
        preferredLanguage: userProfile.preferredLanguage || "en",
        preferredCurrency:
          (userProfile.preferredCurrency as "USD" | "CDF") || "USD",
      });
    }
  }, [userProfile, reset]);

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      triggerHaptic();
      await updateUserProfile(data);
      triggerHapticSuccess();
      router.push("/(protected)/onboarding/step-4-review");
    } catch (err) {
      triggerHapticError();
      console.error("Error updating profile:", err);
    }
  };

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
  const backgroundColor = useThemeColor("background");

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      bottomOffset={20}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        width: "100%",
        paddingTop: insets.top + 20,
      }}
      contentContainerClassName="px-4"
    >
      <PageHeader
        title={t("common.onboarding.step3.title")}
        description={t("common.onboarding.step3.description")}
      />
      <FormInlineRadio
        control={control}
        name="preferredLanguage"
        label={t("common.onboarding.preferredLanguage")}
        error={errors.preferredLanguage?.message}
        options={[
          { label: t("common.onboarding.languages.en"), value: "en" },
          { label: t("common.onboarding.languages.fr"), value: "fr" },
        ]}
      />

      <FormInlineRadio
        control={control}
        name="preferredCurrency"
        label={t("common.onboarding.preferredCurrency")}
        error={errors.preferredCurrency?.message}
        options={[
          { label: "USD ($)", value: "USD" },
          { label: "CDF (FC)", value: "CDF" },
        ]}
      />

      <Animated.View entering={FadeInDown.delay(200)}>
        <Button
          onPress={handleSubmit(onSubmit)}
          size="lg"
          className="rounded-2xl"
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
            <Spinner
              entering={FadeIn.delay(50)}
              color={isLight ? "black" : "white"}
            />
          ) : (
            <Button.Label>{t("common.common.next")}</Button.Label>
          )}
        </Button>
      </Animated.View>
    </KeyboardAwareScrollView>
  );
}
