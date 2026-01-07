import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  BottomSheet,
  Button,
  TextField,
  useToast,
  Spinner,
} from "heroui-native";
import { useState, useEffect, useCallback } from "react";
import { ImageBackground, Text, View, Image } from "react-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { authClient } from "@/lib/auth-client";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Mail01Icon, ZapIcon } from "@hugeicons/core-free-icons";
import { FadeIn, LinearTransition } from "react-native-reanimated";
import {
  triggerHaptic,
  triggerHapticError,
  triggerHapticSuccess,
} from "@/lib/haptics";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { t } = useLocalization();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setIsSheetOpen(true);
    }, [])
  );
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Start countdown timer
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResend = async () => {
    triggerHaptic();
    if (!canResend || isResending) return;

    setIsResending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
      });

      // Reset timer
      setResendTimer(60);
      setCanResend(false);
      setIsResending(false);

      // Restart countdown
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      triggerHapticError();
      toast.show({
        variant: "danger",
        label: t("auth.verifyEmail.toast.resendError.title"),
        description: t("auth.verifyEmail.toast.resendError.description"),
      });
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    triggerHaptic();
    if (otp.length < 6 || isVerifying) return;

    setIsVerifying(true);
    try {
      const { data, error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (error) {
        toast.show({
          variant: "danger",
          label: t("auth.verifyEmail.toast.error.title"),
          description:
            error.message || t("auth.verifyEmail.toast.error.description"),
        });
        setIsVerifying(false);
        return;
      }

      triggerHapticSuccess();
      setIsSheetOpen(false);
      router.replace("/(protected)");
    } catch (error) {
      triggerHapticError();
      toast.show({
        variant: "danger",
        label: t("auth.verifyEmail.toast.genericError.title"),
        description: t("auth.verifyEmail.toast.genericError.description"),
      });
      setIsVerifying(false);
    }
  };

  const handleChangeEmail = () => {
    triggerHaptic();
    setIsSheetOpen(false);
    router.back();
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
            snapPoints={["70%"]}
            enablePanDownToClose={false}
            backgroundClassName="bg-background border border-border"
            handleIndicatorClassName="bg-background w-12"
            contentContainerClassName="px-8 pt-4 pb-10"
          >
            {/* Header / Logo Section */}
            <KeyboardAwareScrollView
              className="w-full flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                flexGrow: 1,
                width: "100%",
              }}
            >
              <View className="mb-8">
                <View className="rounded-xl items-start justify-center mb-6">
                  <Image
                    source={require("@/assets/images/logo-fit.webp")}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>

                <BottomSheet.Title className="text-3xl font-heading-bold text-primary mb-2">
                  {t("auth.verifyEmail.title")}
                </BottomSheet.Title>
                <BottomSheet.Description className="text-sm text-foreground font-sans leading-snug">
                  {t("auth.verifyEmail.description", { email })}
                </BottomSheet.Description>
              </View>

              {/* Email Display */}
              <View className="mb-8 p-4 bg-primary/10 rounded-2xl flex-row items-center gap-3">
                <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                  <StyledHugeIcon
                    icon={Mail01Icon}
                    size={20}
                    className="text-primary"
                  />
                </View>
                <Text className="text-base font-sans-bold text-primary flex-1">
                  {email}
                </Text>
              </View>

              {/* OTP Input */}
              <View className="mb-6">
                <TextField>
                  <TextField.Label
                    className="text-sans text-foreground"
                    style={{ fontFamily: "Geist_500Medium" }}
                  >
                    {t("auth.verifyEmail.otpLabel")}
                  </TextField.Label>
                  <TextField.Input
                    placeholder={t("auth.verifyEmail.otpPlaceholder")}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                    className="text-center text-2xl font-heading-bold tracking-[10px]"
                    style={{ fontFamily: "Geist_700Bold" }}
                  />
                  <TextField.ErrorMessage>
                    {otp.length > 0 && otp.length < 6
                      ? t("auth.verifyEmail.otpInvalid")
                      : ""}
                  </TextField.ErrorMessage>
                </TextField>
              </View>

              {/* Action Buttons */}
              <View className="gap-3">
                {/* Verify Button */}
                <Button
                  layout={LinearTransition.springify()}
                  variant="primary"
                  size="lg"
                  onPress={handleVerify}
                  isDisabled={otp.length < 6 || isVerifying}
                  className="rounded-2xl h-14"
                  pressableFeedbackVariant="ripple"
                >
                  {isVerifying ? (
                    <Spinner entering={FadeIn.delay(50)} color="white" />
                  ) : (
                    <>
                      <Button.Label className="font-heading-bold text-white">
                        {t("auth.verifyEmail.confirmButton")}
                      </Button.Label>
                      <StyledHugeIcon
                        icon={ZapIcon}
                        size={20}
                        className="text-white"
                        variant="solid"
                      />
                    </>
                  )}
                </Button>
                {/* Resend Button */}
                <Button
                  layout={LinearTransition.springify()}
                  variant="secondary"
                  size="lg"
                  onPress={handleResend}
                  isDisabled={!canResend || isResending}
                  className="rounded-2xl h-14"
                  pressableFeedbackVariant="ripple"
                >
                  {isResending ? (
                    <Spinner entering={FadeIn.delay(50)} color="white" />
                  ) : (
                    <Button.Label className="font-heading-bold text-foreground">
                      {canResend
                        ? t("auth.verifyEmail.resendButton")
                        : `${t(
                            "auth.verifyEmail.resendButton"
                          )} (${resendTimer}s)`}
                    </Button.Label>
                  )}
                </Button>

                {/* Change Email Button */}
                <Button
                  variant="ghost"
                  size="lg"
                  onPress={handleChangeEmail}
                  className="rounded-2xl"
                >
                  <Button.Label className="text-primary font-heading-bold">
                    {t("auth.verifyEmail.changeEmail")}
                  </Button.Label>
                </Button>
              </View>

              {/* Footer Note */}
              <View className="mt-6">
                <Text className="text-xs text-muted-foreground font-sans text-center">
                  {t("auth.verifyEmail.didntReceive")}
                </Text>
              </View>
            </KeyboardAwareScrollView>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
