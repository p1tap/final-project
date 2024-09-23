import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Define the Cloudinary upload result type
interface CloudinaryUploadResult {
  secure_url: string;
}

export const uploadFile = async (file: File, folder: string): Promise<string> => {
  // console.log('Uploading file:', file.name, 'to folder:', folder);
  const buffer = Buffer.from(await file.arrayBuffer());
  
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          // console.log('Cloudinary upload result:', result);
          resolve((result as CloudinaryUploadResult).secure_url);
        }
      }
    ).end(buffer);
  });
};