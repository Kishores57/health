import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate a unique filename without the extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const publicId = file.fieldname + '-' + uniqueSuffix;

    return {
      folder: 'health-hub-reports',
      public_id: publicId + '.pdf', // ensure extension is retained
      resource_type: 'raw', // Use raw for non-image files like PDFs
    } as any;
  },
});

// File filter to accept only PDF
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

export const uploadMiddleware = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
