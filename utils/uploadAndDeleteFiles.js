import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(file, options);
    // console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const uploadVideo = async (file) => {
  const options = {
    resource_type: "video",
    use_filename: true,
    unique_filename: false,
    timeout: 1000 * 60 * 2,
  };

  try {
    const result = await cloudinary.v2.uploader.upload(file, options);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const deleteImage = async (pubilc_id) => {
  try {
    await cloudinary.v2.uploader.destroy(pubilc_id);
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideo = async (public_id) => {
  try {
    await cloudinary.v2.uploader.destroy(public_id, {
      resource_type: "video",
    });
  } catch (error) {
    console.log(error);
  }
};
