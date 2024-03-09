const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

exports.localFileUpload = async (req, res) => {
  try {
    const file = req.files.file;
    console.log("FILE AAGYO JEE->", file);

    const path =
      __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    console.log("PATH->", path);
    file.mv(path, (error) => {
      console.log(error);
    });
    res.json({
      success: true,
      message: "File uploaded to server successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, height) {
  const options = { folder };

  if (height) {
    options.height = height;
  }
  options.resource_type = "auto";
  return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async (req, res) => {
  try {
    const { name, tags, email } = req.body;
    console.log(name, tags, email);
    const file = req.files.imageFile;
    console.log(file);

    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format is not supported",
      });
    }
    const response = await uploadFileToCloudinary(file, "AmanUpload");
    console.log(response);

    const fileData = await File.create({
      name,
      tags,
      email,
      imageUrl: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Image successfully uploaded to cloudinary",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.videoUpload = async (req, res) => {
  try {
    const { name, email, tags } = req.body;
    console.log(name, email, tags);

    const file = req.files.videoFile;
    console.log(file);

    const supportedTypes = ["mp4", "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("file type", fileType);

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.json({
        success: false,
        message: "File Format is not supported",
      });
    }

    const response = await uploadFileToCloudinary(file, "AmanUpload");

    console.log(response);

    const fileData = await File.create({
      name,
      email,
      tags,
      imageUrl: response.secure_url,
    });
    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "video successfully uploaded to cloudinary",
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

exports.imageSizeReducer = async (req, res) => {
  try {
    const { name, tags, email } = req.body;
    console.log(name, tags, email);

    const file = req.files.imageFile;
    console.log(file);

    const supportedTypes = ["jpg", "jpeg", "png"];
    const fileType = file.name.split(".")[1].toLowerCase();

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format is not supported",
      });
    }

    const response = await uploadFileToCloudinary(file, "AmanUpload", 50);
    console.log(response);

    const fileData = await File.create({
      name,
      email,
      tags,
      imageUrl: response.secure_url,
    });

    res.status(200).json({
      success: true,
      imageUrl: response.secure_url,
      message: "Image of reduce size is successfully upload to cloudinary",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
