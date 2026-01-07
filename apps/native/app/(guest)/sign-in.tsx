import { useRouter } from "expo-router";
import { BottomSheet, useToast } from "heroui-native";
import { useState } from "react";
import { ImageBackground, View, Keyboard } from "react-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmailInputSchema,
  type EmailInputFormData,
} from "@/schemas/email-input.schema";
import { authClient } from "@/lib/auth-client";
import { AuthHeader } from "@/components/auth/auth-header";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { EmailInputForm } from "@/components/auth/email-input-form";
import {
  triggerHaptic,
  triggerHapticError,
  triggerHapticSuccess,
} from "@/lib/haptics";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useLocalization();
  const { toast } = useToast();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EmailInputFormData>({
    resolver: zodResolver(createEmailInputSchema(t)),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const handleEmailPress = () => {
    triggerHaptic();
    setShowEmailInput(true);
  };

  const handleBackPress = () => {
    triggerHaptic();
    setShowEmailInput(false);
    Keyboard.dismiss();
  };

  const onSubmit = async (data: EmailInputFormData) => {
    triggerHaptic();
    Keyboard.dismiss();

    try {
      const { error: authError } =
        await authClient.emailOtp.sendVerificationOtp({
          email: data.email,
          type: "sign-in",
        });

      if (authError) {
        console.log({
          authError,
        });
        triggerHapticError();
        toast.show({
          variant: "danger",
          label: t("auth.emailInput.toast.error.title"),
          description:
            authError.message || t("auth.emailInput.toast.error.description"),
          duration: 4000,
        });
        return;
      }

      triggerHapticSuccess();

      toast.show({
        variant: "success",
        label: t("auth.emailInput.toast.success.title"),
        description: t("auth.emailInput.toast.success.description", {
          email: data.email,
        }),
        duration: 3000,
      });

      setIsSheetOpen(false);
      router.push({
        pathname: "/(guest)/verify-email",
        params: { email: data.email },
      });
    } catch (err) {
      triggerHapticError();
      toast.show({
        variant: "danger",
        label: t("auth.emailInput.toast.genericError.title"),
        description: t("auth.emailInput.toast.genericError.description"),
        duration: 4000,
      });
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Immersive Background */}
      <ImageBackground
        source={require("@/assets/video/bg-gif.gif")}
        className="absolute inset-0"
        resizeMode="cover"
        imageStyle={{ opacity: 0.6 }}
      >
        <View className="absolute inset-0 bg-background/40" />
      </ImageBackground>

      {/* Main Bottom Sheet */}
      <BottomSheet isOpen={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay
            isCloseOnPress={false}
            className="bg-transparent"
          />
          <BottomSheet.Content
            snapPoints={showEmailInput ? ["50%"] : ["55%"]}
            enablePanDownToClose={false}
            backgroundClassName="bg-background border border-border"
            handleIndicatorClassName="bg-background w-12"
            contentContainerClassName="px-8 pt-4 pb-10"
          >
            {/* Header */}
            <AuthHeader
              showEmailInput={showEmailInput}
              onBackPress={handleBackPress}
            />

            {/* Content */}
            {!showEmailInput ? (
              <SocialAuthButtons onEmailPress={handleEmailPress} />
            ) : (
              <KeyboardAwareScrollView
                className="w-full flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  width: "100%",
                }}
              >
                <EmailInputForm
                  control={control}
                  errors={errors}
                  isValid={isValid}
                  isLoading={isSubmitting}
                  onSubmit={handleSubmit(onSubmit)}
                />
              </KeyboardAwareScrollView>
            )}
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
