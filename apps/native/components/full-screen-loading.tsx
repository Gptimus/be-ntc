import { Spinner, useThemeColor } from "heroui-native";
import { View } from "react-native";

export function FullScreenLoading() {
  const backgroundColor = useThemeColor("background");
  const accentColor = useThemeColor("accent");

  return (
    <View
      style={{ backgroundColor }}
      className="flex-1 items-center justify-center"
    >
      <Spinner size="lg" color={accentColor} />
    </View>
  );
}
