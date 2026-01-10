import { Button, Spinner } from "heroui-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { useLocalization } from "@/localization/hooks/use-localization";
import { View, Text } from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import * as Haptics from "expo-haptics";
import { triggerHaptic } from "@/lib/haptics";
import Svg, { Path } from "react-native-svg";
import { useAppTheme } from "@/contexts/app-theme-context";

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
  const { isLight } = useAppTheme();

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
          className="bg-foreground border-foreground h-14"
          pressableFeedbackVariant="ripple"
          onPress={() => handleOAuthSignIn("apple")}
          isDisabled={loadingProvider !== null}
        >
          {loadingProvider === "apple" ? (
            <Spinner color="white" />
          ) : (
            <>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path
                  fill={isLight ? "white" : "black"}
                  d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                />
              </Svg>
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
          className="bg-background border border-border h-14"
          pressableFeedbackVariant="ripple"
          onPress={() => handleOAuthSignIn("google")}
          isDisabled={loadingProvider !== null}
        >
          {loadingProvider === "google" ? (
            <Spinner color="white" />
          ) : (
            <>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <Path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <Path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <Path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </Svg>
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
        className="h-14"
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
