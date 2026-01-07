import { useRouter } from "expo-router";
import { BottomSheet, Button, TextField, useToast } from "heroui-native";
import { useState } from "react";
import { ImageBackground, Text, View, Image, Keyboard } from "react-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmailInputSchema,
  type EmailInputFormData,
} from "@/schemas/email-input.schema";

export default function EmailInputScreen() {
  const router = useRouter();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const { toast } = useToast();
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

  const onSubmit = async (data: EmailInputFormData) => {
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // Using Better Auth magic link
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

      // Show success toast
      toast.show({
        variant: "success",
        label: t("auth.emailInput.toast.success.title"),
        description: t("auth.emailInput.toast.success.description", {
          email: data.email,
        }),
        duration: 3000,
      });

      // Navigate to verification screen
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
            snapPoints={["60%"]}
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
                {t("auth.emailInput.title")}
              </BottomSheet.Title>
              <BottomSheet.Description className="text-sm text-foreground font-sans leading-snug">
                {t("auth.emailInput.description")}
              </BottomSheet.Description>
            </View>

            {/* Email Input with React Hook Form */}
            <View className="gap-4 mb-6">
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
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
                      editable={!isLoading}
                      className="h-14 rounded-2xl text-base"
                    />
                  </TextField>
                )}
              />

              {/* Form Validation Error */}
              {errors.email && (
                <Text className="text-destructive text-sm font-sans">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Continue Button */}
            <Button
              variant="primary"
              size="lg"
              onPress={handleSubmit(onSubmit)}
              isDisabled={!isValid || isLoading}
              className="rounded-2xl mb-4"
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
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
