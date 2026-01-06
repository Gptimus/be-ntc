import { Spinner, useThemeColor } from "heroui-native";
import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface FullScreenLoadingProps {
  title?: string;
  subtitle?: string;
}

export function FullScreenLoading({ title, subtitle }: FullScreenLoadingProps) {
  const backgroundColor = useThemeColor("background");
  const accentColor = useThemeColor("accent");

  return (
    <View
      style={{ backgroundColor }}
      className="flex-1 items-center justify-center bg-background px-8"
    >
      <Spinner size="lg" color={accentColor} />

      {(title || subtitle) && (
        <Animated.View
          entering={FadeIn.delay(200).duration(800)}
          className="items-center mt-6"
        >
          {title && (
            <Text className="text-foreground text-xl font-heading-bold text-center mb-2">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-muted text-base font-sans text-center leading-relaxed">
              {subtitle}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
}
