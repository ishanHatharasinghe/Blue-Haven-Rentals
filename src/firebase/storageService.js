import { storage } from "./firebaseConfig";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

// Validate image file
export const validateImage = (file) => {
  const errors = [];

  // test comment
  // Check file type - support all standard image formats
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
    "image/svg+xml",
    "image/avif",
    "image/heic",
    "image/heif",
  ];
  if (!allowedTypes.includes(file.type)) {
    errors.push(
      "Only standard image formats are allowed (JPEG, PNG, WebP, GIF, BMP, TIFF, SVG, AVIF, HEIC)"
    );
  }

  // Check file size (3MB limit)
  const maxSize = 3 * 1024 * 1024; // 3MB in bytes
  if (file.size > maxSize) {
    errors.push("File size must be under 3MB");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate multiple images (for post uploads)
export const validateImages = (files) => {
  const errors = [];

  // Check number of files
  if (files.length > 5) {
    errors.push("Maximum 5 images allowed");
  }

  // Validate each file
  files.forEach((file, index) => {
    const validation = validateImage(file);
    if (!validation.isValid) {
      errors.push(`Image ${index + 1}: ${validation.errors.join(", ")}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// UPLOAD single image
export const uploadImage = async (file, path) => {
  // Validate image first
  const validation = validateImage(file);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(", "));
  }

  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `${path}/${fileName}`);

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef); // returns public image URL
};

// Upload multiple images with progress callback
export const uploadMultipleImages = async (files, path, onProgress = null) => {
  // Validate all images first
  const validation = validateImages(files);
  if (!validation.isValid) {
    throw new Error(validation.errors.join("\n"));
  }

  const uploadResults = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const imageUrl = await uploadImage(files[i], path);
      uploadResults.push(imageUrl);

      // Call progress callback if provided
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: files.length,
          percentage: Math.round(((i + 1) / files.length) * 100),
        });
      }
    } catch (error) {
      console.error(`Failed to upload image ${i + 1}:`, error);
      errors.push({
        index: i,
        filename: files[i].name,
        error: error.message,
      });
    }
  }

  return {
    success: uploadResults,
    errors,
    successCount: uploadResults.length,
    errorCount: errors.length,
  };
};

// FETCH single image URL
export const fetchImageUrl = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error("Error fetching image URL:", error);
    throw new Error(`Failed to fetch image: ${error.message}`);
  }
};

// FETCH multiple image URLs
export const fetchMultipleImageUrls = async (imagePaths) => {
  const results = [];
  const errors = [];

  for (let i = 0; i < imagePaths.length; i++) {
    try {
      const url = await fetchImageUrl(imagePaths[i]);
      results.push(url);
    } catch (error) {
      console.error(`Failed to fetch image ${i + 1}:`, error);
      errors.push({
        index: i,
        path: imagePaths[i],
        error: error.message,
      });
    }
  }

  return {
    success: results,
    errors,
    successCount: results.length,
    errorCount: errors.length,
  };
};

// DELETE single image
export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

// DELETE multiple images
export const deleteMultipleImages = async (imagePaths) => {
  const results = [];
  const errors = [];

  for (let i = 0; i < imagePaths.length; i++) {
    try {
      await deleteImage(imagePaths[i]);
      results.push(imagePaths[i]);
    } catch (error) {
      console.error(`Failed to delete image ${i + 1}:`, error);
      errors.push({
        index: i,
        path: imagePaths[i],
        error: error.message,
      });
    }
  }

  return {
    success: results,
    errors,
    successCount: results.length,
    errorCount: errors.length,
  };
};

// LIST all images in a folder
export const listImagesInFolder = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);

    const imageUrls = [];
    for (const itemRef of result.items) {
      try {
        const url = await getDownloadURL(itemRef);
        imageUrls.push({
          name: itemRef.name,
          url: url,
          path: itemRef.fullPath,
        });
      } catch (error) {
        console.error(`Failed to get URL for ${itemRef.name}:`, error);
      }
    }

    return imageUrls;
  } catch (error) {
    console.error("Error listing images:", error);
    throw new Error(`Failed to list images: ${error.message}`);
  }
};

// COMPRESS image before upload (client-side compression)
export const compressImage = (
  file,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.8
) => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// UPLOAD with compression
export const uploadCompressedImage = async (
  file,
  path,
  compressionOptions = {}
) => {
  try {
    const compressedFile = await compressImage(
      file,
      compressionOptions.maxWidth || 1920,
      compressionOptions.maxHeight || 1080,
      compressionOptions.quality || 0.8
    );

    // Create a new File object from the compressed blob
    const compressedFileObj = new File([compressedFile], file.name, {
      type: file.type,
      lastModified: Date.now(),
    });

    return await uploadImage(compressedFileObj, path);
  } catch (error) {
    console.error("Error compressing image:", error);
    // Fallback to original upload if compression fails
    return await uploadImage(file, path);
  }
};

// UPLOAD multiple images with compression
export const uploadMultipleCompressedImages = async (
  files,
  path,
  compressionOptions = {},
  onProgress = null
) => {
  const uploadResults = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const imageUrl = await uploadCompressedImage(
        files[i],
        path,
        compressionOptions
      );
      uploadResults.push(imageUrl);

      // Call progress callback if provided
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: files.length,
          percentage: Math.round(((i + 1) / files.length) * 100),
        });
      }
    } catch (error) {
      console.error(`Failed to upload compressed image ${i + 1}:`, error);
      errors.push({
        index: i,
        filename: files[i].name,
        error: error.message,
      });
    }
  }

  return {
    success: uploadResults,
    errors,
    successCount: uploadResults.length,
    errorCount: errors.length,
  };
};

// VALIDATE required images (for mandatory uploads)
export const validateRequiredImages = (files, minCount = 1, maxCount = 5) => {
  const errors = [];

  if (!files || files.length === 0) {
    errors.push(`At least ${minCount} image(s) are required`);
    return { isValid: false, errors };
  }

  if (files.length < minCount) {
    errors.push(
      `Minimum ${minCount} image(s) required, you have ${files.length}`
    );
  }

  if (files.length > maxCount) {
    errors.push(
      `Maximum ${maxCount} image(s) allowed, you have ${files.length}`
    );
  }

  // Validate each file
  files.forEach((file, index) => {
    const validation = validateImage(file);
    if (!validation.isValid) {
      errors.push(`Image ${index + 1}: ${validation.errors.join(", ")}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
