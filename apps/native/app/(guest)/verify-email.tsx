import { useRouter, useLocalSearchParams } from "expo-router";
import {
  BottomSheet,
  Button,
  TextField,
  FormField,
  useToast,
} from "heroui-native";
import { useState, useEffect } from "react";
import { ImageBackground, Text, View, Image } from "react-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Mail01Icon, ZapIcon } from "@hugeicons/core-free-icons";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { toast } = useToast();
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
      toast.show({
        variant: "danger",
        label: t("auth.verifyEmail.toast.resendError.title"),
        description: t("auth.verifyEmail.toast.resendError.description"),
      });
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
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

      router.replace("/(protected)");
    } catch (error) {
      toast.show({
        variant: "danger",
        label: t("auth.verifyEmail.toast.genericError.title"),
        description: t("auth.verifyEmail.toast.genericError.description"),
      });
      setIsVerifying(false);
    }
  };

  const handleChangeEmail = () => {
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
      <BottomSheet isOpen={true} onOpenChange={() => {}}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay
            isCloseOnPress={false}
            className="bg-transparent"
          />
          <BottomSheet.Content
            snapPoints={["70%"]}
            enablePanDownToClose={false}
            backgroundClassName="bg-background rounded-[55px] border border-border"
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
                {t("auth.verifyEmail.title")}
              </BottomSheet.Title>
              <BottomSheet.Description className="text-sm text-foreground font-sans leading-snug">
                {t("auth.verifyEmail.description")}
              </BottomSheet.Description>
            </View>

            {/* Email Display */}
            <View className="mb-8 p-4 bg-muted rounded-2xl flex-row items-center gap-3">
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                <StyledHugeIcon
                  icon={Mail01Icon}
                  size={20}
                  className="text-primary"
                />
              </View>
              <Text className="text-base font-sans-bold text-foreground flex-1">
                {email}
              </Text>
            </View>

            {/* OTP Input */}
            <View className="mb-6">
              <FormField>
                <TextField className="h-16 rounded-2xl">
                  <TextField.Input
                    placeholder={t("auth.verifyEmail.otpPlaceholder")}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                    className="text-center text-2xl font-heading-bold tracking-[10px]"
                  />
                </TextField>
              </FormField>
            </View>

            {/* Action Buttons */}
            <View className="gap-3">
              {/* Verify Button */}
              <Button
                variant="primary"
                size="lg"
                onPress={handleVerify}
                isDisabled={otp.length < 6 || isVerifying}
                className="rounded-2xl h-14"
                pressableFeedbackVariant="ripple"
              >
                {isVerifying ? (
                  <Button.Label className="font-heading-bold">
                    {t("auth.verifyEmail.verifying")}
                  </Button.Label>
                ) : (
                  <>
                    <Button.Label className="font-heading-bold">
                      {t("auth.verifyEmail.confirmButton")}
                    </Button.Label>
                    <StyledHugeIcon
                      icon={ZapIcon}
                      size={20}
                      className="text-background"
                      variant="solid"
                    />
                  </>
                )}
              </Button>
              {/* Resend Button */}
              <Button
                variant="secondary"
                size="lg"
                onPress={handleResend}
                isDisabled={!canResend || isResending}
                className="rounded-2xl"
                pressableFeedbackVariant="ripple"
              >
                <Button.Label className="font-heading-bold">
                  {isResending
                    ? t("auth.verifyEmail.resendingButton")
                    : canResend
                    ? t("auth.verifyEmail.resendButton")
                    : `${t("auth.verifyEmail.resendButton")} (${resendTimer}s)`}
                </Button.Label>
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
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
