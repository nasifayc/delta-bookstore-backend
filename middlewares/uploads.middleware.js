import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = {
      pdf: /pdf$/,
      image: /jpeg|jpg|png|gif|bmp$/, // Acceptable image formats
    };
    const extname = filetypes[file.fieldname]
      ? filetypes[file.fieldname].test(
          path.extname(file.originalname).toLowerCase()
        )
      : false;

    if (extname) {
      return cb(null, true);
    } else {
      cb(
        "Error: File upload only supports the following filetypes - " +
          filetypes
      );
    }
  },
}).fields([
  { name: "pdf", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "authorProfilePic", maxCount: 1 },
]); // Expecting one file each for pdf and coverImage

export default upload;
