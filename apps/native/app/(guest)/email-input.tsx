import { useRouter, useFocusEffect } from "expo-router";
import {
  BottomSheet,
  Button,
  TextField,
  useToast,
  Spinner,
} from "heroui-native";
import { ImageBackground, View, Image, Keyboard } from "react-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { authClient } from "@/lib/auth-client";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmailInputSchema,
  type EmailInputFormData,
} from "@/schemas/email-input.schema";
import { FadeIn, LinearTransition } from "react-native-reanimated";
import {
  triggerHaptic,
  triggerHapticError,
  triggerHapticSuccess,
} from "@/lib/haptics";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useState, useCallback } from "react";

export default function EmailInputScreen() {
  const router = useRouter();
  const { t } = useLocalization();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsSheetOpen(true);
    }, [])
  );

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

  const onSubmit = async (data: EmailInputFormData) => {
    triggerHaptic();
    Keyboard.dismiss();

    try {
      // Using Better Auth magic link
      const { data: authData, error: authError } =
        await authClient.emailOtp.sendVerificationOtp({
          email: data.email,
          type: "sign-in",
        });

      if (authError) {
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
      // Show success toast
      toast.show({
        variant: "success",
        label: t("auth.emailInput.toast.success.title"),
        description: t("auth.emailInput.toast.success.description", {
          email: data.email,
        }),
        duration: 3000,
      });

      setIsSheetOpen(false);
      // Navigate to verification screen
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
            snapPoints={["60%"]}
            enablePanDownToClose={false}
            backgroundClassName="bg-background border border-border"
            handleIndicatorClassName="bg-background w-12"
            contentContainerClassName="px-8 pt-4 pb-10"
          >
            {/* Header / Logo Section */}
            <View className="mb-8">
              <View className="rounded-xl items-start justify-center mb-6">
                <Image
                  source={require("@/assets/images/logo-fit.webp")}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
              </View>

              <BottomSheet.Title className="text-3xl font-heading-bold text-primary mb-2">
                {t("auth.emailInput.title")}
              </BottomSheet.Title>
              <BottomSheet.Description className="text-sm text-foreground font-sans leading-snug">
                {t("auth.emailInput.description")}
              </BottomSheet.Description>
            </View>

            {/* Email Input with React Hook Form */}
            <KeyboardAwareScrollView
              className="w-full flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                width: "100%",
              }}
            >
              <View className="gap-4 mb-6">
                <Controller
                  control={control}
                  name="email"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <TextField isInvalid={!!error}>
                      <TextField.Label
                        className="text-sans text-foreground"
                        style={{ fontFamily: "Outfit_500Medium" }}
                      >
                        {t("auth.emailInput.title")}
                      </TextField.Label>
                      <TextField.Input
                        value={value || ""}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder={t("auth.emailInput.emailPlaceholder")}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        autoFocus
                        editable={!isSubmitting}
                        className="h-14 rounded-2xl text-base"
                        style={{ fontFamily: "Outfit_400Regular" }}
                      />
                      <TextField.Description
                        style={{ fontFamily: "Outfit_400Regular" }}
                      >
                        {t("auth.emailInput.description")}
                      </TextField.Description>
                      <TextField.ErrorMessage className="font-sans">
                        {error?.message}
                      </TextField.ErrorMessage>
                    </TextField>
                  )}
                />
              </View>

              {/* Continue Button */}
              <Button
                layout={LinearTransition.springify()}
                variant="primary"
                size="lg"
                onPress={handleSubmit(onSubmit)}
                isDisabled={!isValid || isSubmitting}
                className="rounded-2xl mb-4"
                pressableFeedbackVariant="ripple"
              >
                {isSubmitting ? (
                  <Spinner entering={FadeIn.delay(50)} color="white" />
                ) : (
                  <>
                    <Button.Label className="font-heading-bold text-white">
                      {t("auth.emailInput.continueButton")}
                    </Button.Label>
                    <StyledHugeIcon
                      icon={Mail01Icon}
                      size={20}
                      className="text-white"
                    />
                  </>
                )}
              </Button>
            </KeyboardAwareScrollView>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
