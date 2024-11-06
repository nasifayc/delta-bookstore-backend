import multer from "multer";
import path from "path";

const bookCoverImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/books/covers/");
  },
  filename: (req, file, cb) => {
    cb(null, `cover-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const bookCoverImageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|bmp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed for book cover images"), false);
  }
};

const uploadBookCoverImage = multer({
  storage: bookCoverImageStorage,
  fileFilter: bookCoverImageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for cover images
}).single("coverImage");

export default uploadBookCoverImage;
