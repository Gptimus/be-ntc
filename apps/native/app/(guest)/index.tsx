import { useLocalization } from "@/localization/hooks/use-localization";
import { storageHelpers } from "@/lib/storage";
import { useRouter } from "expo-router";
import { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
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
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";

const { width, height } = Dimensions.get("window");

const FEATURES = [
  {
    icon: CreditCardIcon,
    key: "payments" as const,
    accentWord: "partner", // Just for design reference
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

  // Decorative glow animation
  const glowOpacity = useSharedValue(0.3);
  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 3000 }),
        withTiming(0.3, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
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
      style={{ width, height: height * 0.55 }}
      className="px-8 justify-end pb-12"
    >
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(800)}
        className="items-start"
      >
        <Text className="text-6xl font-heading-bold text-white leading-[1.1] mb-6">
          {t(`common.getStarted.features.${item.key}.title`)}
        </Text>
        <Text className="text-lg text-neutral-400 font-sans leading-relaxed text-left max-w-[90%]">
          {t(`common.getStarted.features.${item.key}.description`)}
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <View className="flex-1 bg-black">
      {/* Top Background Glow */}
      <Animated.View
        style={[glowStyle]}
        className="absolute top-[-100] self-center w-[width * 1.5] h-[width] rounded-full bg-yellow-500/20"
        style={{
          width: width * 1.5,
          height: width,
          borderRadius: width,
          backgroundColor: "rgba(234, 179, 8, 0.15)",
          transform: [{ scaleX: 1.5 }],
          top: -width * 0.6,
          left: -width * 0.25,
        }}
      />

      {/* Decorative Avatars Mock (Mimicking the image) */}
      <View
        style={{ paddingTop: insets.top + 40 }}
        className="flex-row justify-center items-center h-48 overflow-hidden"
      >
        <View className="flex-row items-center gap-[-20]">
          <View className="w-24 h-24 rounded-3xl bg-neutral-800 rotate-[-10deg] border border-neutral-700 items-center justify-center">
            <StyledHugeIcon
              icon={FEATURES[0].icon}
              size={40}
              className="text-white/40"
            />
          </View>
          <View className="w-28 h-28 rounded-[40px] bg-neutral-900 z-10 border-2 border-black items-center justify-center">
            <StyledHugeIcon
              icon={FEATURES[4].icon}
              size={48}
              className="text-yellow-500"
            />
          </View>
          <View className="w-24 h-24 rounded-3xl bg-neutral-800 rotate-[10deg] border border-neutral-700 items-center justify-center">
            <StyledHugeIcon
              icon={FEATURES[1].icon}
              size={40}
              className="text-white/40"
            />
          </View>
        </View>
      </View>

      {/* Skip button Overlay */}
      <View className="absolute top-12 right-6 z-20">
        <Pressable onPress={handleSkip} className="active:opacity-70 p-2">
          <Text className="text-neutral-500 text-sm font-sans-medium tracking-wider">
            {t("common.getStarted.buttons.skip").toUpperCase()}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1">
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
        <View className="flex-row gap-2 px-8 mb-6">
          {FEATURES.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? "w-8 bg-yellow-500"
                  : "w-1.5 bg-neutral-800"
              }`}
            />
          ))}
        </View>
      </View>

      {/* CTA Buttons - Matching the image style */}
      <View
        className="px-6 pb-12 gap-4"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <Animated.View entering={FadeInDown.delay(600)}>
          <Pressable
            onPress={handleGetStarted}
            className="bg-white h-16 rounded-2xl items-center justify-center active:opacity-95"
            style={{
              shadowColor: "#fff",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }}
          >
            <Text className="text-black text-lg font-heading-bold">
              {t("common.getStarted.buttons.getStarted")}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700)}>
          <Pressable
            onPress={handleSignIn}
            className="bg-neutral-900/50 border border-neutral-800 h-16 rounded-2xl items-center justify-center active:opacity-70"
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
