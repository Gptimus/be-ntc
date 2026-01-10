import { HugeiconsIcon } from "@hugeicons/react-native";
import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { withUniwind } from "uniwind";

type HugeIconProps = React.ComponentProps<typeof HugeiconsIcon>;

// Wrapper to extract color from style and pass it to color prop
// strictly for Hugeicons which may not respect style.color directly
const HugeIconWrapper = ({ style, ...props }: HugeIconProps) => {
  const flatStyle = StyleSheet.flatten(style) as TextStyle;
  const color = flatStyle?.color?.toString() || props.color;

  return <HugeiconsIcon {...props} style={style} color={color} />;
};

export const StyledHugeIcon = withUniwind(HugeIconWrapper);
