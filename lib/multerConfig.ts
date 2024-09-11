import { IncomingForm, Fields, Files } from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const uploadFile = async (req: Request): Promise<{ fields: Fields, file: Files }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: './public/uploads',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      const file = files.profilePicture?.[0];
      if (file) {
        const newFilename = `${Date.now()}-${file.originalFilename}`;
        const newPath = path.join('./public/uploads', newFilename);
        await fs.rename(file.filepath, newPath);
        file.filepath = `/uploads/${newFilename}`;
      }

      resolve({ fields, file: files });
    });
  });
};