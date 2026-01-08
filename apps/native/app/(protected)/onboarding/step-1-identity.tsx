import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Spinner } from "heroui-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalization } from "@/localization/hooks/use-localization";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { useSession } from "@/lib/auth-client";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { FormImagePicker } from "@/components/ui/form-image-picker";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { View } from "react-native";
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

const createIdentitySchema = (t: (key: string) => string) =>
  z.object({
    firstName: z.string().min(2, t("common.validation.firstName_required")),
    lastName: z.string().min(2, t("common.validation.lastName_required")),
    phone: z.string().optional(),
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
      firstName: "",
      lastName: "",
      phone: "",
      gender: undefined,
      dateOfBirth: undefined,
      idCardImageUri: "",
      profileImageUri: "",
    },
  });

  const [uploadingFields, setUploadingFields] = useState<
    Record<string, boolean>
  >({});
  const isAnyUploading = Object.values(uploadingFields).some((v) => v);

  const handleProfileImageUploadingChange = useCallback(
    (isUploading: boolean) => {
      setUploadingFields((prev) => {
        if (prev.profileImageUri === isUploading) return prev;
        return { ...prev, profileImageUri: isUploading };
      });
    },
    []
  );

  const handleIdCardImageUploadingChange = useCallback(
    (isUploading: boolean) => {
      setUploadingFields((prev) => {
        if (prev.idCardImageUri === isUploading) return prev;
        return { ...prev, idCardImageUri: isUploading };
      });
    },
    []
  );

  // Effect to reset form when userProfile is loaded
  useEffect(() => {
    if (userProfile) {
      reset({
        firstName:
          userProfile.firstName || session?.user?.name?.split(" ")[0] || "",
        lastName:
          userProfile.lastName ||
          session?.user?.name?.split(" ").slice(1).join(" ") ||
          "",
        phone: userProfile.phone || "",
        gender: userProfile.gender as "MALE" | "FEMALE" | undefined,
        dateOfBirth: userProfile.dateOfBirth
          ? new Date(userProfile.dateOfBirth)
          : undefined,
        idCardImageUri: userProfile.idCardImageUrl || "",
        profileImageUri: session?.user?.image || "",
      });
    } else if (session?.user?.name) {
      const parts = session.user.name.split(" ");
      reset({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
      });
    }
  }, [userProfile, session, reset]);

  const onSubmit = async (data: IdentityFormData) => {
    try {
      triggerHaptic();
      await updateUserProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
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
        paddingBottom: insets.bottom + 10,
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
              isDisabled={isAnyUploading}
              onUploadingChange={handleProfileImageUploadingChange}
            />
          </View>
          <View className="flex-1">
            <FormImagePicker
              control={control}
              name="idCardImageUri"
              label={t("common.onboarding.idCardImage")}
              error={errors.idCardImageUri?.message}
              isDisabled={isAnyUploading}
              onUploadingChange={handleIdCardImageUploadingChange}
            />
          </View>
        </View>

        <View className="flex-row gap-4">
          <FormTextField
            className="flex-1"
            control={control}
            name="firstName"
            label={t("common.onboarding.firstName")}
            placeholder={t("common.onboarding.firstNamePlaceholder")}
            error={errors.firstName?.message}
            isDisabled={isAnyUploading}
          />
          <FormTextField
            className="flex-1"
            control={control}
            name="lastName"
            label={t("common.onboarding.lastName")}
            placeholder={t("common.onboarding.lastNamePlaceholder")}
            error={errors.lastName?.message}
            isDisabled={isAnyUploading}
          />
        </View>

        <FormTextField
          control={control}
          name="phone"
          label={t("common.onboarding.phone")}
          placeholder={t("common.onboarding.phonePlaceholder")}
          error={errors.phone?.message}
          keyboardType="phone-pad"
          isDisabled={isAnyUploading}
        />

        <FormDatePicker
          control={control}
          name="dateOfBirth"
          label={t("common.onboarding.dateOfBirth")}
          error={errors.dateOfBirth?.message as string}
          isDisabled={isAnyUploading}
        />

        <FormInlineRadio
          control={control}
          name="gender"
          label={t("common.onboarding.gender")}
          error={errors.gender?.message}
          isDisabled={isAnyUploading}
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
            isDisabled={isSubmitting || isAnyUploading}
            pressableFeedbackVariant="ripple"
            pressableFeedbackRippleProps={{
              animation: {
                backgroundColor: { value: isLight ? "white" : "black" },
                opacity: { value: [0, 0.3, 0] },
              },
            }}
          >
            {isSubmitting ? (
              <Spinner entering={FadeIn.delay(50)} color="#ffffff" />
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
