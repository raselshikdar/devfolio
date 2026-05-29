import { v2 as cloudinary } from "cloudinary";

// ─── Configure Cloudinary ───
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Upload a file to Cloudinary from a base64 data URI or URL.
 * Returns { url, publicId } on success.
 */
export async function uploadToCloudinary(
  file: string,
  folder = "portfolio",
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

/**
 * Delete a file from Cloudinary by its public ID.
 */
export async function deleteFromCloudinary(
  publicId: string,
): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch {
    return false;
  }
}

/**
 * Generate an optimized, responsive image URL from a Cloudinary public ID.
 */
export function getOptimizedUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {},
): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options.width,
        height: options.height,
        crop: "fill",
        quality: options.quality || "auto",
        fetch_format: options.format || "auto",
        dpr: "auto",
      },
    ],
  });
}
