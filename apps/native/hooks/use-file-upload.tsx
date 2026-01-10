import { useState, useCallback, useRef } from "react";
import {
  useToast,
  Toast,
  Spinner,
  type ToastComponentProps,
} from "heroui-native";
import { View } from "react-native";
import { useLocalization } from "@/localization/hooks/use-localization";
import { api } from "@be-ntc/backend/convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query"; // Add this
import { useMutation } from "@tanstack/react-query";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { t } = useLocalization();

  const generateUploadUrlMutation = useMutation({
    mutationFn: useConvexMutation(api.files.generateUploadUrl),
  });

  // Use a unique ID for this hook instance, STABLE across renders
  const LOADING_TOAST_ID = useRef(
    "upload-loading-" + Math.random().toString(36).substring(7)
  ).current;

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

      const shownId = toast.show({
        id: LOADING_TOAST_ID,
        duration: "persistent",
        component: renderUploadToast,
      });
      console.log(
        "[useFileUpload] Toast shown. Ref ID:",
        LOADING_TOAST_ID,
        "Returned ID:",
        shownId
      );

      try {
        console.log("[useFileUpload] 1/3: Reading local file...");
        const fileData = await fetch(uri);
        if (!fileData.ok) {
          throw new Error("Failed to read local file from disk");
        }
        const blob = await fileData.blob();
        console.log("[useFileUpload] 1/3: Blob size:", blob.size);

        console.log(
          "[useFileUpload] 2/3: Requesting upload URL via Mutation..."
        );
        const postUrl = await generateUploadUrlMutation.mutateAsync({});
        console.log("[useFileUpload] 2/3: Got URL");

        console.log("[useFileUpload] 3/3: POSTing data...");
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type || "image/jpeg" },
          body: blob,
        });

        if (!result.ok) {
          throw new Error(`Upload failed with status ${result.status}`);
        }

        const { storageId } = (await result.json()) as { storageId: string };
        console.log("[useFileUpload] 🎉 COMPLETE! storageId:", storageId);

        try {
          if (shownId) toast.hide(shownId);
          toast.hide(LOADING_TOAST_ID);
        } catch (e) {}

        toast.show({
          variant: "success",
          label: t("common.fileUpload.success.title"),
          description: t("common.fileUpload.success.description"),
          duration: 3000,
        });

        return storageId;
      } catch (error: any) {
        console.error("[useFileUpload] ❌ FATAL ERROR:", error);

        try {
          if (shownId) toast.hide(shownId);
          toast.hide(LOADING_TOAST_ID);
        } catch (e) {}

        toast.show({
          variant: "danger",
          label: t("common.fileUpload.error.title"),
          description:
            error?.message || t("common.fileUpload.error.description"),
          duration: 5000,
        });

        throw error;
      } finally {
        console.log(
          "[useFileUpload] Entering finally block. Hiding toast ID:",
          LOADING_TOAST_ID
        );
        try {
          toast.hide(LOADING_TOAST_ID);
          if (shownId) toast.hide(shownId);
        } catch (e) {
          console.error("[useFileUpload] Error hiding toast:", e);
          toast.hide("all");
        }

        setIsUploading(false);
      }
    },
    [t, toast, LOADING_TOAST_ID, generateUploadUrlMutation]
  );

  return { uploadFile, isUploading };
}
