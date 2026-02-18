// const multer = require("multer");
// const path = require("path");

// // storage setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/resumes");
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });

// // file type filter
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /pdf|doc|docx/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   if (extname) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF/DOC/DOCX files are allowed"));
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;

// ===================================================================================================

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const path = require("path");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// File filter (PDF / DOC / DOCX only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF/DOC/DOCX files are allowed"));
  }
};

// Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    return {
      folder: "resumes",
      resource_type: "raw",
      public_id: uniqueName,
      format: path.extname(file.originalname).replace(".", ""),
    };
  },
});

const multerUpload = multer({ storage, fileFilter });

// 🔥 Wrap single() to inject filename like local storage
const upload = {
  single: (fieldName) => {
    return (req, res, next) => {
      multerUpload.single(fieldName)(req, res, (err) => {
        if (err) return next(err);

        if (req.file) {
          // mimic local disk filename behavior
          req.file.filename = req.file.path;
        }

        next();
      });
    };
  },
};

module.exports = upload;
