import { unlink, access } from "fs/promises";
import { constants } from "fs";

/**
 * Clean up uploaded files after email sending
 * @param {Array} files - Array of uploaded file objects
 * @returns {Promise<void>}
 */
export const cleanupUploadedFiles = async (files) => {
  if (!files || files.length === 0) {
    return;
  }

  const deletePromises = files.map(async (file) => {
    try {
      // Check if file exists before attempting to delete
      await access(file.path, constants.F_OK);
      await unlink(file.path);
      console.log(`Cleaned up file: ${file.originalname}`);
    } catch (error) {
      // File doesn't exist or already deleted, ignore error
      console.log(
        `File already cleaned up or doesn't exist: ${file.originalname}`
      );
    }
  });

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error during file cleanup:", error);
  }
};

/**
 * Get file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Human readable file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Validate file type based on MIME type
 * @param {string} mimeType - File MIME type
 * @returns {boolean} True if file type is allowed
 */
export const isValidFileType = (mimeType) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
    "application/zip",
    "application/x-zip-compressed",
  ];

  return allowedTypes.includes(mimeType);
};

/**
 * Get file extension from filename
 * @param {string} filename - File name
 * @returns {string} File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};
