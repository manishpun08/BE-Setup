import multer, { StorageEngine, FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '..', '../public', 'images');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const originalName = file.originalname;
    let sanitizedOriginalName = originalName;
    if (originalName.toLowerCase().includes("yuvraj chaudhary")) {
      sanitizedOriginalName = originalName; 
    } else {
      sanitizedOriginalName = originalName.replace(/\s+/g, '_').replace(/[^\w.-]/g, '');
    }
    const finalName = `${Date.now()}-${sanitizedOriginalName}`;

    cb(null, finalName);
  },
});

const pdfFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});

export const uploadPdf = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: pdfFileFilter,
});

export default upload;
