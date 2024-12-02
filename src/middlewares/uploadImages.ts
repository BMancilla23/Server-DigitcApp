import { upload } from "../config/multer";

// Middleware de subida, soporta tanto una imagen como múltiples
export const uploadImages = (field: string, multiple: boolean = false) =>
  multiple ? upload.array(field) : upload.single(field);

/* // Middleware de procesamiento y subida a Cloudinary
export const processAndUploadImage =
  (folder: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const files = Array.isArray(req.files) ? req.files : [req.file];
    if (!files || files.length === 0) return next();

    try {
      // Crear un arreglo para almacenar URLs de Cloudinary
      const cloudinaryUrls: string[] = [];

      // Procesar cada imagen y subirla a Cloudinary
      for (const file of files) {
        const buffer = await sharp(file?.buffer)
          .resize(800, 800, { fit: "cover" })
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();

        // Subida de cada imagen a Cloudinary
        const uploadResult = await new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder },
            (err, result) => {
              if (err) return reject(err);
              resolve(result?.secure_url || "");
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });

        cloudinaryUrls.push(uploadResult);
      }

      // Asigna URLs subidas al campo adecuado en el request
      req.body.images =
        cloudinaryUrls.length > 1 ? cloudinaryUrls : cloudinaryUrls[0];
      next();
    } catch (error) {
      next(error);
    }
  };
 */
