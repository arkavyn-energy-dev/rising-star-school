const cloudinary = require("../config/cloudinary");

// Streams an in-memory file buffer (from multer) straight to Cloudinary.
const uploadBufferToCloudinary = (buffer, folder = "rising-star-school") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete Cloudinary asset:", error.message);
  }
};

module.exports = { uploadBufferToCloudinary, deleteFromCloudinary };
