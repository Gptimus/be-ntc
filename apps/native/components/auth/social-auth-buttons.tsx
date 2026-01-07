import { Button, Spinner } from "heroui-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { AppleIcon, GoogleIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { useLocalization } from "@/localization/hooks/use-localization";
import { View, Text } from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "@/lib/haptics";

WebBrowser.maybeCompleteAuthSession();

const LastUsedIndicator = ({ lastUsedText }: { lastUsedText: string }) => (
  <View className="absolute -top-3 -right-1 px-1.5 py-0.5 bg-primary rounded z-10">
    <View className="absolute -bottom-1 right-2 w-2 h-2 bg-primary rotate-45" />
    <Text className="text-[10px] text-primary-foreground font-medium">
      {lastUsedText}
    </Text>
  </View>
);

interface SocialAuthButtonsProps {
  onEmailPress: () => void;
  onSocialPress: (provider: "google" | "apple") => Promise<void>;
}

export function SocialAuthButtons({
  onEmailPress,
  onSocialPress,
}: SocialAuthButtonsProps) {
  const { t } = useLocalization();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [lastMethod, setLastMethod] = useState<string | null>(null);

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  useEffect(() => {
    try {
      const method = authClient.getLastUsedLoginMethod?.();
      if (typeof method === "string") {
        setLastMethod(method);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    triggerHaptic();
    setLoadingProvider(provider);

    try {
      await onSocialPress(provider);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLoadingProvider(null);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <Animated.View
      key="social-auth"
      entering={FadeInLeft.duration(400)}
      exiting={FadeOutLeft.duration(300)}
      className="gap-3"
    >
      {/* Apple Button */}
      <View className="relative">
        <Button
          variant="primary"
          size="lg"
          className="bg-foreground border-foreground h-14 rounded-2xl"
          pressableFeedbackVariant="ripple"
          onPress={() => handleOAuthSignIn("apple")}
          isDisabled={loadingProvider !== null}
        >
          {loadingProvider === "apple" ? (
            <Spinner color="white" />
          ) : (
            <>
              <StyledHugeIcon
                icon={AppleIcon}
                size={20}
                variant="solid"
                className="text-background"
              />
              <Button.Label className="text-background font-heading-bold">
                {t("auth.signUp.continueWithApple")}
              </Button.Label>
            </>
          )}
        </Button>
        {lastMethod === "apple" && (
          <LastUsedIndicator lastUsedText={t("auth.signIn.lastUsed")} />
        )}
      </View>

      {/* Google Button */}
      <View className="relative">
        <Button
          variant="secondary"
          size="lg"
          className="bg-background border border-border rounded-2xl h-14"
          pressableFeedbackVariant="ripple"
          onPress={() => handleOAuthSignIn("google")}
          isDisabled={loadingProvider !== null}
        >
          {loadingProvider === "google" ? (
            <Spinner color="default" />
          ) : (
            <>
              <StyledHugeIcon
                icon={GoogleIcon}
                size={20}
                className="text-foreground"
              />
              <Button.Label className="text-foreground font-heading-bold">
                {t("auth.signUp.continueWithGoogle")}
              </Button.Label>
            </>
          )}
        </Button>
        {lastMethod === "google" && (
          <LastUsedIndicator lastUsedText={t("auth.signIn.lastUsed")} />
        )}
      </View>

      {/* Email Button */}
      <Button
        variant="tertiary"
        size="lg"
        onPress={onEmailPress}
        className="rounded-2xl h-14"
        pressableFeedbackVariant="ripple"
        isDisabled={loadingProvider !== null}
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

      {/* Terms Footer */}
      <View className="mt-8 flex-row flex-wrap justify-center">
        <Text className="text-xs text-foreground font-sans text-center">
          {t("auth.signUp.terms.agreement")}{" "}
          <Text className="font-sans-bold underline">
            {t("auth.signUp.terms.link")}
          </Text>
        </Text>
      </View>
    </Animated.View>
  );
}
