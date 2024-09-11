import { IncomingForm, Fields, Files } from 'formidable';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export const uploadFile = async (req: Request): Promise<{ fields: { name?: string[], bio?: string[] }, file: any }> => {
  const formData = await req.formData();
  const fields: { name?: string[], bio?: string[] } = {};
  let file: any = {};

  for (const [key, value] of formData.entries()) {
    if (key === 'name' || key === 'bio') {
      fields[key] = [value as string];
    } else if (key === 'profilePicture' && value instanceof Blob) {
      const buffer = Buffer.from(await value.arrayBuffer());
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: 'profile_pictures' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });
        file = {
          profilePicture: [{
            filepath: (result as any).secure_url
          }]
        };
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary:', uploadError);
        throw uploadError;
      }
    }
  }

  return { fields, file };
};