import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Define more specific types
interface UploadFields {
  name?: string[];
  bio?: string[];
}

interface UploadFile {
  profilePicture?: {
    filepath: string;
  }[];
}

interface UploadResult {
  fields: UploadFields;
  file: UploadFile;
}

// Define the Cloudinary upload result type
interface CloudinaryUploadResult {
  secure_url: string;
  // Add other properties you might need from the Cloudinary result
}

export const uploadFile = async (req: Request): Promise<UploadResult> => {
  const formData = await req.formData();
  const fields: UploadFields = {};
  const file: UploadFile = {};

  for (const [key, value] of formData.entries()) {
    if (key === 'name' || key === 'bio') {
      fields[key] = [value as string];
    } else if (key === 'profilePicture' && value instanceof Blob) {
      const buffer = Buffer.from(await value.arrayBuffer());
      try {
        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'profile_pictures' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as CloudinaryUploadResult);
            }
          ).end(buffer);
        });
        file.profilePicture = [{
          filepath: result.secure_url
        }];
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        throw uploadError;
      }
    }
  }

  return { fields, file };
};