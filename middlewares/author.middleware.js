import multer from "multer";
import path from "path";

const authorProfilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/authors/profile-pics/");
  },
  filename: (req, file, cb) => {
    cb(null, `author-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const authorProfilePicFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|bmp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files are allowed for author profile pictures"),
      false
    );
  }
};

const uploadAuthorProfilePic = multer({
  storage: authorProfilePicStorage,
  fileFilter: authorProfilePicFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("authorProfilePic");

export default uploadAuthorProfilePic;
