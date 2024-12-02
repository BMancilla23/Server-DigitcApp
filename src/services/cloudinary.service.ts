import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";
import streamifier from "streamifier";

// Configuración de cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export const uploadImageToCloudinary = async (
  buffer: Buffer,
  folder: string
): Promise<string> => {
  try {
    return await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            /* console.error("Cloudinary Upload Error:", error); // Log detallado */
            return reject(new Error("Error uploading image to Cloudinary"));
          }
          resolve(result?.secure_url || "");
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  } catch (error) {
    /* console.error("Upload to Cloudinary Failed:", error); */
    throw error;
  }
};

export const processAndUploadImages = async (
  files: Express.Multer.File[],
  folder: string
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const buffer = await sharp(file.buffer)
      .resize(800, 800, { fit: "contain" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    const url = await uploadImageToCloudinary(buffer, folder);
    uploadedUrls.push(url);
  }

  return uploadedUrls;
};
