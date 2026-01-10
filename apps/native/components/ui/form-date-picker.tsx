import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import DatePicker from "react-native-date-picker";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { cn } from "heroui-native";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { triggerHaptic, triggerHapticSuccess } from "@/lib/haptics";
import { useLocalization } from "@/localization/hooks/use-localization";
import { useAppTheme } from "@/contexts/app-theme-context";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  placeholder?: string;
  isDisabled?: boolean;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  error,
  placeholder,
  isDisabled = false,
}: FormDatePickerProps<T>) {
  const { t } = useLocalization();
  const [open, setOpen] = useState(false);
  const title = placeholder || t("common.datePicker.placeholder");
  const { isLight } = useAppTheme();

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View>
          {label && (
            <Text
              className="text-base text-foreground mb-2 px-1"
              style={{ fontFamily: "Outfit_500Medium" }}
            >
              {label}
            </Text>
          )}
          <Animated.View style={animatedStyle}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => {
                triggerHaptic();
                setOpen(true);
              }}
              className={cn(
                "h-12 flex-row items-center justify-between pr-5 pl-3 rounded-xl bg-default",
                error
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border bg-default"
              )}
            >
              <View className="flex-row items-center gap-4">
                <View
                  className={cn(
                    "size-8 rounded-lg items-center justify-center",
                    value ? "bg-primary/10" : "bg-muted/10"
                  )}
                >
                  <StyledHugeIcon
                    icon={Calendar03Icon}
                    size={18}
                    className={value ? "text-primary" : "text-foreground"}
                  />
                </View>
                <View>
                  {!value && (
                    <Text className="text-foreground text-xs font-sans-medium tracking-wide uppercase">
                      {label || t("common.onboarding.dateOfBirth")}
                    </Text>
                  )}
                  <Text
                    className={cn(
                      "text-base font-sans-medium",
                      value ? "text-foreground" : "text-foreground/60"
                    )}
                  >
                    {value ? value.toLocaleDateString() : title}
                  </Text>
                </View>
              </View>

              {value && (
                <View className="bg-primary/5 px-3 py-1 rounded-full">
                  <Text className="text-primary text-[10px] font-sans-bold uppercase">
                    {t("common.common.selected")}
                  </Text>
                </View>
              )}
            </Pressable>
          </Animated.View>

          {error && (
            <Animated.Text
              entering={FadeInDown.duration(200)}
              className="text-destructive text-sm mt-2 px-2 font-sans"
            >
              {error}
            </Animated.Text>
          )}

          <DatePicker
            modal
            open={open}
            date={value || new Date()}
            mode="date"
            title={title}
            confirmText={t("common.datePicker.confirm")}
            cancelText={t("common.datePicker.cancel")}
            onConfirm={(date) => {
              triggerHapticSuccess();
              setOpen(false);
              onChange(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
            theme={isLight ? "light" : "dark"}
          />
        </View>
      )}
    />
  );
}
