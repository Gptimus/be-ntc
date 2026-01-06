import { useLocalization } from "@/localization/hooks/use-localization";
import { storageHelpers } from "@/lib/storage";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CreditCardIcon,
  GridTableIcon,
  Exchange01Icon,
  Shield01Icon,
  Coins01Icon,
  GiftIcon,
  ScratchCardIcon,
} from "@hugeicons/core-free-icons";

const { width, height } = Dimensions.get("window");

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
  {
    icon: Coins01Icon,
    key: "savings" as const,
  },
  {
    icon: GiftIcon,
    key: "rewards" as const,
  },
  {
    icon: ScratchCardIcon,
    key: "cards" as const,
  },
];

export default function GetStartedScreen() {
  const { t } = useLocalization();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const primaryColor = useThemeColor("primary");

  // Floating animation for the hero image
  const heroY = useSharedValue(0);
  useEffect(() => {
    heroY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 2500 }),
        withTiming(0, { duration: 2500 })
      ),
      -1,
      true
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: heroY.value }],
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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    if (index >= 0 && index < FEATURES.length) {
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
    <View
      style={{ width, height: height * 0.45 }}
      className="px-8 justify-end pb-8"
    >
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(800)}
        className="items-start"
      >
        <Text
          className="text-5xl font-heading-bold text-white leading-[1.1] mb-5"
          style={{ color: "#FFFFFF" }}
        >
          {t(`common.getStarted.features.${item.key}.title`)}
        </Text>
        <Text className="text-lg text-neutral-400 font-sans leading-relaxed text-left max-w-[95%]">
          {t(`common.getStarted.features.${item.key}.description`)}
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Background Hero Asset */}
      <View
        style={{ height: height * 0.45 }}
        className="absolute top-0 left-0 right-0 overflow-hidden"
      >
        <Animated.View style={[heroStyle, { flex: 1 }]}>
          <Image
            source={require("@/assets/onboarding/hero.png")}
            style={{ width, height: height * 0.5, opacity: 0.8 }}
            resizeMode="cover"
          />
        </Animated.View>
        <View
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            backgroundColor: "transparent",
            // Simple gradient-like fade to black
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -40 },
            shadowOpacity: 1,
            shadowRadius: 50,
            elevation: 20,
          }}
        />
        {/* Actual Bottom Fade using a View */}
        <View
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            // We'll use a more robust way if needed, but for now this mimics the shadow/fade
          }}
        />
      </View>

      {/* Real Bottom Fade Overlay */}
      <View
        className="absolute top-0 left-0 right-0 h-full bg-black/20"
        pointerEvents="none"
      />

      {/* Skip button Overlay */}
      <View className="absolute top-12 right-6 z-20">
        <Pressable onPress={handleSkip} className="active:opacity-70 p-2">
          <Text className="text-white/50 text-xs font-sans-bold tracking-[2px]">
            {t("common.getStarted.buttons.skip").toUpperCase()}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1">
        {/* Spacer for Hero Area */}
        <View style={{ height: height * 0.35 }} />

        {/* Feature Swiper */}
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
          scrollEnabled={true}
        />

        {/* Dots Indicator */}
        <View className="flex-row gap-2 px-8 mb-8">
          {FEATURES.map((_, index) => (
            <View
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-10 bg-primary" : "w-2 bg-neutral-800"
              }`}
              style={{
                backgroundColor:
                  activeIndex === index ? primaryColor : "#262626",
              }}
            />
          ))}
        </View>
      </View>

      {/* CTA Buttons - Matching Global Theme */}
      <View
        className="px-6 pb-12 gap-4"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <Animated.View entering={FadeInDown.delay(600)}>
          <Pressable
            onPress={handleGetStarted}
            className="h-16 rounded-2xl items-center bg-primary justify-center active:opacity-95"
          >
            <Text className="text-white text-lg font-heading-bold tracking-tight">
              {t("common.getStarted.buttons.getStarted")}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700)}>
          <Pressable
            onPress={handleSignIn}
            className="bg-neutral-900 border border-neutral-800 h-16 rounded-2xl items-center justify-center active:opacity-70"
          >
            <Text className="text-white text-lg font-heading-bold">
              {t("common.getStarted.buttons.signIn")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
