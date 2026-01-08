import { useMutation } from "convex/react";
import { api } from "@be-ntc/backend/convex/_generated/api";
import { useState, useCallback } from "react";
import {
  useToast,
  Toast,
  Spinner,
  type ToastComponentProps,
} from "heroui-native";
import { View } from "react-native";
import { useLocalization } from "@/localization/hooks/use-localization";

export function useFileUpload() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useLocalization();

  const LOADING_TOAST_ID = "upload-loading-toast";

  const renderUploadToast = useCallback(
    (props: ToastComponentProps) => {
      return (
        <Toast variant="default" placement="top" {...props}>
          <View className="flex-row items-center gap-4 px-2">
            <Spinner size="sm" className="text-primary" />
            <View className="flex-1">
              <Toast.Title className="text-foreground text-base">
                {t("common.fileUpload.uploading")}
              </Toast.Title>
              <Toast.Description className="text-foreground text-xs">
                {t("common.fileUpload.pleaseWait")}
              </Toast.Description>
            </View>
          </View>
        </Toast>
      );
    },
    [t]
  );

  const uploadFile = useCallback(
    async (uri: string) => {
      console.log("[useFileUpload] 🚀 UPLOAD START:", uri);
      setIsUploading(true);

      toast.show({
        id: LOADING_TOAST_ID,
        duration: "persistent",
        component: renderUploadToast,
      });

      try {
        // Step 1: Get the file from the URI pointing to a local file
        console.log("[useFileUpload] 1/3: Reading local file...");
        const fileData = await fetch(uri);
        if (!fileData.ok) {
          console.error("[useFileUpload] Error loading local file:", fileData);
          throw new Error("Failed to read local file from disk");
        }
        const blob = await fileData.blob();
        console.log(
          "[useFileUpload] 1/3: SUCCESS! Blob created, size:",
          blob.size
        );

        // Step 2: Get upload url from Convex
        console.log(
          "[useFileUpload] 2/3: Requesting upload URL from Convex..."
        );
        const postUrl = await generateUploadUrl();
        console.log("[useFileUpload] 2/3: SUCCESS! Received URL:", postUrl);

        // Step 3: Actually send the file contents to Convex
        console.log("[useFileUpload] 3/3: POSTing binary data to storage...");
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type || "image/jpeg" },
          body: blob,
        });

        if (!result.ok) {
          console.error("[useFileUpload] Upload POST failed:", result.status);
          throw new Error(`Upload failed with status ${result.status}`);
        }

        const { storageId } = (await result.json()) as { storageId: string };
        console.log("[useFileUpload] 🎉 COMPLETE! storageId:", storageId);

        toast.hide(LOADING_TOAST_ID);
        toast.show({
          variant: "success",
          label: t("common.fileUpload.success.title"),
          description: t("common.fileUpload.success.description"),
          duration: 3000,
        });

        return storageId;
      } catch (error: any) {
        console.error("[useFileUpload] ❌ FATAL ERROR:", error);
        toast.hide(LOADING_TOAST_ID);
        toast.show({
          variant: "danger",
          label: t("common.fileUpload.error.title"),
          description:
            error?.message || t("common.fileUpload.error.description"),
          duration: 5000,
        });
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [generateUploadUrl, t, renderUploadToast]
  );

  return { uploadFile, isUploading };
}
