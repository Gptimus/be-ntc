import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  TextField,
  RadioGroup,
  Spinner,
  useThemeColor,
} from "heroui-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalization } from "@/localization/hooks/use-localization";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useAppTheme } from "@/contexts/app-theme-context";
import { useMutation } from "convex/react";
import { api } from "@be-ntc/backend/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { FullScreenLoading } from "@/components/full-screen-loading";
import { ErrorState } from "@/components/ui/error-state";
import { PageHeader } from "@/components/ui/page-header";

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
    await updateUserProfile(data);
    router.push("/(protected)/onboarding/step-3-preferences");
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
        title={t("common.onboarding.step2.title")}
        description={t("common.onboarding.step2.description")}
      />
      <View className="mb-6">
        <Controller
          control={control}
          name="profileType"
          render={({ field: { onChange, value } }) => (
            <RadioGroup
              value={value}
              onValueChange={onChange}
              isInvalid={!!errors.profileType}
            >
              <RadioGroup.Item value="individual">
                <RadioGroup.Label>
                  {t("common.onboarding.individual")}
                </RadioGroup.Label>
              </RadioGroup.Item>
              <RadioGroup.Item value="enterprise">
                <RadioGroup.Label>
                  {t("common.onboarding.enterprise")}
                </RadioGroup.Label>
              </RadioGroup.Item>
              {errors.profileType && (
                <RadioGroup.ErrorMessage>
                  {errors.profileType.message}
                </RadioGroup.ErrorMessage>
              )}
            </RadioGroup>
          )}
        />
      </View>

      <View className="mb-6">
        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField isInvalid={!!errors.country}>
              <TextField.Label
                className="text-foreground"
                style={{ fontFamily: "Outfit_500Medium" }}
              >
                {t("common.onboarding.country")}
              </TextField.Label>
              <TextField.Input
                placeholder={t("common.onboarding.countryPlaceholder")}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                className="h-14 rounded-2xl"
                style={{ fontFamily: "Outfit_400Regular" }}
              />
              <TextField.ErrorMessage className="font-sans">
                {errors.country?.message}
              </TextField.ErrorMessage>
            </TextField>
          )}
        />
      </View>

      <View className="mb-6">
        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField isInvalid={!!errors.city}>
              <TextField.Label
                className="text-foreground"
                style={{ fontFamily: "Outfit_500Medium" }}
              >
                {t("common.onboarding.city")}
              </TextField.Label>
              <TextField.Input
                placeholder={t("common.onboarding.cityPlaceholder")}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                className="h-14 rounded-2xl"
                style={{ fontFamily: "Outfit_400Regular" }}
              />
              <TextField.ErrorMessage className="font-sans">
                {errors.city?.message}
              </TextField.ErrorMessage>
            </TextField>
          )}
        />
      </View>

      <View className="mb-8">
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField isInvalid={!!errors.address}>
              <TextField.Label
                className="text-foreground"
                style={{ fontFamily: "Outfit_500Medium" }}
              >
                {t("common.onboarding.address")}
              </TextField.Label>
              <TextField.Input
                placeholder={t("common.onboarding.addressPlaceholder")}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                className="h-14 rounded-2xl"
                style={{ fontFamily: "Outfit_400Regular" }}
              />
              <TextField.ErrorMessage className="font-sans">
                {errors.address?.message}
              </TextField.ErrorMessage>
            </TextField>
          )}
        />
      </View>

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
