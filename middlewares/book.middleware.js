import multer from "multer";
import path from "path";

// Single storage engine for both PDF and cover images
const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "pdf") {
      cb(null, "uploads/books/pdfs/");
    } else if (file.fieldname === "coverImage") {
      cb(null, "uploads/books/covers/");
    } else if (file.fieldname === "audio") {
      cb(null, "uploads/books/audios/");
    } else {
      cb(new Error("Invalid field name"), false);
    }
  },
  filename: (req, file, cb) => {
    let prefix;
    if (file.fieldname === "pdf") {
      prefix = "book";
    } else if (file.fieldname === "coverImage") {
      prefix = "cover";
    } else if (file.fieldname === "audio") {
      prefix = "audio";
    } else {
      return cb(new Error("Invalid field name"), false);
    }
    cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Unified file filter function
const bookFileFilter = (req, file, cb) => {
  if (file.fieldname === "pdf") {
    // PDF validation
    const isPdf = /pdf/.test(path.extname(file.originalname).toLowerCase());
    cb(isPdf ? null : new Error("Only PDF files are allowed"), isPdf);
  } else if (file.fieldname === "coverImage") {
    // Image validation
    const isImage = /jpeg|jpg|png|gif|bmp/.test(
      path.extname(file.originalname).toLowerCase()
    );
    cb(isImage ? null : new Error("Only image files are allowed"), isImage);
  } else if (file.fieldname === "audio") {
    // Audio validation
    const isAudio = /mp3|wav|aac|m4a/.test(
      path.extname(file.originalname).toLowerCase()
    );
    cb(isAudio ? null : new Error("Only audio files are allowed"), isAudio);
  } else {
    cb(new Error("Invalid field name"), false);
  }
};

// Configure Multer to handle multiple files
const bookUpload = multer({
  storage: bookStorage,
  fileFilter: bookFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for both PDFs and images
}).fields([
  { name: "pdf", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "audio", maxCount: 10 },
]);

export default bookUpload;
