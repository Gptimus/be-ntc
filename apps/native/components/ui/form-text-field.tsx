import React from "react";
import { View } from "react-native";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { TextField } from "heroui-native";
import { cn } from "heroui-native";

interface FormTextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  error?: string;
  className?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  error,
  className,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: FormTextFieldProps<T>) {
  return (
    <View className={cn(className)}>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField isInvalid={!!error}>
            <TextField.Label
              className="text-foreground"
              style={{ fontFamily: "Outfit_500Medium" }}
            >
              {label}
            </TextField.Label>
            <TextField.Input
              placeholder={placeholder}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              className="rounded-xl h-12"
              style={{ fontFamily: "Outfit_400Regular" }}
            />
            <TextField.ErrorMessage className="font-sans">
              {error}
            </TextField.ErrorMessage>
          </TextField>
        )}
      />
    </View>
  );
}
