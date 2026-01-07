export const fileUtils = {
  /**
   * Format file size in human readable format
   */
  formatSize: (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return "0 B";

    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  },

  /**
   * Get file extension from filename
   */
  getExtension: (filename: string): string => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  },

  /**
   * Get filename without extension
   */
  getBasename: (filename: string): string => {
    return filename.substring(0, filename.lastIndexOf(".")) || filename;
  },

  /**
   * Check if file is image
   */
  isImage: (filename: string): boolean => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
    const ext = fileUtils.getExtension(filename).toLowerCase();
    return imageExtensions.includes(ext);
  },

  /**
   * Check if file is video
   */
  isVideo: (filename: string): boolean => {
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
    const ext = fileUtils.getExtension(filename).toLowerCase();
    return videoExtensions.includes(ext);
  },

  /**
   * Check if file is audio
   */
  isAudio: (filename: string): boolean => {
    const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac", "m4a"];
    const ext = fileUtils.getExtension(filename).toLowerCase();
    return audioExtensions.includes(ext);
  },

  /**
   * Get file type category
   */
  getFileType: (filename: string): "image" | "video" | "audio" | "document" | "other" => {
    if (fileUtils.isImage(filename)) return "image";
    if (fileUtils.isVideo(filename)) return "video";
    if (fileUtils.isAudio(filename)) return "audio";
    
    const documentExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"];
    const ext = fileUtils.getExtension(filename).toLowerCase();
    if (documentExtensions.includes(ext)) return "document";
    
    return "other";
  },

  /**
   * Generate safe filename
   */
  sanitizeFilename: (filename: string): string => {
    return filename
      .replace(/[^a-z0-9.-]/gi, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
  },
};
