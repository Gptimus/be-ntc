import { useRouter } from "expo-router";
import { BottomSheet, Button } from "heroui-native";
import { ImageBackground, Text, View } from "react-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { useLocalization } from "@/localization/hooks/use-localization";
import {
  AppleIcon,
  GoogleIcon,
  Mail01Icon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();

  const handleEmailSignIn = () => {
    // We can navigate to a more traditional sign-up form or just show it
    router.push("/(guest)/sign-in");
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

      {/* Main Bottom Sheet - Always Open on this screen */}
      <BottomSheet isOpen={true} onOpenChange={() => {}}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay
            isCloseOnPress={false}
            className="bg-transparent"
          />
          <BottomSheet.Content
            snapPoints={["55%"]}
            enablePanDownToClose={false}
            backgroundClassName="bg-background rounded-[55px] border border-border"
            handleIndicatorClassName="bg-background w-12"
            contentContainerClassName="px-8 pt-4 pb-10 "
          >
            {/* Header / Logo Section */}
            <View className="mb-8">
              <View className="w-12 h-12 bg-primary rounded-xl items-center justify-center mb-6">
                <StyledHugeIcon
                  icon={PlayIcon}
                  size={24}
                  variant="solid"
                  className="text-white"
                />
              </View>

              <BottomSheet.Title className="text-3xl font-heading-bold text-primary mb-2">
                {t("auth.signUp.title")}
              </BottomSheet.Title>
              <BottomSheet.Description className="text-sm text-foreground font-sans leading-snug">
                {t("auth.signUp.description")}
              </BottomSheet.Description>
            </View>

            {/* Social Buttons */}
            <View className="gap-3">
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
                onPress={handleEmailSignIn}
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
            </View>

            {/* Footer */}
            <View className="mt-8 flex-row flex-wrap justify-center">
              <Text className="text-xs text-foreground font-sans">
                {t("auth.signUp.terms.agreement")}
              </Text>
              <Text className="text-xs text-foreground font-sans-bold">
                {t("auth.signUp.terms.link")}
              </Text>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </View>
  );
}
