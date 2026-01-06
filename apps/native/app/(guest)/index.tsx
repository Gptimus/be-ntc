import { useLocalization } from "@/localization/hooks/use-localization";
import { storageHelpers } from "@/lib/storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageBackground,
  Image,
} from "react-native";
import { Button } from "heroui-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/contexts/app-theme-context";
import { triggerHaptic } from "@/lib/haptics";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import {
  CreditCardIcon,
  GridTableIcon,
  Exchange01Icon,
  Shield01Icon,
  Login03Icon,
} from "@hugeicons/core-free-icons";

const { width } = Dimensions.get("window");

const FEATURES = [
  {
    icon: CreditCardIcon,
    key: "payments" as const,
    image: require("@/assets/onboarding/hero.webp"),
  },
  {
    icon: GridTableIcon,
    key: "services" as const,
    image: require("@/assets/onboarding/chest.webp"),
  },
  {
    icon: Exchange01Icon,
    key: "currencies" as const,
    image: require("@/assets/onboarding/chest-gold-dollar.webp"),
  },
  {
    icon: Shield01Icon,
    key: "secure" as const,
    image: require("@/assets/onboarding/shield-phone.webp"),
  },
];

export default function GetStartedScreen() {
  const { t } = useLocalization();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { isLight } = useAppTheme();

  const handleNext = () => {
    triggerHaptic();
    if (activeIndex < FEATURES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      storageHelpers.setHasSeenOnboarding(true);
      router.replace("/(guest)/sign-up");
    }
  };

  const handleSignIn = () => {
    triggerHaptic();
    storageHelpers.setHasSeenOnboarding(true);
    router.replace("/(guest)/sign-in");
  };

  const handleSkip = () => {
    triggerHaptic();
    storageHelpers.setHasSeenOnboarding(true);
    router.replace("/(guest)/sign-in");
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    if (index >= 0 && index < FEATURES.length && index !== activeIndex) {
      triggerHaptic();
      setActiveIndex(index);
    }
  };

  const renderFeature = ({
    item,
    index,
  }: {
    item: (typeof FEATURES)[0];
    index: number;
  }) => (
    <View style={{ width }} className="px-4 justify-end pb-4">
      <View className="items-center mb-8">
        <Image
          source={item.image}
          style={{ width: width * 0.45, height: width * 0.45 }}
          resizeMode="contain"
        />
      </View>
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(600)}
        className="items-start"
      >
        <Text className="text-5xl font-heading-bold text-white leading-[1.1] mb-3">
          {t(`common.getStarted.features.${item.key}.title`)}
        </Text>
        <Text className="text-base text-white/80 font-sans leading-relaxed text-left max-w-[95%]">
          {t(`common.getStarted.features.${item.key}.description`)}
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Background */}
      <ImageBackground
        source={require("@/assets/video/bg-gif.gif")}
        className="absolute inset-0"
        resizeMode="cover"
        imageStyle={{ opacity: 0.45 }}
      >
        <View className="absolute inset-0 bg-black/50" />
      </ImageBackground>

      {/* Skip button Area */}
      <View
        style={{ paddingTop: insets.top }}
        className="flex-row justify-end px-4 z-20"
      >
        <Button
          variant="ghost"
          onPress={handleSkip}
          hitSlop={10}
          className="rounded-full"
        >
          <Button.Label className="text-white/50 text-xs font-sans-bold tracking-[2px]">
            {t("common.getStarted.buttons.skip").toUpperCase()}
          </Button.Label>
        </Button>
      </View>

      {/* Main Bottom Container */}
      <View className="flex-1 justify-end">
        {/* Swiper Content */}
        <View className="mb-6">
          <FlatList
            ref={flatListRef}
            data={FEATURES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={renderFeature}
            keyExtractor={(item) => item.key}
            decelerationRate="fast"
            style={{ flexGrow: 0 }}
          />
        </View>

        {/* Indicators */}
        <View className="flex-row gap-2 px-4 mb-10">
          {FEATURES.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-8 bg-primary" : "w-1.5 bg-white/30"
              }`}
            />
          ))}
        </View>

        {/* Buttons */}
        <View
          className="px-4 gap-4"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <Animated.View entering={FadeInDown.delay(400)}>
            <Button
              variant="primary"
              size="lg"
              onPress={handleNext}
              className="rounded-2xl"
              pressableFeedbackVariant="ripple"
              pressableFeedbackRippleProps={{
                animation: {
                  backgroundColor: { value: isLight ? "white" : "black" },
                  opacity: { value: [0, 0.3, 0] },
                },
              }}
            >
              <Button.Label className="text-white text-lg font-heading-bold tracking-tight">
                {activeIndex === FEATURES.length - 1
                  ? t("common.getStarted.buttons.start")
                  : t("common.getStarted.buttons.getStarted")}
              </Button.Label>
            </Button>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500)}>
            <Button
              variant="secondary"
              size="lg"
              onPress={handleSignIn}
              className="border-white/10 bg-white/10 rounded-2xl"
              pressableFeedbackVariant="ripple"
              pressableFeedbackRippleProps={{
                animation: {
                  backgroundColor: { value: isLight ? "white" : "black" },
                  opacity: { value: [0, 0.3, 0] },
                },
              }}
            >
              <StyledHugeIcon
                icon={Login03Icon}
                size={20}
                className="text-white"
              />
              <Button.Label className="text-white text-lg font-heading-bold">
                {t("common.getStarted.buttons.signIn")}
              </Button.Label>
            </Button>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
