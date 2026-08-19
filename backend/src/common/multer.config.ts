import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * Multer configuration for file uploads
 * @param uploadPath - Path where files will be uploaded (relative to uploads folder)
 * @returns Multer options object
 */
export const multerOptions = (uploadPath: string) => {
  const uploadsDir = join(process.cwd(), 'uploads', uploadPath);

  // Create upload directory if it doesn't exist
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        // Generate unique filename: timestamp-randomstring.extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const name = file.originalname.replace(ext, '');
        cb(null, `${name}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      // Allow only images and PDFs
      const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
      ];

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`Invalid file type: ${file.mimetype}`), false);
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  };
};
