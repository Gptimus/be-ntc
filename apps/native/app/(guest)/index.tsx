import { useLocalization } from "@/localization/hooks/use-localization";
import { storageHelpers } from "@/lib/storage";
import { useRouter } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
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
  const backgroundColor = useThemeColor("background");
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

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

  const renderFeature = ({ item }: { item: (typeof FEATURES)[0] }) => (
    <View style={{ width }} className="items-center px-8">
      <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center mb-8 border border-primary/20">
        <StyledHugeIcon icon={item.icon} size={48} className="text-primary" />
      </View>
      <Text className="text-3xl font-heading-bold text-foreground text-center mb-4">
        {t(`common.getStarted.features.${item.key}.title`)}
      </Text>
      <Text className="text-lg text-muted text-center font-sans leading-relaxed">
        {t(`common.getStarted.features.${item.key}.description`)}
      </Text>
    </View>
  );

  return (
    <View
      className="flex-1"
      style={{ backgroundColor, paddingTop: insets.top }}
    >
      {/* Top Header */}
      <View className="flex-row justify-end px-6 py-2">
        <Animated.View entering={FadeIn.delay(200)}>
          <Pressable onPress={handleSkip} className="active:opacity-70 p-2">
            <Text className="text-muted text-sm font-sans-medium">
              {t("common.getStarted.buttons.skip")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      <View className="flex-1 justify-center">
        {/* Feature Swiper */}
        <View style={{ height: 400 }}>
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
        </View>

        {/* Dots Indicator */}
        <View className="flex-row gap-2 self-center mt-8 px-8">
          {FEATURES.map((_, index) => (
            <View
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-8 bg-primary" : "w-1.5 bg-muted/30"
              }`}
            />
          ))}
        </View>
      </View>

      {/* CTA Buttons */}
      <View
        className="px-6 pb-12 gap-3"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <Animated.View entering={FadeInDown.delay(400)}>
          <Pressable
            onPress={handleGetStarted}
            className="bg-primary h-14 rounded-2xl items-center justify-center active:opacity-90"
          >
            <Text className="text-primary-foreground text-lg font-heading-semi-bold">
              {t("common.getStarted.buttons.getStarted")}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)}>
          <Pressable
            onPress={handleSignIn}
            className="bg-surface border border-border h-14 rounded-2xl items-center justify-center active:opacity-70"
          >
            <Text className="text-foreground text-lg font-heading-medium">
              {t("common.getStarted.buttons.signIn")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
