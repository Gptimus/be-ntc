import { useLocalization } from "@/localization/hooks/use-localization";
import { storageHelpers } from "@/lib/storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ImageBackground,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CreditCardIcon,
  GridTableIcon,
  Exchange01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";

const { width } = Dimensions.get("window");

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
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
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
    <View style={{ width }} className="px-8 justify-end">
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
        className="flex-row justify-end px-6 z-20"
      >
        <Pressable onPress={handleSkip} className="active:opacity-70 p-4">
          <Text className="text-white/50 text-xs font-sans-bold tracking-[2px]">
            {t("common.getStarted.buttons.skip").toUpperCase()}
          </Text>
        </Pressable>
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
        <View className="flex-row gap-2 px-8 mb-10">
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
          className="px-6 gap-4"
          style={{ paddingBottom: insets.bottom + 20 }}
        >
          <Animated.View entering={FadeInDown.delay(400)}>
            <Pressable
              onPress={handleNext}
              className="h-16 rounded-2xl items-center bg-primary justify-center active:opacity-95 shadow-lg shadow-primary/30"
            >
              <Text className="text-primary-foreground text-lg font-heading-bold tracking-tight">
                {activeIndex === FEATURES.length - 1
                  ? t("common.getStarted.buttons.start")
                  : t("common.getStarted.buttons.getStarted")}
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(500)}>
            <Pressable
              onPress={handleSignIn}
              className="bg-white/10 border border-white/10 h-16 rounded-2xl items-center justify-center active:opacity-70 backdrop-blur-md"
            >
              <Text className="text-white text-lg font-heading-bold">
                {t("common.getStarted.buttons.signIn")}
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
