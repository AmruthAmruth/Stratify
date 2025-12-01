import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    return {
      folder: "company_profiles",
      public_id: `${Date.now()}-${file.originalname}`,
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    };
  },
});

export const upload = multer({ storage });

// Chat media upload configuration
const chatMediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_req, file) => {
    const fileType = file.mimetype.split("/")[0]; // 'image', 'video', 'application', etc.

    // Determine resource type and allowed formats based on file type
    let resourceType: "image" | "video" | "raw" = "raw";
    let allowedFormats: string[] = [];

    if (fileType === "image") {
      resourceType = "image";
      allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"];
    } else if (fileType === "video") {
      resourceType = "video";
      allowedFormats = ["mp4", "avi", "mov", "wmv", "webm"];
    } else {
      // Documents and other files
      resourceType = "raw";
      allowedFormats = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip"];
    }

    return {
      folder: "chat_media",
      public_id: `${Date.now()}-${file.originalname}`,
      resource_type: resourceType,
      allowed_formats: allowedFormats,
    };
  },
});

export const chatMediaUpload = multer({
  storage: chatMediaStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (_req, file, cb) => {
    // Allowed mime types
    const allowedMimeTypes = [
      // Images
      "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
      // Videos
      "video/mp4", "video/avi", "video/quicktime", "video/x-msvideo", "video/webm",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "application/zip"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not supported: ${file.mimetype}`));
    }
  }
});
