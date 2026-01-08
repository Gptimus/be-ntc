import React from "react";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, TextField, Spinner } from "heroui-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalization } from "@/localization/hooks/use-localization";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { useSession } from "@/lib/auth-client";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { FormImagePicker } from "@/components/ui/form-image-picker";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { View } from "react-native";
import { FormInlineRadio } from "@/components/ui/form-inline-radio";
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

const createIdentitySchema = (t: (key: string) => string) =>
  z.object({
    displayName: z.string().min(2, t("common.validation.name_required")),
    gender: z.enum(["MALE", "FEMALE"], {
      error: t("common.validation.gender_required"),
    }),
    dateOfBirth: z.date({
      error: t("common.validation.dob_required"),
    }),
    idCardImageUri: z
      .string({
        error: t("common.validation.idCard_required"),
      })
      .min(1, t("common.validation.idCard_required")),
    profileImageUri: z
      .string({
        error: t("common.validation.profileImage_required"),
      })
      .min(1, t("common.validation.profileImage_required")),
  });

type IdentityFormData = z.infer<ReturnType<typeof createIdentitySchema>>;

export default function Step1Identity() {
  const router = useRouter();
  const { t } = useLocalization();
  const { data: session } = useSession();
  const { isLight } = useAppTheme();

  const {
    data: userProfile,
    isPending: isLoadingProfile,
    error,
    refetch,
  } = useQuery(convexQuery(api.userProfiles.getUserProfile));

  const updateUserProfile = useMutation(api.userProfiles.updateUserProfile);

  const schema = createIdentitySchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IdentityFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: "",
      gender: undefined,
      dateOfBirth: undefined,
      idCardImageUri: "",
      profileImageUri: "",
    },
  });

  // Effect to reset form when userProfile is loaded
  React.useEffect(() => {
    if (userProfile) {
      reset({
        displayName: userProfile.displayName || session?.user?.name || "",
        gender: userProfile.gender as "MALE" | "FEMALE" | undefined,
        dateOfBirth: userProfile.dateOfBirth
          ? new Date(userProfile.dateOfBirth)
          : undefined,
        idCardImageUri: userProfile.idCardImageUrl || "",
        profileImageUri: session?.user?.image || "",
      });
    } else if (session?.user?.name) {
      reset({
        displayName: session.user.name,
      });
    }
  }, [userProfile, session, reset]);

  const onSubmit = async (data: IdentityFormData) => {
    try {
      triggerHaptic();
      await updateUserProfile({
        displayName: data.displayName,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth.toISOString(),
        idCardImageUrl: data.idCardImageUri,
        profileImage: data.profileImageUri,
      });
      triggerHapticSuccess();
      router.push("/(protected)/onboarding/step-2-location");
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
      }}
      contentContainerClassName="px-4"
    >
      <PageHeader
        title={t("common.onboarding.step1.title")}
        description={t("common.onboarding.step1.description")}
        showBackButton={false}
      />
      <View className="gap-4">
        <View className="flex-row gap-4">
          <View className="flex-1">
            <FormImagePicker
              control={control}
              name="profileImageUri"
              label={t("common.onboarding.profileImage")}
              error={errors.profileImageUri?.message}
            />
          </View>
          <View className="flex-1">
            <FormImagePicker
              control={control}
              name="idCardImageUri"
              label={t("common.onboarding.idCardImage")}
              error={errors.idCardImageUri?.message}
            />
          </View>
        </View>

        <View>
          <Controller
            control={control}
            name="displayName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField isInvalid={!!errors.displayName}>
                <TextField.Label
                  className="text-foreground"
                  style={{ fontFamily: "Outfit_500Medium" }}
                >
                  {t("common.onboarding.displayName")}
                </TextField.Label>
                <TextField.Input
                  placeholder={t("common.onboarding.displayNamePlaceholder")}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  className="rounded-xl h-12"
                  style={{ fontFamily: "Outfit_400Regular" }}
                />
                <TextField.ErrorMessage className="font-sans">
                  {errors.displayName?.message}
                </TextField.ErrorMessage>
              </TextField>
            )}
          />
        </View>

        <FormDatePicker
          control={control}
          name="dateOfBirth"
          label={t("common.onboarding.dateOfBirth")}
          error={errors.dateOfBirth?.message as string}
        />

        <FormInlineRadio
          control={control}
          name="gender"
          label={t("common.onboarding.gender")}
          error={errors.gender?.message}
          options={[
            { label: t("common.common.male"), value: "MALE" },
            { label: t("common.common.female"), value: "FEMALE" },
          ]}
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
