import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Store file on disk temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {
    const allloweType = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (allloweType.includes(file.mimetype)) {
      cb(null, true);
    } else cb(new Error("image format not autorized"), false);
  },
});

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, message: "file not define yet" });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "my_uploads",

      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    fs.unlink(file.path, (error) => {
      if (error) {
        console.error("error when file deleting", error);
      }
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      size: result.size,
      format: result.format,
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(file.path, (erro) => {
        if (erro) {
          console.error("error when deleting the file", erro);
        }
      });
    }
    res.status(500).json({ error: error.message });
  }
};
