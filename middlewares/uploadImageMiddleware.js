const multer = require("multer");
const ApiError = require("../utils/apiError");

let options = (folderName) => {
  const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, `uploads/${folderName}`);
    // },
    // filename: function (req, file, cb) {
    //   const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    //   cb(null, uniqueSuffix + "-" + file.originalname);
    // },
  });
  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  }
  const upload = multer({ storage, fileFilter });
  return upload;
};

exports.uploadSingleFile = (fieldName, folderName) =>
  options(folderName).single(fieldName);

exports.uploadMixOfFiles = (arrayOfFields, folderName) =>
  options(folderName).fields(arrayOfFields);
