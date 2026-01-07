import { useRouter } from "expo-router";
import {
  BottomSheet,
  Button,
  TextField,
  useToast,
  Spinner,
} from "heroui-native";
import { useState } from "react";
import { ImageBackground, Text, View, Image, Keyboard } from "react-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { useLocalization } from "@/localization/hooks/use-localization";
import {
  AppleIcon,
  GoogleIcon,
  Mail01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmailInputSchema,
  type EmailInputFormData,
} from "@/schemas/email-input.schema";
import { authClient } from "@/lib/auth-client";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeInLeft,
  FadeOutRight,
  LinearTransition,
  FadeIn,
} from "react-native-reanimated";
import {
  triggerHaptic,
  triggerHapticError,
  triggerHapticSuccess,
} from "@/lib/haptics";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function AuthOptionsScreen() {
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
    setShowEmailInput(true);
  };

  const handleBackPress = () => {
    setShowEmailInput(false);
    Keyboard.dismiss();
  };

  const onSubmit = async (data: EmailInputFormData) => {
    triggerHaptic();
    Keyboard.dismiss();

    try {
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
            {/* Header / Logo Section */}
            <View className="mb-8">
              <View className="flex-row items-center justify-between mb-6">
                {showEmailInput ? (
                  <Animated.View
                    entering={FadeInLeft.duration(300)}
                    exiting={FadeOutLeft.duration(300)}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={handleBackPress}
                      className="rounded-full -ml-2"
                    >
                      <StyledHugeIcon
                        icon={ArrowLeft01Icon}
                        size={20}
                        className="text-foreground"
                      />
                    </Button>
                  </Animated.View>
                ) : (
                  <View className="rounded-xl items-start justify-center">
                    <Image
                      source={require("@/assets/images/logo-fit.webp")}
                      style={{ width: 32, height: 32 }}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </View>

              <BottomSheet.Title className="text-3xl font-heading-bold text-primary mb-2">
                {showEmailInput
                  ? t("auth.emailInput.title")
                  : t("auth.signUp.title")}
              </BottomSheet.Title>
              <BottomSheet.Description className="text-sm text-foreground font-sans leading-snug">
                {showEmailInput
                  ? t("auth.emailInput.description")
                  : t("auth.signUp.description")}
              </BottomSheet.Description>
            </View>

            {/* Content - Animated Switch */}
            {!showEmailInput ? (
              <KeyboardAwareScrollView
                className="w-full flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  width: "100%",
                }}
              >
                <Animated.View
                  entering={FadeInLeft.duration(400)}
                  exiting={FadeOutLeft.duration(300)}
                  className="gap-3"
                >
                  {/* Social Buttons */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="bg-foreground border-foreground h-14 rounded-2xl"
                    pressableFeedbackVariant="ripple"
                  >
                    <StyledHugeIcon
                      icon={AppleIcon}
                      size={20}
                      variant="solid"
                      className="text-background"
                    />
                    <Button.Label className="text-background font-heading-bold">
                      {t("auth.signUp.continueWithApple")}
                    </Button.Label>
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-background border border-border rounded-2xl"
                    pressableFeedbackVariant="ripple"
                  >
                    <StyledHugeIcon
                      icon={GoogleIcon}
                      size={20}
                      className="text-foreground"
                    />
                    <Button.Label className="text-foreground font-heading-bold">
                      {t("auth.signUp.continueWithGoogle")}
                    </Button.Label>
                  </Button>

                  <Button
                    variant="tertiary"
                    size="lg"
                    onPress={handleEmailPress}
                    className="rounded-2xl"
                    pressableFeedbackVariant="ripple"
                  >
                    <StyledHugeIcon
                      icon={Mail01Icon}
                      size={20}
                      className="text-foreground"
                    />
                    <Button.Label className="font-heading-bold">
                      {t("auth.signUp.continueWithEmail")}
                    </Button.Label>
                  </Button>

                  {/* Footer */}
                  <View className="mt-8 flex-row flex-wrap justify-center">
                    <Text className="text-xs text-foreground font-sans">
                      {t("auth.signUp.terms.agreement")}
                    </Text>
                    <Text className="text-xs text-foreground font-sans-bold">
                      {t("auth.signUp.terms.link")}
                    </Text>
                  </View>
                </Animated.View>
              </KeyboardAwareScrollView>
            ) : (
              <KeyboardAwareScrollView
                className="w-full flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  width: "100%",
                }}
              >
                <Animated.View
                  entering={FadeInRight.duration(400)}
                  exiting={FadeOutRight.duration(300)}
                >
                  {/* Email Form */}
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
                            style={{ fontFamily: "Geist_500Medium" }}
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
                            style={{ fontFamily: "Geist_400Regular" }}
                          />
                          <TextField.Description>
                            {t("auth.emailInput.description")}
                          </TextField.Description>
                          <TextField.ErrorMessage>
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
                    className="rounded-2xl"
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
                </Animated.View>
              </KeyboardAwareScrollView>
            )}
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
