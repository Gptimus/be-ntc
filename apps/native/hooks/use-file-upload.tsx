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
            <Spinner size="sm" color="#9e19b3" />
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

  const uploadFile = async (uri: string) => {
    console.log("[useFileUpload] uploadFile STARTED with URI:", uri);
    setIsUploading(true);

    toast.show({
      id: LOADING_TOAST_ID,
      duration: "persistent",
      component: renderUploadToast,
    });

    try {
      console.log("[useFileUpload] 1. Requesting upload URL from Convex...");
      // Add a timeout to see if generateUploadUrl is hanging
      const uploadUrlPromise = generateUploadUrl();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("generateUploadUrl timed out")), 10000)
      );
      
      const uploadUrl = await Promise.race([uploadUrlPromise, timeoutPromise]) as string;
      console.log("[useFileUpload] 2. Received upload URL:", uploadUrl);

      // 2. Prepare the file and upload using XMLHttpRequest for better RN support
      const storageId = await new Promise<string>((resolve, reject) => {
        console.log("[useFileUpload] 3. Starting file read, URI:", uri);

        // First, read the local file into a Blob
        const getXhr = new XMLHttpRequest();
        getXhr.open("GET", uri);
        getXhr.responseType = "blob";

        getXhr.onload = () => {
          const blob = getXhr.response;
          if (!blob) {
            console.error("[useFileUpload] Read failed: No blob in response");
            reject(new Error("Failed to read local file"));
            return;
          }

          console.log(
            "[useFileUpload] File read success, type:",
            blob.type,
            "size:",
            blob.size
          );

          // Now, upload the blob
          const postXhr = new XMLHttpRequest();
          postXhr.open("POST", uploadUrl);
          postXhr.timeout = 30000; // 30 second timeout

          postXhr.onload = () => {
            console.log("[useFileUpload] Upload status:", postXhr.status);
            if (postXhr.status >= 200 && postXhr.status < 300) {
              try {
                const response = JSON.parse(postXhr.responseText);
                console.log(
                  "[useFileUpload] Upload success, storageId:",
                  response.storageId
                );
                resolve(response.storageId);
              } catch (e) {
                console.error(
                  "[useFileUpload] Failed to parse response:",
                  postXhr.responseText
                );
                reject(new Error("Failed to parse upload response"));
              }
            } else {
              console.error(
                "[useFileUpload] Upload failed with text:",
                postXhr.responseText
              );
              reject(new Error(`Upload failed with status ${postXhr.status}`));
            }
          };

          postXhr.onerror = (e) => {
            console.error("[useFileUpload] Network error:", e);
            reject(new Error("Network error during upload"));
          };

          postXhr.ontimeout = () => {
            console.error("[useFileUpload] Upload timed out");
            reject(new Error("Upload timed out after 30 seconds"));
          };

          postXhr.setRequestHeader("Content-Type", blob.type || "image/jpeg");
          postXhr.send(blob);
        };

        getXhr.onerror = (e) => {
          console.error("[useFileUpload] Local file access error:", e);
          reject(new Error("Failed to access local file"));
        };
        getXhr.send();
      console.log("[useFileUpload] 4. Upload complete, storageId:", storageId);
      // Success
      toast.hide(LOADING_TOAST_ID);
      toast.show({
        variant: "success",
        label: t("common.fileUpload.success.title"),
        description: t("common.fileUpload.success.description"),
        duration: 3000,
      });

      return storageId;
    } catch (error) {
      console.error("[useFileUpload] FATAL ERROR during upload:", error);
      toast.hide(LOADING_TOAST_ID);
      toast.show({
        variant: "danger",
        label: t("common.fileUpload.error.title"),
        description: t("common.fileUpload.error.description"),
        duration: 4000,
      });
      console.error("Upload error details:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
}
