import React from "react";
import { View, Text } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { RadioGroup, Surface } from "heroui-native";
import { triggerHaptic } from "@/lib/haptics";
import { cn } from "heroui-native";

interface RadioOption {
  label: string;
  value: string;
}

interface FormInlineRadioProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  options: RadioOption[];
  error?: string;
  className?: string;
}

export function FormInlineRadio<T extends FieldValues>({
  control,
  name,
  label,
  description,
  options,
  error,
  className,
}: FormInlineRadioProps<T>) {
  return (
    <View className={cn(className)}>
      {label && (
        <Text
          className="text-base text-foreground mb-2 px-1"
          style={{ fontFamily: "Outfit_500Medium" }}
        >
          {label}
        </Text>
      )}
      {description && (
        <Text
          className="text-muted text-sm mb-4 px-1"
          style={{ fontFamily: "Outfit_400Regular" }}
        >
          {description}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Surface className="w-full p-2 bg-default rounded-xl">
            <RadioGroup
              value={value}
              onValueChange={(val) => {
                triggerHaptic();
                onChange(val);
              }}
              isInvalid={!!error}
              className="flex-row gap-2"
            >
              {options.map((option) => (
                <RadioGroup.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "flex-1 flex-row items-center gap-3 px-4 h-12 rounded-xl border border-transparent bg-background dark:bg-transparent"
                  )}
                >
                  <RadioGroup.Indicator />
                  <RadioGroup.Label className="flex-1 font-sans-medium text-foreground text-sm">
                    {option.label}
                  </RadioGroup.Label>
                </RadioGroup.Item>
              ))}
            </RadioGroup>
            {error && (
              <RadioGroup.ErrorMessage className="mt-2 px-2">
                {error}
              </RadioGroup.ErrorMessage>
            )}
          </Surface>
        )}
      />
    </View>
  );
}
