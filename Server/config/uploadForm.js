// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const formsDir = path.join(__dirname, "../public/Forms");

// if (!fs.existsSync(formsDir)) {
//   fs.mkdirSync(formsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, formsDir);
//   },
//   filename: function (req, file, cb) {
//     const unique =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     "application/vnd.ms-powerpoint",
//     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//   ];

//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only document files allowed"), false);
// };

// const uploadForm = multer({ storage, fileFilter });

// module.exports = uploadForm;

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Document-only filter
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only document files allowed"), false);
  }
};

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "Forms",
    resource_type: "raw", // IMPORTANT for pdf/doc/excel
    public_id: Date.now() + "-" + file.originalname,
  }),
});

// Same name as your local version
const uploadForm = multer({ storage, fileFilter });

module.exports = uploadForm;
