// const multer = require("multer");
// const path = require("path");

// // Storage Engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(__dirname, "..", "public/Images"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });




// const fileFilter = (req, file, cb) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/gif",
//     "image/avif",
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
//     "application/vnd.ms-powerpoint",
//     "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
//     "text/plain",
//     "text/csv",
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Unsupported file type!"), false);
//   }
// };

// const upload = multer({ storage: storage, fileFilter });

// module.exports = upload;

// const multer = require("multer");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require("cloudinary").v2;
// const path = require("path");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => {
//     const unique =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);

//     return {
//       folder: "images",
//       resource_type: "image",
//       public_id: unique,
//       format: path.extname(file.originalname).replace(".", ""),
//     };
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;

const createUpload = require("./uploadFactory");

/* Client documents upload */
const upload = createUpload({
  folder: "client-documents",
  resourceType: "raw",
});

/* Expense bill upload */
const expenseBillUpload = createUpload({
  folder: "expense-bills",
  resourceType: "auto",
  allowedMime: [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
  ],
});

module.exports = {
  upload,
  expenseBillUpload,
};


