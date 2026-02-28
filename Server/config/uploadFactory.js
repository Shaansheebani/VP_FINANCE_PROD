const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const cloudinary = require("./cloudinary");

const createUpload = ({
  folder = "uploads",
  resourceType = "auto",
  allowedMime = [],
}) => {
  const fileFilter = (req, file, cb) => {
    if (!allowedMime.length) return cb(null, true);

    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"), false);
    }
  };

  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder,
      resource_type: resourceType,
      public_id: Date.now() + "-" + Math.round(Math.random() * 1e9),
      format: path.extname(file.originalname).replace(".", ""),
    }),
  });

  const multerUpload = multer({ storage, fileFilter });

  return {
    single: (field) => (req, res, next) => {
      multerUpload.single(field)(req, res, (err) => {
        if (err) return next(err);
        if (req.file) req.file.filename = req.file.path;
        next();
      });
    },

    array: (field, maxCount) => (req, res, next) => {
      multerUpload.array(field, maxCount)(req, res, (err) => {
        if (err) return next(err);

        if (req.files) {
          req.files.forEach((f) => {
            f.filename = f.path;
          });
        }

        next();
      });
    },

    fields: (fieldsArray) => (req, res, next) => {
      multerUpload.fields(fieldsArray)(req, res, (err) => {
        if (err) return next(err);

        if (req.files) {
          Object.keys(req.files).forEach((key) => {
            req.files[key].forEach((f) => {
              f.filename = f.path;
            });
          });
        }

        next();
      });
    },
  };
};

module.exports = createUpload;