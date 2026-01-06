import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export const triggerHaptic = () => {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
};

export const triggerHapticMedium = () => {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

export const triggerHapticError = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};

export const triggerHapticSuccess = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const triggerHapticSoft = () => {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }
};
