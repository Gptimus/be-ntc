import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { withUniwind } from "uniwind";

type HugeIconProps = React.ComponentProps<typeof HugeiconsIcon>;

const themeColors: Record<string, string> = {
  primary: "#9e19b3",
  secondary: "#b39e19",
  accent: "#9e19b3",
  danger: "#ef4444",
  destructive: "#ef4444",
  success: "#22c55e",
  foreground: "#000000", // Fallback for foreground
  muted: "#71717a",
};

// Wrapper to extract color from style and pass it to color prop
// strictly for Hugeicons which may not respect style.color directly
const HugeIconWrapper = ({ style, ...props }: HugeIconProps) => {
  const flatStyle = StyleSheet.flatten(style) as TextStyle;
  let color = flatStyle?.color?.toString() || (props.color as string);

  // If the color is a theme variable name, resolve it to hex
  if (color && themeColors[color]) {
    color = themeColors[color];
  }

  return <HugeiconsIcon {...props} style={style} color={color} />;
};

export const StyledHugeIcon = withUniwind(HugeIconWrapper);
