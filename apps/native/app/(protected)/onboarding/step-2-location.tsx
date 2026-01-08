import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Spinner } from "heroui-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalization } from "@/localization/hooks/use-localization";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { FormInlineRadio } from "@/components/ui/form-inline-radio";
import { FormTextField } from "@/components/ui/form-text-field";
import { useAppTheme } from "@/contexts/app-theme-context";
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

const createLocationSchema = (t: (key: string) => string) =>
  z.object({
    profileType: z.enum(["individual", "enterprise"], {
      error: t("common.validation.profileType_required"),
    }),
    country: z.string().min(1, t("common.validation.country_required")),
    city: z.string().min(1, t("common.validation.city_required")),
    address: z.string().min(5, t("common.validation.address_required")),
  });

type LocationFormData = z.infer<ReturnType<typeof createLocationSchema>>;

export default function Step2Location() {
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

  const schema = createLocationSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LocationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      profileType: undefined,
      country: "",
      city: "",
      address: "",
    },
  });

  React.useEffect(() => {
    if (userProfile) {
      reset({
        profileType:
          (userProfile.profileType as "individual" | "enterprise") || undefined,
        country: userProfile.country || "",
        city: userProfile.city || "",
        address: userProfile.address || "",
      });
    }
  }, [userProfile, reset]);

  const onSubmit = async (data: LocationFormData) => {
    try {
      triggerHaptic();
      await updateUserProfile(data);
      triggerHapticSuccess();
      router.push("/(protected)/onboarding/step-3-preferences");
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
        title={t("common.onboarding.step2.title")}
        description={t("common.onboarding.step2.description")}
      />
      <View className="gap-4">
        <FormInlineRadio
          control={control}
          name="profileType"
          label={t("common.onboarding.profileType")}
          error={errors.profileType?.message}
          options={[
            { label: t("common.onboarding.individual"), value: "individual" },
            { label: t("common.onboarding.enterprise"), value: "enterprise" },
          ]}
        />

        <FormTextField
          control={control}
          name="country"
          label={t("common.onboarding.country")}
          placeholder={t("common.onboarding.countryPlaceholder")}
          error={errors.country?.message}
        />

        <FormTextField
          control={control}
          name="city"
          label={t("common.onboarding.city")}
          placeholder={t("common.onboarding.cityPlaceholder")}
          error={errors.city?.message}
        />

        <FormTextField
          control={control}
          name="address"
          label={t("common.onboarding.address")}
          placeholder={t("common.onboarding.addressPlaceholder")}
          error={errors.address?.message}
        />

        <Animated.View entering={FadeInDown.delay(200)}>
          <Button
            onPress={handleSubmit(onSubmit)}
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
                {t("common.common.next")}
              </Button.Label>
            )}
          </Button>
        </Animated.View>
      </View>
    </KeyboardAwareScrollView>
  );
}
