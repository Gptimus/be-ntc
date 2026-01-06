import { Button, BottomSheet } from "heroui-native";
import { View, Image } from "react-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useLocalization } from "@/localization/hooks/use-localization";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

interface AuthHeaderProps {
  showEmailInput: boolean;
  onBackPress: () => void;
}

export function AuthHeader({ showEmailInput, onBackPress }: AuthHeaderProps) {
  const { t } = useLocalization();

  return (
    <View className="mb-8">
      <View className="flex-row items-center justify-between mb-6">
        {showEmailInput ? (
          <Animated.View
            key="back-button"
            entering={FadeInLeft.duration(300)}
            exiting={FadeOutLeft.duration(300)}
          >
            <Button
              variant="primary"
              size="md"
              onPress={onBackPress}
              className="rounded-full -ml-2 w-10 h-10 p-0"
              pressableFeedbackVariant="ripple"
            >
              <StyledHugeIcon
                icon={ArrowLeft01Icon}
                size={22}
                variant="stroke"
                className="text-white"
              />
            </Button>
          </Animated.View>
        ) : (
          <Animated.View
            key="logo"
            entering={FadeInLeft.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            className="rounded-xl items-start justify-center"
          >
            <Image
              source={require("@/assets/images/logo-fit.webp")}
              style={{ width: 32, height: 32 }}
              resizeMode="contain"
            />
          </Animated.View>
        )}
      </View>

      <BottomSheet.Title className="text-3xl font-heading-bold text-primary mb-2">
        {showEmailInput ? t("auth.emailInput.title") : t("auth.signUp.title")}
      </BottomSheet.Title>
      <BottomSheet.Description className="text-sm text-foreground font-sans leading-snug">
        {showEmailInput
          ? t("auth.emailInput.description")
          : t("auth.signUp.description")}
      </BottomSheet.Description>
    </View>
  );
}
