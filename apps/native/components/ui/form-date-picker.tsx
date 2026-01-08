import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import DatePicker from "react-native-date-picker";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { cn, useThemeColor } from "heroui-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Calendar03Icon } from "@hugeicons/core-free-icons";

interface FormDatePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  placeholder?: string;
}

export function FormDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  error,
  placeholder,
}: FormDatePickerProps<T>) {
  const [open, setOpen] = useState(false);
  const textColor = useThemeColor("foreground");
  const { t } = useLocalization();
  const title = placeholder || t("common.datePicker.placeholder");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="mb-4">
          {label && (
            <Text
              className="text-base text-foreground mb-1.5"
              style={{ fontFamily: "Outfit_500Medium" }}
            >
              {label}
            </Text>
          )}
          <Pressable
            onPress={() => setOpen(true)}
            className={cn(
              "h-14 flex-row items-center justify-between px-4 rounded-2xl border",
              error ? "border-danger" : "border-border",
              "bg-content2"
            )}
          >
            <Text
              className={cn(
                "text-base font-sans",
                value ? "text-foreground" : "text-muted"
              )}
              style={{ fontFamily: "Outfit_400Regular" }}
            >
              {value ? value.toLocaleDateString() : title}
            </Text>
            <StyledHugeIcon
              icon={Calendar03Icon}
              size={20}
              className="text-muted"
            />
          </Pressable>

          {error && (
            <Text className="text-danger text-sm mt-1 font-sans">{error}</Text>
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
              setOpen(false);
              onChange(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
            theme="auto"
            // textColor={textColor}
          />
        </View>
      )}
    />
  );
}
