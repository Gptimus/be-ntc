import React, { useState } from "react";
import { View, Image, Text, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import { Camera01Icon } from "@hugeicons/core-free-icons";
import { cn, PressableFeedback, useToast, Dialog, Button } from "heroui-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { useAppTheme } from "@/contexts/app-theme-context";
import {
  triggerHaptic,
  triggerHapticError,
  triggerHapticSuccess,
} from "@/lib/haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

/**
 * Hook to handle Image Picker logic
 */
export function useImagePicker() {
  const { t } = useLocalization();
  const { toast } = useToast();
  const [permissionStatus, requestPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const { isLight } = useAppTheme();

  const pickImage = async (
    onSelect: (uri: string) => void,
    options?: ImagePicker.ImagePickerOptions
  ) => {
    if (permissionStatus?.status !== ImagePicker.PermissionStatus.GRANTED) {
      const { status } = await requestPermission();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        triggerHapticError();
        setIsPermissionDialogOpen(true);
        return;
      }
    }

    triggerHaptic();

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        ...options,
      });

      if (!result.canceled) {
        triggerHapticSuccess();
        onSelect(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      triggerHapticError();
      toast.show({
        variant: "danger",
        label: t("common.error.generic.title"),
        description: t("common.error.generic.description"),
      });
    }
  };

  return {
    pickImage,
    isPermissionDialogOpen,
    setIsPermissionDialogOpen,
  };
}

interface FormImagePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
}

export function FormImagePicker<T extends FieldValues>({
  control,
  name,
  label,
  error,
}: FormImagePickerProps<T>) {
  const { pickImage, isPermissionDialogOpen, setIsPermissionDialogOpen } =
    useImagePicker();
  const { t } = useLocalization();
  const { isLight } = useAppTheme();
  return (
    <>
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

            <PressableFeedback
              onPress={() => pickImage(onChange)}
              className={cn(
                "h-48 w-full rounded-3xl border-2 border-dashed items-center justify-center overflow-hidden bg-content1",
                error
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border bg-content1"
              )}
            >
              <PressableFeedback.Ripple
                animation={{
                  backgroundColor: { value: isLight ? "black" : "white" },
                  opacity: { value: [0, 0.05, 0] },
                  progress: { baseDuration: 600 },
                }}
              />
              {value ? (
                <Animated.View
                  entering={FadeIn.duration(400)}
                  className="w-full h-full"
                >
                  <Image
                    source={{ uri: value }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/10 items-center justify-center">
                    <View className="bg-background/80 px-4 py-2 rounded-full backdrop-blur-md">
                      <Text className="text-foreground text-xs font-sans-medium">
                        {t("common.imagePicker.changeImage")}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              ) : (
                <View className="items-center justify-center gap-3">
                  <Animated.View
                    entering={FadeInDown.delay(100)}
                    className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center"
                  >
                    <StyledHugeIcon
                      icon={Camera01Icon}
                      size={32}
                      className="text-primary"
                    />
                  </Animated.View>
                  <View className="items-center">
                    <Text className="text-foreground font-sans-medium text-base text-center px-2">
                      {t("common.imagePicker.tapToUpload")}
                    </Text>
                    <Text className="text-muted font-sans text-xs mt-1">
                      {t("common.imagePicker.supportMsg")}
                    </Text>
                  </View>
                </View>
              )}
            </PressableFeedback>
            {error && (
              <Animated.Text
                entering={FadeInDown.duration(200)}
                className="text-destructive text-sm mt-2 px-2 font-sans"
              >
                {error}
              </Animated.Text>
            )}
          </View>
        )}
      />

      <Dialog
        isOpen={isPermissionDialogOpen}
        onOpenChange={setIsPermissionDialogOpen}
      >
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Close />
            <View className="mb-5 gap-1.5">
              <Dialog.Title>
                {t("common.imagePicker.permissionRequired")}
              </Dialog.Title>
              <Dialog.Description>
                {t("common.imagePicker.permissionDenied")}
              </Dialog.Description>
            </View>
            <View className="flex-row justify-end gap-3">
              <Dialog.Close asChild>
                <Button variant="ghost" size="sm">
                  {t("common.datePicker.cancel")}
                </Button>
              </Dialog.Close>
              <Button
                size="sm"
                onPress={() => {
                  setIsPermissionDialogOpen(false);
                  Linking.openSettings();
                }}
              >
                {t("common.imagePicker.openSettings")}
              </Button>
            </View>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}
