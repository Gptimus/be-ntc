import { useLocalization } from "@/localization/hooks/use-localization";
import { storageHelpers } from "@/lib/storage";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  ScrollView,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CreditCardIcon,
  GridTableIcon,
  Exchange01Icon,
  Shield01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";

const FEATURES = [
  {
    icon: CreditCardIcon,
    key: "payments" as const,
  },
  {
    icon: GridTableIcon,
    key: "services" as const,
  },
  {
    icon: Exchange01Icon,
    key: "currencies" as const,
  },
  {
    icon: Shield01Icon,
    key: "secure" as const,
  },
];

export default function GetStartedScreen() {
  const { t } = useLocalization();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor("background");

  // Animated values
  const logoScale = useSharedValue(0.8);
  const floatingY = useSharedValue(0);

  useEffect(() => {
    // Logo entrance animation
    logoScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    // Floating animation
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }, { translateY: floatingY.value }],
  }));

  const handleGetStarted = () => {
    storageHelpers.setHasSeenOnboarding(true);
    router.replace("/(guest)/sign-up");
  };

  const handleSignIn = () => {
    storageHelpers.setHasSeenOnboarding(true);
    router.replace("/(guest)/sign-in");
  };

  const handleSkip = () => {
    storageHelpers.setHasSeenOnboarding(true);
    router.replace("/(guest)/sign-in");
  };

  return (
    <View className="flex-1" style={{ backgroundColor }}>
      {/* Background GIF with overlay */}
      <ImageBackground
        source={require("@/assets/video/bg-gif.gif")}
        className="absolute inset-0"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-background/90" />
      </ImageBackground>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Skip button */}
        <Animated.View
          entering={FadeIn.delay(200)}
          className="flex-row justify-end mb-4"
        >
          <Pressable
            onPress={handleSkip}
            className="px-4 py-2 active:opacity-70"
          >
            <Text className="text-muted text-sm font-medium">
              {t("common.getStarted.buttons.skip")}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Logo/Icon */}
        <Animated.View
          style={logoAnimatedStyle}
          className="items-center justify-center mb-8"
        >
          <View className="w-32 h-32 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
            <StyledHugeIcon
              icon={Wallet01Icon}
              size={64}
              className="text-primary"
            />
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInUp.delay(400)} className="mb-4">
          <Text className="text-4xl font-heading-bold text-foreground text-center mb-3">
            {t("common.getStarted.title")}
          </Text>
          <Text className="text-lg text-muted text-center font-light">
            {t("common.getStarted.subtitle")}
          </Text>
        </Animated.View>

        {/* Features */}
        <View className="mt-8 mb-8 gap-4">
          {FEATURES.map((feature, index) => (
            <Animated.View
              key={feature.key}
              entering={SlideInRight.delay(600 + index * 100)}
            >
              <View className="flex-row items-start gap-4 bg-card/60 backdrop-blur-sm p-4 rounded-2xl border border-border/30">
                <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center shrink-0">
                  <StyledHugeIcon
                    icon={feature.icon}
                    size={24}
                    className="text-primary"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-heading-semi-bold text-foreground mb-1">
                    {t(`common.getStarted.features.${feature.key}.title`)}
                  </Text>
                  <Text className="text-sm text-muted leading-relaxed">
                    {t(`common.getStarted.features.${feature.key}.description`)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* CTA Buttons */}
        <Animated.View entering={FadeInDown.delay(1000)} className="gap-3 mt-4">
          <Pressable
            onPress={handleGetStarted}
            className="bg-primary p-4 rounded-2xl items-center active:opacity-90"
          >
            <Text className="text-primary-foreground text-lg font-heading-semi-bold">
              {t("common.getStarted.buttons.getStarted")}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSignIn}
            className="bg-card border border-border p-4 rounded-2xl items-center active:opacity-70"
          >
            <Text className="text-foreground text-lg font-heading-medium">
              {t("common.getStarted.buttons.signIn")}
            </Text>
          </Pressable>
        </Animated.View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
