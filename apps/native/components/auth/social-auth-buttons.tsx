import { Button } from "heroui-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { AppleIcon, GoogleIcon, Mail01Icon } from "@hugeicons/core-free-icons";
import { useLocalization } from "@/localization/hooks/use-localization";
import { View, Text } from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

interface SocialAuthButtonsProps {
  onEmailPress: () => void;
}

export function SocialAuthButtons({ onEmailPress }: SocialAuthButtonsProps) {
  const { t } = useLocalization();

  return (
    <Animated.View
      key="social-auth"
      entering={FadeInLeft.duration(400)}
      exiting={FadeOutLeft.duration(300)}
      className="gap-3"
    >
      {/* Apple Button */}
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

      {/* Google Button */}
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

      {/* Email Button */}
      <Button
        variant="tertiary"
        size="lg"
        onPress={onEmailPress}
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

      {/* Terms Footer */}
      <View className="mt-8 flex-row flex-wrap justify-center">
        <Text className="text-xs text-foreground font-sans">
          {t("auth.signUp.terms.agreement")}
        </Text>
        <Text className="text-xs text-foreground font-sans-bold">
          {t("auth.signUp.terms.link")}
        </Text>
      </View>
    </Animated.View>
  );
}
