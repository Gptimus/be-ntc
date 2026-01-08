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
  console.log("[useFileUpload] Hook Initialized");
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
              <Toast.Description className="text-muted-foreground text-xs">
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
      console.log("[useFileUpload] Starting upload for:", uri);
      setIsUploading(true);

      toast.show({
        id: LOADING_TOAST_ID,
        duration: "persistent",
        component: renderUploadToast,
      });

      try {
        // Step 1: Get the upload URL
        console.log("[useFileUpload] 1. Getting upload URL...");
        const uploadUrl = await generateUploadUrl();
        console.log("[useFileUpload] 2. Upload URL received");

        // Step 2: GET the file as a blob
        // In React Native, fetch(uri) works for local file:// URIs
        const fileResponse = await fetch(uri);
        const blob = await fileResponse.blob();
        console.log("[useFileUpload] 3. File blob created, size:", blob.size);

        // Step 3: POST the blob to Convex
        console.log("[useFileUpload] 4. POSTing to Convex...");
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type || "image/jpeg" },
          body: blob,
        });

        if (!result.ok) {
          throw new Error(`Upload failed with status ${result.status}`);
        }

        const { storageId } = (await result.json()) as { storageId: string };
        console.log("[useFileUpload] 5. Upload success, storageId:", storageId);

        // Success UI
        toast.hide(LOADING_TOAST_ID);
        toast.show({
          variant: "success",
          label: t("common.fileUpload.success.title"),
          description: t("common.fileUpload.success.description"),
          duration: 3000,
        });

        return storageId;
      } catch (error: any) {
        console.error("[useFileUpload] FATAL ERROR:", error);
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
