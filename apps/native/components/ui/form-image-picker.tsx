import React, { useState, useCallback, useEffect, useRef } from "react";
import { View, Image, Text, Linking } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { StyledHugeIcon } from "@/components/ui/styled-huge-icon";
import {
  Camera01Icon,
  Image01Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import {
  cn,
  PressableFeedback,
  Dialog,
  Button,
  BottomSheet,
} from "heroui-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { useAppTheme } from "@/contexts/app-theme-context";
import {
  triggerHaptic,
  triggerHapticError,
  triggerHapticSuccess,
} from "@/lib/haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useFileUpload } from "@/hooks/use-file-upload";

/**
 * Hook to handle Image Picker logic with source selection
 */
export function useImagePicker(
  onUploadingChange?: (isUploading: boolean) => void,
  onUploadSuccess?: (storageId: string) => void
) {
  const [libraryPermission, requestLibraryPermission] =
    ImagePicker.useMediaLibraryPermissions();
  const [cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [permissionType, setPermissionType] = useState<"library" | "camera">(
    "library"
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { uploadFile, isUploading: isFileUploading } = useFileUpload();

  // Store mapping of local URIs to storageIds
  const uploadedFilesRef = useRef<Map<string, string>>(new Map());

  console.log("[useImagePicker] Render, isFileUploading:", isFileUploading);

  const isUploading = isFileUploading;

  useEffect(() => {
    console.log("[useImagePicker] isUploading changed:", isUploading);
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const openPicker = useCallback(() => {
    triggerHaptic();
    setIsSheetOpen(true);
  }, []);

  const handleImageResult = async (
    result: ImagePicker.ImagePickerResult,
    onSelect: (uri: string) => void,
    shouldUpload: boolean
  ) => {
    console.log(
      "[useImagePicker] handleImageResult, canceled:",
      result.canceled
    );

    if (!result.canceled) {
      triggerHapticSuccess();
      const localUri = result.assets[0].uri;
      console.log("[useImagePicker] localUri:", localUri);

      if (shouldUpload) {
        // 🔥 CRITICAL FIX: Show preview BUT don't block on upload completion
        console.log("[useImagePicker] Setting local preview immediately");
        onSelect(localUri);

        // 🔥 Start upload WITHOUT awaiting it immediately
        console.log("[useImagePicker] Starting background upload...");

        // Store the upload promise but don't await it here
        const uploadPromise = uploadFile(localUri)
          .then((storageId) => {
            console.log(
              "[useImagePicker] Upload complete, storageId:",
              storageId
            );

            // Store the mapping
            uploadedFilesRef.current.set(localUri, storageId);
            console.log(
              "[useImagePicker] Stored mapping:",
              localUri,
              "->",
              storageId
            );

            // Notify parent about success
            onUploadSuccess?.(storageId);
            return storageId;
          })
          .catch((error) => {
            console.error("[useImagePicker] Upload failed:", error);
            // Optionally, you could show an error state in the UI here
            throw error; // Re-throw if you want the error to bubble up
          });

        // 🔥 IMPORTANT: Return the promise so the caller can await if needed
        // BUT don't await here - let the upload happen in background
        return uploadPromise;
      } else {
        // If not uploading, just set the local URI
        onSelect(localUri);
      }
    }
  };

  const pickFromGallery = async (
    onSelect: (uri: string) => void,
    options?: ImagePicker.ImagePickerOptions,
    shouldUpload: boolean = false
  ) => {
    triggerHaptic();
    setIsSheetOpen(false);

    if (libraryPermission?.status !== ImagePicker.PermissionStatus.GRANTED) {
      const { status } = await requestLibraryPermission();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        triggerHapticError();
        setPermissionType("library");
        setIsPermissionDialogOpen(true);
        return;
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        ...options,
      });

      await handleImageResult(result, onSelect, shouldUpload);
    } catch (error) {
      console.error("Gallery error:", error);
      triggerHapticError();
    }
  };

  const pickFromCamera = async (
    onSelect: (uri: string) => void,
    options?: ImagePicker.ImagePickerOptions,
    shouldUpload: boolean = false
  ) => {
    triggerHaptic();
    setIsSheetOpen(false);

    if (cameraPermission?.status !== ImagePicker.PermissionStatus.GRANTED) {
      const { status } = await requestCameraPermission();
      if (status !== ImagePicker.PermissionStatus.GRANTED) {
        triggerHapticError();
        setPermissionType("camera");
        setIsPermissionDialogOpen(true);
        return;
      }
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        ...options,
      });

      await handleImageResult(result, onSelect, shouldUpload);
    } catch (error) {
      console.error("Camera error:", error);
      triggerHapticError();
    }
  };

  const getStorageId = useCallback((localUri: string): string | undefined => {
    return uploadedFilesRef.current.get(localUri);
  }, []);

  return {
    openPicker,
    pickFromGallery,
    pickFromCamera,
    isSheetOpen,
    setIsSheetOpen,
    isPermissionDialogOpen,
    setIsPermissionDialogOpen,
    permissionType,
    isUploading,
    getStorageId,
  };
}

interface FormImagePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  error?: string;
  shouldUpload?: boolean;
  isDisabled?: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
  onUploadSuccess?: (storageId: string) => void;
}

export function FormImagePicker<T extends FieldValues>({
  control,
  name,
  label,
  error,
  shouldUpload = true,
  isDisabled = false,
  onUploadingChange,
  onUploadSuccess,
}: FormImagePickerProps<T>) {
  const {
    openPicker,
    pickFromGallery,
    pickFromCamera,
    isSheetOpen,
    setIsSheetOpen,
    isPermissionDialogOpen,
    setIsPermissionDialogOpen,
    permissionType,
    isUploading,
  } = useImagePicker(onUploadingChange, onUploadSuccess);

  const { t } = useLocalization();
  const { isLight } = useAppTheme();

  useEffect(() => {
    console.log(`[FormImagePicker] MOUNTED: ${name}`);
    return () => console.log(`[FormImagePicker] UNMOUNTED: ${name}`);
  }, [name]);

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
              onPress={openPicker}
              isDisabled={isDisabled || isUploading}
              className={cn(
                "h-48 w-full rounded-3xl border-2 border-dashed items-center justify-center overflow-hidden bg-default",
                error
                  ? "border-destructive/50 bg-destructive/5"
                  : "border-border bg-default"
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

              {isUploading && (
                <Animated.View
                  entering={FadeIn.duration(200)}
                  className="absolute inset-0 bg-background/60 items-center justify-center"
                />
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

            {/* Selection Bottom Sheet */}
            <BottomSheet isOpen={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <BottomSheet.Portal>
                <BottomSheet.Overlay />
                <BottomSheet.Content
                  snapPoints={["40%"]}
                  backgroundClassName="bg-background border border-border"
                  handleIndicatorClassName="bg-muted-foreground/30 w-12"
                  contentContainerClassName="px-6 pt-2 pb-10"
                >
                  <View className="mb-6 flex-row items-center justify-between gap-2">
                    <View className="flex-1">
                      <BottomSheet.Title className="text-xl font-heading-bold text-foreground mb-1">
                        {t("common.imagePicker.selectSource")}
                      </BottomSheet.Title>
                      <BottomSheet.Description className="text-sm text-foreground font-sans">
                        {t("common.imagePicker.optimizationInfo")}
                      </BottomSheet.Description>
                    </View>
                    <PressableFeedback
                      onPress={() => {
                        triggerHaptic();
                        setIsSheetOpen(false);
                      }}
                      className="size-10 items-center justify-center rounded-full bg-default"
                    >
                      <StyledHugeIcon
                        icon={Cancel01Icon}
                        size={20}
                        className="text-foreground"
                      />
                    </PressableFeedback>
                  </View>

                  <View className="flex-row gap-4">
                    <PressableFeedback
                      className="flex-1 items-center justify-center p-6 bg-default rounded-3xl border border-border/50"
                      onPress={() => pickFromCamera(onChange, {}, shouldUpload)}
                    >
                      <PressableFeedback.Ripple />
                      <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
                        <StyledHugeIcon
                          icon={Camera01Icon}
                          size={32}
                          color="#9e19b3"
                        />
                      </View>
                      <Text className="text-foreground font-heading-semibold text-base text-center px-2">
                        {t("common.imagePicker.takePhoto")}
                      </Text>
                    </PressableFeedback>

                    <PressableFeedback
                      className="flex-1 items-center justify-center p-6 bg-default rounded-3xl border border-border/50"
                      onPress={() =>
                        pickFromGallery(onChange, {}, shouldUpload)
                      }
                    >
                      <PressableFeedback.Ripple />
                      <View className="w-16 h-16 rounded-full bg-secondary/10 items-center justify-center mb-4">
                        <StyledHugeIcon
                          icon={Image01Icon}
                          size={32}
                          className="text-secondary"
                        />
                      </View>
                      <Text className="text-foreground font-heading-semibold text-base text-center px-2">
                        {t("common.imagePicker.fromGallery")}
                      </Text>
                    </PressableFeedback>
                  </View>
                </BottomSheet.Content>
              </BottomSheet.Portal>
            </BottomSheet>
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
                {permissionType === "camera"
                  ? t("common.imagePicker.permissionDenied") // You might want a specific camera permission denied message later
                  : t("common.imagePicker.permissionDenied")}
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
                  triggerHaptic();
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
