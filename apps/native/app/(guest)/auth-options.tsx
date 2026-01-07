import { useRouter } from "expo-router";
import {
  BottomSheet,
  Button,
  FormField,
  TextField,
  useToast,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
} from "react-native-reanimated";

export default function AuthOptionsScreen() {
  const router = useRouter();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { toast } = useToast();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
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
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      const { data: authData, error: authError } =
        await authClient.emailOtp.sendVerificationOtp({
          email: data.email,
          type: "sign-in",
        });

      if (authError) {
        toast.show({
          variant: "danger",
          label: t("auth.emailInput.toast.error.title"),
          description:
            authError.message || t("auth.emailInput.toast.error.description"),
          duration: 4000,
        });
        setIsLoading(false);
        return;
      }

      toast.show({
        variant: "success",
        label: t("auth.emailInput.toast.success.title"),
        description: t("auth.emailInput.toast.success.description", {
          email: data.email,
        }),
        duration: 3000,
      });

      router.push({
        pathname: "/(guest)/verify-email",
        params: { email: data.email },
      });
    } catch (err) {
      toast.show({
        variant: "danger",
        label: t("auth.emailInput.toast.genericError.title"),
        description: t("auth.emailInput.toast.genericError.description"),
        duration: 4000,
      });
      setIsLoading(false);
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
      <BottomSheet isOpen={true} onOpenChange={() => {}}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay
            isCloseOnPress={false}
            className="bg-transparent"
          />
          <BottomSheet.Content
            snapPoints={showEmailInput ? ["50%"] : ["55%"]}
            enablePanDownToClose={false}
            backgroundClassName="bg-background rounded-[55px] border border-border"
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
            ) : (
              <Animated.View
                entering={FadeInRight.duration(400)}
                exiting={FadeOutRight.duration(300)}
              >
                {/* Email Form */}
                <View className="gap-4 mb-6">
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormField isInvalid={!!errors.email}>
                        <TextField>
                          <TextField.Input
                            placeholder={t("auth.emailInput.emailPlaceholder")}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            autoFocus
                            editable={!isLoading}
                            className="h-14 rounded-2xl text-base"
                          />
                        </TextField>
                        {errors.email && (
                          <FormField.ErrorMessage>
                            {errors.email.message}
                          </FormField.ErrorMessage>
                        )}
                      </FormField>
                    )}
                  />
                </View>

                {/* Continue Button */}
                <Button
                  variant="primary"
                  size="lg"
                  onPress={handleSubmit(onSubmit)}
                  isDisabled={!isValid || isLoading}
                  className="rounded-2xl"
                  pressableFeedbackVariant="ripple"
                >
                  {isLoading ? (
                    <Button.Label className="font-heading-bold">
                      {t("auth.emailInput.continueButton")}...
                    </Button.Label>
                  ) : (
                    <>
                      <Button.Label className="font-heading-bold">
                        {t("auth.emailInput.continueButton")}
                      </Button.Label>
                      <StyledHugeIcon
                        icon={Mail01Icon}
                        size={20}
                        className="text-background"
                      />
                    </>
                  )}
                </Button>
              </Animated.View>
            )}
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
